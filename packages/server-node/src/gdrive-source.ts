// A media source over Google Drive (spec 11 §4, MS-40..MS-44, MS-50..MS-55): Drive addresses files by opaque id and
// allows duplicate names, so the driver keeps a path ↔ id map filled by the listings it performs; rename is a
// metadata patch, delete is the trash, native documents export, bytes always proxy through the server.
import path from 'node:path';
import { Readable } from 'node:stream';
import { ZipFile } from 'yazl';
import { encodePathForURL, normalizePath, joinPath, parentPath, basename, isTextLike, looksBinary, mediaKind, renderTextThumbnail } from '@mrktps/eureka-core';
import { readImageDimensions } from './image-dimensions.js';
import type { Entry, Source, SourceCapabilities, TreeNode } from '@mrktps/eureka-core';
import { READ_ONLY } from '@mrktps/eureka-core';
import { ANIMATABLE, DEFAULT_TREE_DEPTH, MIME, PathError, capabilitiesFor, clampDepth, sniffAnimated, type MediaSource, type PreviewResult } from './fs-source.js';
import { sanitizeFilename } from './multipart.js';
import { DriveClient, DriveError, FOLDER, NATIVE, SHORTCUT, sizedThumbnailLink, type DriveClientOptions, type DriveFile } from './google/drive-client.js';
import type { TokenProvider } from './google/auth.js';

export interface GoogleDriveSourceOptions {
  id: Source['id'];
  name: string;
  getToken: TokenProvider;
  /** The folder the source is confined to (default `root`, the account's My Drive). */
  rootFolderId?: string;
  /** A shared drive id; the root is then the drive itself unless `rootFolderId` names a folder in it. */
  driveId?: string;
  urlPrefix?: string;
  previewUrl?: (entry: Entry, saveData: boolean) => string;
  /** Read the first 64 KB of GIF/SVG/PNG/WebP files once for `animated` (default true); dimensions come free from Drive. */
  probe?: boolean;
  /** Permanently delete instead of trashing (default false, MS-42). */
  permanentDelete?: boolean;
  readOnly?: boolean;
  capabilities?: SourceCapabilities;
  /** Ask Drive for the capture location and expose `location` on entries (01 CON-05). Off by default. */
  location?: boolean;
  /** How long listings are reused, in ms (default 30 000); mutations drop the cache. */
  cacheTtl?: number;
  fetch?: typeof fetch;
  apiBase?: string;
  uploadBase?: string;
}

/** One Drive item as the path model sees it. */
interface Node {
  /** The listed item (a shortcut's own id, for rename and delete). */
  file: DriveFile;
  /** Where the bytes are: the shortcut's target, else the item itself. */
  content: DriveFile;
  /** The name shown and used in paths: unique within the folder, `/` replaced, native documents with their extension. */
  displayName: string;
  isFolder: boolean;
}

const PROBE_BYTES = 64 * 1024;
/** Widths offered as renditions of Drive's thumbnail (the long edge; Drive caps at 1600). */
const PREVIEW_WIDTHS = [220, 440, 880];
const THUMB_BYTES = 8192;
/** Drive allows `/` in names; the path model cannot. U+2215 DIVISION SLASH stands in (MS-50). */
const SLASH = '∕';

