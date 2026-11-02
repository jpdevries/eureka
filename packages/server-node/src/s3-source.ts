// A media source backed by an S3-compatible bucket (AWS S3, Cloudflare R2, MinIO, Backblaze B2, DigitalOcean Spaces, …).
// Spec 11 (media sources): directories are key prefixes ending in "/", a folder with no objects is a zero-byte marker
// object named "{prefix}/"; rename is copy + delete; listing and the tree are ListObjectsV2 with a delimiter, one per folder.
import path from 'node:path';
import { Readable } from 'node:stream';
import { imageSize } from 'image-size';
import { ZipFile } from 'yazl';
import { encodePathForURL, normalizePath, joinPath, parentPath, basename, mediaKind, isTextLike, looksBinary, renderTextThumbnail } from '@mrktps/eureka-core';
import type { Entry, Source, TreeNode } from '@mrktps/eureka-core';
import { ANIMATABLE, DEFAULT_TREE_DEPTH, MIME, PathError, clampDepth, sniffAnimated, type MediaSource } from './fs-source.js';
import { sanitizeFilename } from './multipart.js';
import { S3Client, type S3Credentials, type S3Object } from './s3/client.js';

export interface S3SourceOptions {
  id: Source['id'];
  name: string;
  bucket: string;
  region?: string;
  /** Service endpoint for non-AWS providers, e.g. `https://{account}.r2.cloudflarestorage.com` or `http://localhost:9000`. */
  endpoint?: string;
  forcePathStyle?: boolean;
  credentials: S3Credentials;
  /** Key prefix the source is confined to (a "folder" in the bucket), with or without the trailing slash. */
  prefix?: string;
  /** URL prefix under which the handler proxies the objects (default `/sources/{name}`). */
  urlPrefix?: string;
  /**
   * Public base URL of the bucket or its CDN (e.g. `https://cdn.example.com`): entries then link straight to it and the
   * server never proxies bytes. Without it, `absoluteURL` is `{urlPrefix}/{path}` and the handler streams through `open`.
   */
  publicBaseUrl?: string;
  /** Build a preview URL (a thumbnail service, an image CDN). Default: the text thumbnail route for text, else the file. */
  previewUrl?: (entry: Entry, saveData: boolean) => string;
  /**
   * Read the first 64 KB of each image once (cached by ETag) for `dimensions` and `animated`, which ListObjects cannot
   * give (default true). Off, entries carry neither; a bucket pipeline can set them another way.
   */
  probe?: boolean;
  /** Hide keys whose last segment starts with "." (default true). */
  hideDotfiles?: boolean;
  /** How long a folder-tree level is reused, in ms (default 30 000); mutations drop the cache anyway. */
  treeTtl?: number;
  fetch?: typeof fetch;
}

const PROBE_BYTES = 64 * 1024;
const THUMB_BYTES = 8192;

