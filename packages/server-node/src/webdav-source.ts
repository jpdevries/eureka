// A media source over WebDAV (RFC 4918): Nextcloud, ownCloud, Synology, Fastmail Files, Apache mod_dav, … (spec 11 §5,
// MS-60..MS-65). PROPFIND Depth: 1 is the listing and one tree level; MOVE is rename; DELETE removes a collection whole.
import path from 'node:path';
import { Readable } from 'node:stream';
import { ZipFile } from 'yazl';
import { imageSize } from 'image-size';
import { encodePathForURL, normalizePath, joinPath, parentPath, basename, mediaKind, isTextLike, looksBinary, renderTextThumbnail, READ_ONLY } from '@mrktps/eureka-core';
import type { Entry, Source, SourceCapabilities, TreeNode } from '@mrktps/eureka-core';
import { ANIMATABLE, DEFAULT_TREE_DEPTH, MIME, PathError, clampDepth, sniffAnimated, type MediaSource, type PreviewResult } from './fs-source.js';
import { sanitizeFilename } from './multipart.js';
import { DavClient, DavError, type DavResource } from './webdav/client.js';

export interface WebDavSourceOptions {
  id: Source['id'];
  name: string;
  /** The collection to browse, e.g. `https://cloud.example.org/remote.php/dav/files/jp/Photos/`. */
  url: string;
  username?: string;
  password?: string;
  token?: string;
  urlPrefix?: string;
  previewUrl?: (entry: Entry, saveData: boolean) => string;
  /** Read the first 64 KB of each image once (cached by ETag) for `dimensions` and `animated`, which PROPFIND cannot give (default true). */
  probe?: boolean;
  /**
   * Serve Nextcloud's preview endpoint through the preview route (MS-65). Default: detected from a
   * `/remote.php/dav/files/{user}/…` URL; set false to disable, or an origin to force it.
   */
  nextcloudPreviews?: boolean | string;
  readOnly?: boolean;
  capabilities?: SourceCapabilities;
  /** How long a tree level is reused, in ms (default 30 000); mutations drop the cache. */
  treeTtl?: number;
  fetch?: typeof fetch;
}

const PROBE_BYTES = 64 * 1024;
const THUMB_BYTES = 8192;
const PREVIEW_WIDTHS = [220, 440, 880];