export function createGoogleDriveSource(opts: GoogleDriveSourceOptions): MediaSource {
  const clientOpts: DriveClientOptions = { getToken: opts.getToken, ...(opts.location ? { location: true } : {}), ...(opts.driveId ? { driveId: opts.driveId } : {}), ...(opts.fetch ? { fetch: opts.fetch } : {}), ...(opts.apiBase ? { apiBase: opts.apiBase } : {}), ...(opts.uploadBase ? { uploadBase: opts.uploadBase } : {}) };
  const client = new DriveClient(clientOpts);
  const rootId = opts.rootFolderId ?? opts.driveId ?? 'root';
  const urlPrefix = (opts.urlPrefix ?? `/sources/${encodeURIComponent(opts.name)}`).replace(/\/+$/, '');
  const probe = opts.probe ?? true;
  const ttl = opts.cacheTtl ?? 30_000;
  const children = new Map<string, { at: number; nodes: Node[] }>(); // by directory path
  const probes = new Map<string, boolean>();
  const dims = new Map<string, [number, number] | null>(); // header dimensions for files Drive has not measured (MS-74)
  const thumbs = new Map<string, { svg: string; etag: string }>();
  const rootNode: Node = { file: { id: rootId, name: '', mimeType: FOLDER }, content: { id: rootId, name: '', mimeType: FOLDER }, displayName: '', isFolder: true };

  const urlFor = (rel: string) => `${urlPrefix}/${encodePathForURL(rel)}`;
  const remember = <V>(map: Map<string, V>, key: string, value: V, max: number) => { map.set(key, value); if (map.size > max) map.delete(map.keys().next().value as string); };
  const invalidate = () => { children.clear(); };

  function cleanPath(p: string): string {
    const rel = normalizePath(decodeURIComponentSafe(p));
    if (rel.split('/').some((seg) => seg === '..' || seg === '.')) throw new PathError('path escapes the source', 400);
    return rel;
  }
  /** Drive name → display name: `/` replaced, a native document gets its extension (MS-50, MS-52). */
  const displayOf = (f: DriveFile, content: DriveFile): string => {
    const base = f.name.replace(/\//g, SLASH);
    const native = NATIVE[content.mimeType];
    return native && !base.toLowerCase().endsWith(native.ext) ? base + native.ext : base;
  };
  /** Display name → Drive name for a rename: the virtual extension comes off a native document. */
  const driveNameOf = (node: Node, name: string): string => {
    const native = NATIVE[node.content.mimeType];
    return native && name.toLowerCase().endsWith(native.ext) ? name.slice(0, -native.ext.length) : name;
  };
  const suffixed = (name: string, n: number): string => { const i = name.lastIndexOf('.'); return i > 0 ? `${name.slice(0, i)} (${n})${name.slice(i)}` : `${name} (${n})`; };

  /** Resolve shortcuts and make display names unique and deterministic within one folder (MS-40). */
  async function toNodes(files: DriveFile[]): Promise<Node[]> {
    const nodes: Node[] = [];
    for (const f of files) {
      let content: DriveFile = f;
      if (f.mimeType === SHORTCUT && f.shortcutDetails) {
        if (f.shortcutDetails.targetMimeType === FOLDER) content = { id: f.shortcutDetails.targetId, name: f.name, mimeType: FOLDER };
        else { const target = await client.get(f.shortcutDetails.targetId); if (!target) continue; content = target; } // a dangling shortcut is not shown
      }
      nodes.push({ file: f, content, displayName: displayOf(f, content), isFolder: content.mimeType === FOLDER });
    }
    const byName = new Map<string, Node[]>();
    for (const n of nodes) byName.set(n.displayName, [...(byName.get(n.displayName) ?? []), n]);
    for (const group of byName.values()) {
      if (group.length < 2) continue;
      group.sort((a, b) => (a.file.createdTime ?? '').localeCompare(b.file.createdTime ?? '') || a.file.id.localeCompare(b.file.id));
      group.forEach((n, i) => { if (i > 0) n.displayName = suffixed(n.displayName, i + 1); });
    }
    return nodes.sort((a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0));
  }

  async function childrenOf(dirRel: string, { foldersOnly = false } = {}): Promise<Node[]> {
    const key = `${dirRel}${foldersOnly ? ':folders' : ''}`;
    const hit = children.get(key) ?? (foldersOnly ? children.get(dirRel) : undefined);
    if (hit && Date.now() - hit.at < ttl) return foldersOnly ? hit.nodes.filter((n) => n.isFolder) : hit.nodes;
    const dir = await resolve(dirRel);
    if (!dir.isFolder) throw new PathError(`no such directory: ${dirRel}`, 404);
    const nodes = await toNodes(await client.list(dir.content.id, { foldersOnly }));
    remember(children, key, { at: Date.now(), nodes }, 2000);
    return nodes;
  }

  /** Path → node, walking from the root through cached listings (MS-40). */
  async function resolve(rel: string): Promise<Node> {
    if (rel === '/') return rootNode;
    const parent = parentPath(rel), name = basename(rel);
    const node = (await childrenOf(parent)).find((n) => n.displayName === name);
    if (!node) throw new PathError(`no such file or directory: ${rel}`, 404);
    return node;
  }
  async function resolveFile(rel: string): Promise<Node> {
    const node = await resolve(rel);
    if (node.isFolder) throw new PathError(`${rel} is a directory`, 400);
    return node;
  }

  async function animatedOf(node: Node): Promise<boolean> {
    const key = `${node.content.id}:${node.content.md5Checksum ?? node.content.modifiedTime ?? ''}`;
    const hit = probes.get(key); if (hit !== undefined) return hit;
    let out = false;
    try { const res = await client.media(node.content.id, { start: 0, end: PROBE_BYTES - 1 }); if (res) out = sniffAnimated(Buffer.from(await res.arrayBuffer()), node.displayName); } catch { /* a probe never fails a listing */ }
    remember(probes, key, out, 5000);
    return out;
  }

  /** Width and height from the file's head when Drive reports none (it computes no imageMediaMetadata above about 50 MB; MS-74). */
  async function dimensionsOf(node: Node): Promise<[number, number] | null> {
    const key = `dims:${node.content.id}:${node.content.md5Checksum ?? node.content.modifiedTime ?? ''}`;
    const hit = dims.get(key); if (hit !== undefined) return hit;
    let out: [number, number] | null = null;
    try {
      const res = await client.media(node.content.id, { start: 0, end: PROBE_BYTES - 1 });
      if (res) out = await readImageDimensions(Buffer.from(await res.arrayBuffer()), async (s, e) => { const r = await client.media(node.content.id, { start: s, end: e }); return r ? Buffer.from(await r.arrayBuffer()) : Buffer.alloc(0); }, Number(node.content.size ?? Infinity));
    } catch { /* a probe never fails a listing */ }
    remember(dims, key, out, 5000);
    return out;
  }

  async function entryFor(node: Node, dirRel: string, saveData: boolean): Promise<Entry> {
    const rel = joinPath(dirRel, node.displayName);
    const edited = Date.parse(node.file.modifiedTime ?? node.content.modifiedTime ?? '') || 0;
    if (node.isFolder) return { directory: rel, path: rel, foldername: node.displayName, absoluteURL: urlFor(rel), editedOn: edited, fileSize: 0, ...(Date.parse(node.file.createdTime ?? '') ? { createdOn: Date.parse(node.file.createdTime!) } : {}) };
    const created = Date.parse(node.file.createdTime ?? node.content.createdTime ?? '') || 0;
    const e: Entry = { directory: dirRel, path: rel, filename: node.displayName, absoluteURL: urlFor(rel), editedOn: edited, fileSize: Number(node.content.size ?? 0), ...(created ? { createdOn: created } : {}) };
    const d = node.content.imageMediaMetadata;
    if (d?.width && d?.height) e.dimensions = [d.width, d.height];
    else if (probe && mediaKind(node.displayName) === 'image' && Number(node.content.size ?? 0) > 0) { const dd = await dimensionsOf(node); if (dd) e.dimensions = dd; }
    if (opts.location && typeof d?.location?.latitude === 'number' && typeof d.location.longitude === 'number') e.location = { lat: d.location.latitude, lng: d.location.longitude, ...(typeof d.location.altitude === 'number' ? { alt: d.location.altitude } : {}) };
    if (probe && ANIMATABLE.includes(path.extname(node.displayName).toLowerCase()) && (await animatedOf(node))) e.animated = true;
    // text keeps the SVG thumbnail (HTML-66c); anything Drive has pictured (TIFF, video, PDF, its own documents) gets
    // Drive's rendering through the preview route (MS-56); the rest previews as itself
    e.absolutePreviewURL = opts.previewUrl ? opts.previewUrl(e, saveData)
      : isTextLike(node.displayName) && !NATIVE[node.content.mimeType] ? `${urlPrefix}/__thumb/${encodePathForURL(rel)}`
      : node.content.hasThumbnail && node.content.thumbnailLink ? `${urlPrefix}/__preview/${encodePathForURL(rel)}`
      : e.absoluteURL;
    // the same rendering at several widths for srcset (02 HTML-66a): never wider than the picture itself
    if (!opts.previewUrl && node.content.hasThumbnail && node.content.thumbnailLink && !isTextLike(node.displayName)) {
      const max = e.dimensions ? Math.max(e.dimensions[0], e.dimensions[1]) : Infinity;
      const widths = PREVIEW_WIDTHS.filter((w, i) => i === 0 || w <= max);
      // JPEG only: Google's WebP rendering of a thumbnail is lossless and about four times the JPEG (measured on the
      // NASA TIFFs), so a <picture> with a WebP <source> would cost more than it saves; `?f=webp` stays on the route
      e.renditions = widths.map((w) => ({ url: `${urlPrefix}/__preview/${encodePathForURL(rel)}?w=${w}&f=jpeg`, width: w, type: 'image/jpeg' }));
    }
    return e;
  }

  async function listDirectory(dir: string, saveData = false): Promise<Entry[]> {
    const rel = cleanPath(dir);
    const nodes = await childrenOf(rel);
    const entries: Entry[] = [];
    for (let i = 0; i < nodes.length; i += 4) entries.push(...await Promise.all(nodes.slice(i, i + 4).map((n) => entryFor(n, rel, saveData))));
    return entries;
  }

  async function listTree(cd = '/', depth = DEFAULT_TREE_DEPTH): Promise<TreeNode[]> {
    const rel = cleanPath(cd);
    const d = clampDepth(depth);
    const level = async (dirRel: string, remaining: number): Promise<TreeNode[]> => {
      const folders = await childrenOf(dirRel, { foldersOnly: true });
      const out: TreeNode[] = [];
      for (let i = 0; i < folders.length; i += 4) out.push(...await Promise.all(folders.slice(i, i + 4).map(async (n): Promise<TreeNode> => { const c = joinPath(dirRel, n.displayName); return remaining > 1 ? { name: n.displayName, cd: c, children: await level(c, remaining - 1) } : { name: n.displayName, cd: c }; })));
      return out;
    };
    return level(rel, d);
  }

  const contentTypeFor = (name: string) => MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
  const refused = (err: unknown): never => { if (err instanceof DriveError && err.status === 403) source.capabilities = { ...READ_ONLY, ...(source.capabilities?.location ? { location: true } : {}) }; throw err; };
  const guarded = <A extends unknown[], R>(fn: (...a: A) => Promise<R>) => async (...a: A): Promise<R> => { try { return await fn(...a); } catch (err) { return refused(err); } };

  const source: MediaSource = {
    id: opts.id, name: opts.name,
    ...capabilitiesFor(opts),
    listTree,
    listDirectory: (dir) => listDirectory(dir),
    upload: guarded(async (dir, files) => {
      const rel = cleanPath(dir);
      const folder = await resolve(rel);
      if (!folder.isFolder) throw new PathError(`no such directory: ${rel}`, 404);
      for (const f of files) {
        const name = sanitizeFilename(f.filename).replace(/\//g, SLASH);
        const type = f.contentType && f.contentType !== 'application/octet-stream' ? f.contentType : contentTypeFor(name);
        const existing = (await childrenOf(rel)).find((n) => n.displayName === name && !n.isFolder && n.file.mimeType !== SHORTCUT && !NATIVE[n.content.mimeType]);
        if (existing) await client.replaceContent(existing.file.id, f.data, type); else await client.create(folder.content.id, name, f.data, type);
        invalidate();
      }
      return listDirectory(rel);
    }),
    createDirectory: guarded(async (dir) => {
      const rel = cleanPath(dir);
      if (rel === '/') return;
      const parent = await resolve(parentPath(rel));
      if ((await childrenOf(parentPath(rel))).some((n) => n.displayName === basename(rel) && n.isFolder)) return; // idempotent (MS-06)
      await client.createFolder(parent.content.id, basename(rel));
      invalidate();
    }),
    rename: guarded(async (p, name) => {
      const rel = cleanPath(p);
      if (rel === '/') throw new PathError('refusing to rename the source root', 400);
      const clean = sanitizeFilename(name);
      if (clean.includes('/')) throw new PathError('bad name', 400);
      const node = await resolve(rel);
      if (clean !== node.displayName) {
        if ((await childrenOf(parentPath(rel))).some((n) => n.displayName === clean)) throw new PathError(`${clean} already exists`, 409);
        await client.patch(node.file.id, { name: driveNameOf(node, clean) });
        invalidate();
      }
      return listDirectory(parentPath(rel));
    }),
    remove: guarded(async (p) => {
      const rel = cleanPath(p);
      if (rel === '/') throw new PathError('refusing to delete the source root', 400);
      const node = await resolve(rel);
      await client.remove(node.file.id, { permanent: !!opts.permanentDelete });
      invalidate();
    }),
    removeMany: guarded(async (dir, filenames) => {
      const rel = cleanPath(dir);
      for (const n of filenames) {
        let node: Node; try { node = await resolve(joinPath(rel, sanitizeFilename(n))); } catch (err) { if (err instanceof PathError && err.status === 404) continue; throw err; }
        await client.remove(node.file.id, { permanent: !!opts.permanentDelete });
      }
      invalidate();
      return listDirectory(rel);
    }),
    async zip(dir, filenames) {
      const rel = cleanPath(dir);
      const zip = new ZipFile();
      for (const n of filenames) {
        let node: Node; try { node = await resolve(joinPath(rel, sanitizeFilename(n))); } catch { continue; }
        if (node.isFolder) continue;
        const native = NATIVE[node.content.mimeType];
        const res = native ? await client.export(node.content.id, native.exportAs) : await client.media(node.content.id);
        if (res?.body) zip.addReadStream(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), native ? `${basename(n)}.${native.exportAs.split('/')[1]}` : basename(n));
      }
      zip.end();
      return zip.outputStream as unknown as Readable;
    },
    async open(p, range) {
      let node: Node; try { node = await resolveFile(cleanPath(p)); } catch (err) { if (err instanceof PathError) return null; throw err; }
      const native = NATIVE[node.content.mimeType];
      if (native) { // exported on the fly (MS-52); Drive does not range an export, so the whole document is served
        const res = await client.export(node.content.id, native.exportAs);
        if (!res) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        return { stream: Readable.from([buf]), size: buf.length, contentType: native.exportAs };
      }
      const res = await client.media(node.content.id, range);
      if (!res) return null;
      const contentType = contentTypeFor(node.displayName) === 'application/octet-stream' ? node.content.mimeType || res.headers.get('content-type') || 'application/octet-stream' : contentTypeFor(node.displayName);
      const toStream = () => (res.body ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream) : Readable.from([]));
      if (range) {
        const m = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(res.headers.get('content-range') ?? '');
        if (res.status === 416 || !m) { const total = Number(/\/(\d+)$/.exec(res.headers.get('content-range') ?? '')?.[1] ?? node.content.size ?? 0); await res.body?.cancel(); return { stream: Readable.from([]), size: total, contentType, start: range.start, end: range.start - 1 }; }
        return { stream: toStream(), size: Number(m[3]), contentType, start: Number(m[1]), end: Number(m[2]) };
      }
      return { stream: toStream(), size: Number(res.headers.get('content-length') ?? node.content.size ?? 0), contentType };
    },
    async preview(p, { width, format = 'jpeg', ifNoneMatch }): Promise<PreviewResult | null> {
      let node: Node; try { node = await resolveFile(cleanPath(p)); } catch { return null; }
      if (!node.content.hasThumbnail || !node.content.thumbnailLink) return null;
      const etag = `"p-${node.content.thumbnailVersion ?? '0'}-${width}-${format}"`;
      if (ifNoneMatch && ifNoneMatch === etag) return { etag, notModified: true };
      let res = await client.thumbnail(sizedThumbnailLink(node.content.thumbnailLink, width, format));
      if (!res) { // the signed link lasts hours; a fresh one comes with the file's metadata
        const fresh = await client.get(node.content.id);
        if (!fresh?.hasThumbnail || !fresh.thumbnailLink) return null;
        node.content = { ...node.content, ...fresh };
        res = await client.thumbnail(sizedThumbnailLink(fresh.thumbnailLink, width, format));
        if (!res) return null;
      }
      const len = res.headers.get('content-length');
      return { etag, stream: res.body ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream) : Readable.from([]), contentType: res.headers.get('content-type') ?? `image/${format}`, ...(len ? { size: Number(len) } : {}) };
    },
    async thumbnail(p) {
      let node: Node; try { node = await resolveFile(cleanPath(p)); } catch { return null; }
      if (!isTextLike(node.displayName) || NATIVE[node.content.mimeType]) return null;
      const key = `${node.content.id}:${node.content.md5Checksum ?? node.content.modifiedTime ?? ''}:${node.content.size ?? ''}`;
      const hit = thumbs.get(key); if (hit) { thumbs.delete(key); thumbs.set(key, hit); return hit; }
      const res = await client.media(node.content.id, { start: 0, end: THUMB_BYTES - 1 });
      if (!res) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (looksBinary(buf)) return null;
      const entry = { svg: renderTextThumbnail(buf.toString('utf8'), { filename: node.displayName }), etag: `"t-${(node.content.md5Checksum ?? Date.parse(node.content.modifiedTime ?? '').toString(16)).slice(0, 16)}"` };
      remember(thumbs, key, entry, 500);
      return entry;
    }
  };
  return source;
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