export function createS3Source(opts: S3SourceOptions): MediaSource {
  const client = new S3Client({ bucket: opts.bucket, ...(opts.region ? { region: opts.region } : {}), ...(opts.endpoint ? { endpoint: opts.endpoint } : {}), ...(opts.forcePathStyle !== undefined ? { forcePathStyle: opts.forcePathStyle } : {}), credentials: opts.credentials, ...(opts.fetch ? { fetch: opts.fetch } : {}) });
  const rootPrefix = normalizePath(opts.prefix) === '/' ? '' : normalizePath(opts.prefix) + '/';
  const urlPrefix = (opts.urlPrefix ?? `/sources/${encodeURIComponent(opts.name)}`).replace(/\/+$/, '');
  const publicBase = opts.publicBaseUrl?.replace(/\/+$/, '');
  const hideDot = opts.hideDotfiles ?? true;
  const probe = opts.probe ?? true;
  const treeTtl = opts.treeTtl ?? 30_000;
  const probes = new Map<string, { dimensions?: [number, number]; animated?: boolean }>(); // by key + etag, LRU
  const thumbs = new Map<string, { svg: string; etag: string }>();
  const treeCache = new Map<string, { at: number; nodes: TreeNode[] }>(); // by cd and depth

  /** Source-relative path → confined key (01 CON-02). The root maps to the bare prefix. */
  function resolve(p: string): { rel: string; key: string } {
    const rel = normalizePath(decodeURIComponentSafe(p));
    if (rel.split('/').some((seg) => seg === '..' || seg === '.')) throw new PathError('path escapes the source', 400);
    return { rel, key: rel === '/' ? rootPrefix : rootPrefix + rel };
  }
  const dirKey = (rel: string) => (rel === '/' ? rootPrefix : rootPrefix + rel + '/');
  const relOf = (key: string) => normalizePath(key.slice(rootPrefix.length));
  const urlFor = (rel: string) => (publicBase ? `${publicBase}/${encodePathForURL(rootPrefix + rel)}` : `${urlPrefix}/${encodePathForURL(rel)}`);
  const contentTypeFor = (name: string) => MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
  const hidden = (name: string) => hideDot && name.startsWith('.');
  const remember = <V>(map: Map<string, V>, key: string, value: V, max: number) => { map.set(key, value); if (map.size > max) map.delete(map.keys().next().value as string); };

  /** Dimensions and animation from the head of an image, once per key + ETag. */
  async function probeImage(o: S3Object): Promise<{ dimensions?: [number, number]; animated?: boolean }> {
    const cacheKey = `${o.key}:${o.etag}`;
    const hit = probes.get(cacheKey);
    if (hit) { probes.delete(cacheKey); probes.set(cacheKey, hit); return hit; }
    const out: { dimensions?: [number, number]; animated?: boolean } = {};
    if (o.size === 0) return out;
    try {
      const res = await client.get(o.key, { start: 0, end: Math.min(o.size, PROBE_BYTES) - 1 });
      if (res) {
        const buf = Buffer.from(await res.arrayBuffer());
        try { const d = imageSize(buf); if (d.width && d.height) out.dimensions = [d.width, d.height]; } catch { /* not decodable from the head */ }
        if (ANIMATABLE.includes(path.extname(o.key).toLowerCase()) && sniffAnimated(buf, o.key)) out.animated = true;
      }
    } catch { /* a probe never fails a listing */ }
    remember(probes, cacheKey, out, 5000);
    return out;
  }

  async function fileEntry(o: S3Object, dirRel: string, saveData: boolean): Promise<Entry> {
    const rel = relOf(o.key);
    const name = basename(rel);
    const e: Entry = { directory: dirRel, path: rel, filename: name, absoluteURL: urlFor(rel), editedOn: o.lastModified, fileSize: o.size };
    if (probe && mediaKind(name) === 'image') Object.assign(e, await probeImage(o));
    e.absolutePreviewURL = opts.previewUrl ? opts.previewUrl(e, saveData) : isTextLike(name) ? `${urlPrefix}/__thumb/${encodePathForURL(rel)}` : e.absoluteURL;
    return e;
  }

  async function listDirectory(dir: string, saveData = false): Promise<Entry[]> {
    const { rel } = resolve(dir);
    const prefix = dirKey(rel);
    const { objects, prefixes } = await client.list(prefix, '/');
    if (rel !== '/' && objects.length === 0 && prefixes.length === 0) throw new PathError(`no such directory: ${rel}`, 404);
    const folders: Entry[] = prefixes.map((p) => relOf(p)).filter((r) => !hidden(basename(r))).map((r) => {
      const marker = objects.find((o) => o.key === dirKey(r));
      return { directory: r, path: r, foldername: basename(r), absoluteURL: urlFor(r), editedOn: marker?.lastModified ?? 0, fileSize: 0 };
    });
    const files = objects.filter((o) => o.key !== prefix && !o.key.endsWith('/') && !hidden(basename(o.key)));
    const entries: Entry[] = [...folders];
    for (let i = 0; i < files.length; i += 4) entries.push(...await Promise.all(files.slice(i, i + 4).map((o) => fileEntry(o, rel, saveData)))); // four probes at a time
    return entries.sort((a, b) => { const x = a.filename ?? a.foldername ?? '', y = b.filename ?? b.foldername ?? ''; return x < y ? -1 : x > y ? 1 : 0; }); // code-point order, like the filesystem source
  }

  /** The subfolders of `cd`, `depth` levels deep, one delimiter listing per folder (four in flight), cached `treeTtl` (11 MS-22). */
  async function listTree(cd = '/', depth = DEFAULT_TREE_DEPTH): Promise<TreeNode[]> {
    const { rel } = resolve(cd);
    const d = clampDepth(depth);
    const cacheKey = `${rel}:${d}`;
    const hit = treeCache.get(cacheKey);
    if (hit && Date.now() - hit.at < treeTtl) return hit.nodes;
    if (rel !== '/') { const { objects, prefixes } = await client.list(dirKey(rel), '/'); if (!objects.length && !prefixes.length) throw new PathError(`no such directory: ${rel}`, 404); }
    const level = async (parent: string, remaining: number): Promise<TreeNode[]> => {
      const { prefixes } = await client.list(dirKey(parent), '/');
      const cds = prefixes.map((p) => relOf(p)).filter((r) => !hidden(basename(r))).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      const nodes: TreeNode[] = [];
      for (let i = 0; i < cds.length; i += 4) nodes.push(...await Promise.all(cds.slice(i, i + 4).map(async (r): Promise<TreeNode> => (remaining > 1 ? { name: basename(r), cd: r, children: await level(r, remaining - 1) } : { name: basename(r), cd: r }))));
      return nodes;
    };
    const nodes = await level(rel, d);
    treeCache.set(cacheKey, { at: Date.now(), nodes });
    if (treeCache.size > 200) treeCache.delete(treeCache.keys().next().value as string);
    return nodes;
  }
  const invalidate = () => { treeCache.clear(); };

  /** Every key at or under a path: the object itself, or the marker and all descendants of a folder. */
  async function keysUnder(rel: string): Promise<string[]> {
    const { objects } = await client.list(dirKey(rel));
    const keys = objects.map((o) => o.key);
    const head = await client.head(rootPrefix + rel);
    if (head) keys.push(rootPrefix + rel);
    return keys;
  }

  return {
    id: opts.id, name: opts.name,
    listTree,
    listDirectory: (dir) => listDirectory(dir),
    async upload(dir, files) {
      const { rel } = resolve(dir);
      for (const f of files) { const name = sanitizeFilename(f.filename); await client.put(dirKey(rel) + name, f.data, f.contentType && f.contentType !== 'application/octet-stream' ? f.contentType : contentTypeFor(name)); }
      invalidate();
      return listDirectory(rel);
    },
    async createDirectory(dir) {
      const { rel } = resolve(dir);
      if (rel === '/') return;
      await client.put(dirKey(rel), Buffer.alloc(0), 'application/x-directory');
      invalidate();
    },
    async rename(p, name) {
      const { rel, key } = resolve(p);
      if (rel === '/') throw new PathError('refusing to rename the source root', 400);
      const clean = sanitizeFilename(name);
      const targetRel = joinPath(parentPath(rel), clean);
      if (targetRel === rel) return listDirectory(parentPath(rel));
      const isFile = (await client.head(key)) !== null;
      if (isFile) {
        if (await client.head(rootPrefix + targetRel)) throw new PathError(`${clean} already exists`, 409);
        await client.copy(key, rootPrefix + targetRel);
        await client.delete(key);
      } else {
        const keys = await keysUnder(rel);
        if (keys.length === 0) throw new PathError(`no such file or directory: ${rel}`, 404);
        const taken = await client.list(dirKey(targetRel));
        if (taken.objects.length) throw new PathError(`${clean} already exists`, 409);
        for (const k of keys) await client.copy(k, dirKey(targetRel) + k.slice(dirKey(rel).length));
        await client.deleteMany(keys);
      }
      invalidate();
      return listDirectory(parentPath(rel));
    },
    async remove(p) {
      const { rel, key } = resolve(p);
      if (rel === '/') throw new PathError('refusing to delete the source root', 400);
      const keys = (await client.head(key)) ? [key] : await keysUnder(rel);
      if (keys.length === 0) throw new PathError(`no such file or directory: ${rel}`, 404);
      await client.deleteMany(keys);
      invalidate();
    },
    async removeMany(dir, filenames) {
      const { rel } = resolve(dir);
      const keys: string[] = [];
      for (const n of filenames) { const child = resolve(joinPath(rel, sanitizeFilename(n))); keys.push(...((await client.head(child.key)) ? [child.key] : await keysUnder(child.rel))); }
      if (keys.length) await client.deleteMany(keys);
      invalidate();
      return listDirectory(rel);
    },
    async zip(dir, filenames) {
      const { rel } = resolve(dir);
      const zip = new ZipFile();
      for (const n of filenames) {
        const { key } = resolve(joinPath(rel, sanitizeFilename(n)));
        const res = await client.get(key);
        if (res?.body) zip.addReadStream(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), basename(n));
      }
      zip.end();
      return zip.outputStream as unknown as Readable;
    },
    async open(p, range) {
      let r; try { r = resolve(p); } catch { return null; }
      if (r.rel === '/') return null;
      const res = await client.get(r.key, range);
      if (!res) return null;
      const contentType = contentTypeFor(r.rel) === 'application/octet-stream' ? res.headers.get('content-type') ?? 'application/octet-stream' : contentTypeFor(r.rel);
      const toStream = () => (res.body ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream) : Readable.from([]));
      if (range) {
        const m = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(res.headers.get('content-range') ?? '');
        if (res.status === 416 || !m) { // unsatisfiable: the handler answers 416 from size
          const total = Number(/\/(\d+)$/.exec(res.headers.get('content-range') ?? '')?.[1] ?? res.headers.get('content-length') ?? 0);
          await res.body?.cancel();
          return { stream: Readable.from([]), size: total, contentType, start: range.start, end: range.start - 1 };
        }
        return { stream: toStream(), size: Number(m[3]), contentType, start: Number(m[1]), end: Number(m[2]) };
      }
      return { stream: toStream(), size: Number(res.headers.get('content-length') ?? 0), contentType };
    },
    async thumbnail(p) { // 02 HTML-66c: the first 8 KB of a text-like object, cached by ETag
      let r; try { r = resolve(p); } catch { return null; }
      if (r.rel === '/' || !isTextLike(r.rel)) return null;
      const head = await client.head(r.key);
      if (!head) return null;
      const cacheKey = `${r.key}:${head.etag}:${head.size}`;
      const hit = thumbs.get(cacheKey);
      if (hit) { thumbs.delete(cacheKey); thumbs.set(cacheKey, hit); return hit; }
      const res = await client.get(r.key, { start: 0, end: Math.max(0, Math.min(head.size, THUMB_BYTES) - 1) });
      if (!res) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (looksBinary(buf)) return null;
      const entry = { svg: renderTextThumbnail(buf.toString('utf8'), { filename: basename(r.rel) }), etag: `"t-${head.size.toString(16)}-${head.etag.replace(/\W/g, '').slice(0, 16)}"` };
      remember(thumbs, cacheKey, entry, 500);
      return entry;
    }
  };
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