export function createWebDavSource(opts: WebDavSourceOptions): MediaSource {
  const client = new DavClient({ url: opts.url, ...(opts.username !== undefined ? { username: opts.username } : {}), ...(opts.password !== undefined ? { password: opts.password } : {}), ...(opts.token ? { token: opts.token } : {}), ...(opts.fetch ? { fetch: opts.fetch } : {}) });
  const urlPrefix = (opts.urlPrefix ?? `/sources/${encodeURIComponent(opts.name)}`).replace(/\/+$/, '');
  const probe = opts.probe ?? true;
  const treeTtl = opts.treeTtl ?? 30_000;
  const f = opts.fetch ?? fetch;
  const probes = new Map<string, { dimensions?: [number, number]; animated?: boolean }>();
  const thumbs = new Map<string, { svg: string; etag: string }>();
  const treeCache = new Map<string, { at: number; nodes: TreeNode[] }>();

  // Nextcloud: previews live at {origin}/index.php/core/preview?file={path under the user's files root}
  const nc = /^(\/.*?)?\/remote\.php\/dav\/files\/[^/]+(\/.*)?$/.exec(client.basePath);
  const ncOrigin = typeof opts.nextcloudPreviews === 'string' ? opts.nextcloudPreviews.replace(/\/+$/, '') : opts.nextcloudPreviews !== false && nc ? `${client.base.origin}${nc[1] ?? ''}` : null;
  const ncSub = nc?.[2]?.replace(/\/+$/, '') ?? '';

  const urlFor = (rel: string) => `${urlPrefix}/${encodePathForURL(rel)}`;
  /** What Nextcloud can render a preview of (MS-65); text keeps its SVG thumbnail. */
  const picturable = (name: string) => !!ncOrigin && !isTextLike(name) && (mediaKind(name) === 'image' || mediaKind(name) === 'video' || /\.(pdf|tiff?|psd|heic)$/i.test(name));
  const contentTypeFor = (name: string, fallback?: string) => MIME[path.extname(name).toLowerCase()] ?? (fallback && fallback !== 'application/octet-stream' ? fallback : 'application/octet-stream');
  const remember = <V>(map: Map<string, V>, key: string, value: V, max: number) => { map.set(key, value); if (map.size > max) map.delete(map.keys().next().value as string); };
  const invalidate = () => { treeCache.clear(); };

  function resolve(p: string): string {
    const rel = normalizePath(decodeURIComponentSafe(p));
    if (rel.split('/').some((seg) => seg === '..' || seg === '.')) throw new PathError('path escapes the source', 400);
    return rel;
  }
  /** PROPFIND Depth 1: the collection's children (its own entry dropped). 404 when it does not exist or is a file. */
  async function children(rel: string): Promise<DavResource[]> {
    const rs = await client.propfind(rel, 1);
    if (!rs) throw new PathError(`no such directory: ${rel}`, 404);
    const self = rs.find((r) => r.path === rel);
    if (self && !self.collection) throw new PathError(`no such directory: ${rel}`, 404);
    return rs.filter((r) => r.path !== rel && parentPath(r.path) === rel && !r.name.startsWith('.')).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }
  async function stat(rel: string): Promise<DavResource | null> {
    if (rel === '/') return { path: '/', name: '', collection: true, size: 0, modified: 0, etag: '', contentType: '' };
    const rs = await client.propfind(rel, 0);
    return rs?.find((r) => r.path === rel) ?? rs?.[0] ?? null;
  }

  async function probeImage(r: DavResource): Promise<{ dimensions?: [number, number]; animated?: boolean }> {
    const key = `${r.path}:${r.etag || r.modified}:${r.size}`;
    const hit = probes.get(key); if (hit) return hit;
    const out: { dimensions?: [number, number]; animated?: boolean } = {};
    if (r.size > 0) {
      try {
        const res = await client.get(r.path, { start: 0, end: Math.min(r.size, PROBE_BYTES) - 1 });
        if (res) {
          const buf = Buffer.from(await res.arrayBuffer());
          try { const d = imageSize(buf); if (d.width && d.height) out.dimensions = [d.width, d.height]; } catch { /* not decodable from the head */ }
          if (ANIMATABLE.includes(path.extname(r.name).toLowerCase()) && sniffAnimated(buf, r.name)) out.animated = true;
        }
      } catch { /* a probe never fails a listing */ }
    }
    remember(probes, key, out, 5000);
    return out;
  }

  async function entryFor(r: DavResource, dirRel: string, saveData: boolean): Promise<Entry> {
    if (r.collection) return { directory: r.path, path: r.path, foldername: r.name, absoluteURL: urlFor(r.path), editedOn: r.modified, fileSize: 0 };
    const e: Entry = { directory: dirRel, path: r.path, filename: r.name, absoluteURL: urlFor(r.path), editedOn: r.modified, fileSize: r.size };
    const image = mediaKind(r.name) === 'image';
    if (probe && image) Object.assign(e, await probeImage(r));
    const pictured = picturable(r.name);
    e.absolutePreviewURL = opts.previewUrl ? opts.previewUrl(e, saveData)
      : isTextLike(r.name) ? `${urlPrefix}/__thumb/${encodePathForURL(r.path)}`
      : pictured ? `${urlPrefix}/__preview/${encodePathForURL(r.path)}`
      : e.absoluteURL;
    if (!opts.previewUrl && pictured) {
      const max = e.dimensions ? Math.max(e.dimensions[0], e.dimensions[1]) : Infinity;
      e.renditions = PREVIEW_WIDTHS.filter((w, i) => i === 0 || w <= max).map((w) => ({ url: `${urlPrefix}/__preview/${encodePathForURL(r.path)}?w=${w}`, width: w, type: 'image/jpeg' }));
    }
    return e;
  }

  async function listDirectory(dir: string, saveData = false): Promise<Entry[]> {
    const rel = resolve(dir);
    const rs = await children(rel);
    const entries: Entry[] = [];
    for (let i = 0; i < rs.length; i += 4) entries.push(...await Promise.all(rs.slice(i, i + 4).map((r) => entryFor(r, rel, saveData))));
    return entries;
  }

  async function listTree(cd = '/', depth = DEFAULT_TREE_DEPTH): Promise<TreeNode[]> {
    const rel = resolve(cd);
    const d = clampDepth(depth);
    const key = `${rel}:${d}`;
    const hit = treeCache.get(key);
    if (hit && Date.now() - hit.at < treeTtl) return hit.nodes;
    const level = async (dirRel: string, remaining: number): Promise<TreeNode[]> => {
      const folders = (await children(dirRel)).filter((r) => r.collection);
      const out: TreeNode[] = [];
      for (let i = 0; i < folders.length; i += 4) out.push(...await Promise.all(folders.slice(i, i + 4).map(async (r): Promise<TreeNode> => (remaining > 1 ? { name: r.name, cd: r.path, children: await level(r.path, remaining - 1) } : { name: r.name, cd: r.path }))));
      return out;
    };
    const nodes = await level(rel, d);
    remember(treeCache, key, { at: Date.now(), nodes }, 200);
    return nodes;
  }

  const refused = (err: unknown): never => { if (err instanceof DavError && err.status === 403) source.capabilities = { ...READ_ONLY }; throw err; };
  const guarded = <A extends unknown[], R>(fn: (...a: A) => Promise<R>) => async (...a: A): Promise<R> => { try { return await fn(...a); } catch (err) { return refused(err); } };

  const source: MediaSource = {
    id: opts.id, name: opts.name,
    ...(opts.readOnly ? { capabilities: { ...READ_ONLY } } : opts.capabilities ? { capabilities: { ...opts.capabilities } } : {}),
    listTree,
    listDirectory: (dir) => listDirectory(dir),
    upload: guarded(async (dir, files) => {
      const rel = resolve(dir);
      await children(rel); // 404 before any PUT when the directory is missing
      for (const file of files) { const name = sanitizeFilename(file.filename); await client.put(joinPath(rel, name), file.data, file.contentType && file.contentType !== 'application/octet-stream' ? file.contentType : contentTypeFor(name)); }
      invalidate();
      return listDirectory(rel);
    }),
    createDirectory: guarded(async (dir) => {
      const rel = resolve(dir);
      if (rel === '/') return;
      try { await client.mkcol(rel); } catch (err) { if (!(err instanceof DavError && err.status === 409 && (await stat(rel))?.collection)) throw err; } // 405 "exists" is fine (MS-06)
      invalidate();
    }),
    rename: guarded(async (p, name) => {
      const rel = resolve(p);
      if (rel === '/') throw new PathError('refusing to rename the source root', 400);
      const clean = sanitizeFilename(name);
      const target = joinPath(parentPath(rel), clean);
      if (target !== rel) {
        const r = await stat(rel);
        if (!r) throw new PathError(`no such file or directory: ${rel}`, 404);
        if ((await client.move(rel, target, r.collection)) === 'exists') throw new PathError(`${clean} already exists`, 409);
        invalidate();
      }
      return listDirectory(parentPath(rel));
    }),
    remove: guarded(async (p) => {
      const rel = resolve(p);
      if (rel === '/') throw new PathError('refusing to delete the source root', 400);
      const r = await stat(rel);
      if (!r) throw new PathError(`no such file or directory: ${rel}`, 404);
      await client.delete(rel, r.collection);
      invalidate();
    }),
    removeMany: guarded(async (dir, filenames) => {
      const rel = resolve(dir);
      for (const n of filenames) { const child = resolve(joinPath(rel, sanitizeFilename(n))); const r = await stat(child); if (r) await client.delete(child, r.collection); }
      invalidate();
      return listDirectory(rel);
    }),
    async zip(dir, filenames) {
      const rel = resolve(dir);
      const zip = new ZipFile();
      for (const n of filenames) {
        const child = resolve(joinPath(rel, sanitizeFilename(n)));
        const r = await stat(child); if (!r || r.collection) continue;
        const res = await client.get(child);
        if (res?.body) zip.addReadStream(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), basename(n));
      }
      zip.end();
      return zip.outputStream as unknown as Readable;
    },
    async open(p, range) {
      let rel: string; try { rel = resolve(p); } catch { return null; }
      if (rel === '/') return null;
      const res = await client.get(rel, range);
      if (!res) return null;
      if (res.status === 200 && (res.headers.get('content-type') ?? '').includes('text/html') && !/\.html?$/i.test(rel) && (await client.propfind(rel, 0))?.[0]?.collection) { await res.body?.cancel(); return null; } // a collection answered with an index page
      const contentType = contentTypeFor(rel, res.headers.get('content-type') ?? undefined);
      const toStream = () => (res.body ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream) : Readable.from([]));
      if (range) {
        const m = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(res.headers.get('content-range') ?? '');
        if (res.status === 416 || !m) { const total = Number(/\/(\d+)$/.exec(res.headers.get('content-range') ?? '')?.[1] ?? res.headers.get('content-length') ?? 0); await res.body?.cancel(); return { stream: Readable.from([]), size: total, contentType, start: range.start, end: range.start - 1 }; }
        return { stream: toStream(), size: Number(m[3]), contentType, start: Number(m[1]), end: Number(m[2]) };
      }
      return { stream: toStream(), size: Number(res.headers.get('content-length') ?? 0), contentType };
    },
    async thumbnail(p) {
      let rel: string; try { rel = resolve(p); } catch { return null; }
      if (rel === '/' || !isTextLike(rel)) return null;
      const r = await stat(rel);
      if (!r || r.collection) return null;
      const key = `${rel}:${r.etag || r.modified}:${r.size}`;
      const hit = thumbs.get(key); if (hit) { thumbs.delete(key); thumbs.set(key, hit); return hit; }
      const res = await client.get(rel, { start: 0, end: Math.max(0, Math.min(r.size || THUMB_BYTES, THUMB_BYTES) - 1) });
      if (!res) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (looksBinary(buf)) return null;
      const entry = { svg: renderTextThumbnail(buf.toString('utf8'), { filename: basename(rel) }), etag: `"t-${r.size.toString(16)}-${(r.etag || String(r.modified)).replace(/\W/g, '').slice(0, 16)}"` };
      remember(thumbs, key, entry, 500);
      return entry;
    },
    async preview(p, { width, ifNoneMatch }): Promise<PreviewResult | null> { // Nextcloud's preview endpoint (MS-65)
      if (!ncOrigin) return null;
      let rel: string; try { rel = resolve(p); } catch { return null; }
      if (rel === '/' || !picturable(rel)) return null;
      const r = await stat(rel);
      if (!r || r.collection) return null;
      const etag = `"p-${(r.etag || String(r.modified)).replace(/\W/g, '').slice(0, 16)}-${width}"`;
      if (ifNoneMatch && ifNoneMatch === etag) return { etag, notModified: true };
      const file = `${ncSub}/${rel}`;
      const u = `${ncOrigin}/index.php/core/preview?${new URLSearchParams({ file, x: String(width), y: String(width), a: '1', mode: 'fill' })}`;
      const res = await f(u, { headers: { ...(client.auth ? { authorization: client.auth } : {}), 'accept-encoding': 'identity' } });
      if (res.status === 404) { await res.body?.cancel(); return null; }
      if (!res.ok) { await res.body?.cancel(); throw new DavError(`Nextcloud preview ${rel}: ${res.status}`, res.status === 401 || res.status === 403 ? 403 : 502); }
      const len = res.headers.get('content-length');
      return { etag, stream: res.body ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream) : Readable.from([]), contentType: res.headers.get('content-type') ?? 'image/jpeg', ...(len ? { size: Number(len) } : {}) };
    }
  };
  return source;
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
