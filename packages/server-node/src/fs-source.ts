// A media source backed by a directory on disk (api/openapi.yaml semantics).
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { readImageDimensions, readPageCount, isTiff } from './image-dimensions.js';
import { ZipFile } from 'yazl';
import type { Readable } from 'node:stream';
import { encodePathForURL, normalizePath, isWithin, joinPath, parentPath, basename, mediaKind, isTextLike, looksBinary, renderTextThumbnail } from '@mrktps/eureka-core';
import type { Entry, Source, SourceCapabilities, TreeNode } from '@mrktps/eureka-core';
import { READ_ONLY } from '@mrktps/eureka-core';
import { sanitizeFilename } from './multipart.js';
import { readExifGps, type GpsLocation } from './exif-gps.js';

export interface MediaSource extends Source {
  /** What clients may change (11 MS-09); the handler refuses anything false with 403 and lists it with the source. Drivers may set it later (the S3 source does after a 403). */
  capabilities?: SourceCapabilities;
  /** The subfolders of `cd` (default the root), `depth` levels deep; a node at the cut-off omits `children` (11 MS-43). */
  listTree(cd?: string, depth?: number): Promise<TreeNode[]>;
  listDirectory(dir: string): Promise<Entry[]>;
  upload(dir: string, files: Array<{ filename: string; data: Buffer; contentType?: string }>): Promise<Entry[]>;
  createDirectory(dir: string): Promise<void>;
  rename(p: string, name: string): Promise<Entry[]>;
  remove(p: string): Promise<void>;
  removeMany(dir: string, filenames: string[]): Promise<Entry[]>;
  zip(dir: string, filenames: string[]): Promise<Readable>;
  /** Serve a file for `absoluteURL` requests (optionally a byte range), or null when outside the source. */
  open(p: string, range?: { start: number; end?: number }): Promise<{ stream: Readable; size: number; contentType: string; start?: number; end?: number } | null>;
  /** The text thumbnail of a text-like file (02 HTML-66c), or null for other files. Cached by size and mtime. */
  thumbnail?(p: string): Promise<{ svg: string; etag: string } | null>;
  /**
   * A rendered preview of any file the backend can picture (11 MS-04a): a raster at about `width` pixels in `format`
   * (JPEG by default), served at `/sources/{name}/__preview/{path}?w=&f=`. Returns `{ notModified }` when `ifNoneMatch` equals the current etag, null when
   * the backend has no preview for the file.
   */
  preview?(p: string, opts: { width: number; format?: 'jpeg' | 'webp' | 'png'; ifNoneMatch?: string }): Promise<PreviewResult | null>;
}
export type PreviewResult = { etag: string; notModified: true } | { etag: string; notModified?: false; stream: Readable; contentType: string; size?: number };

export interface FilesystemSourceOptions {
  id: Source['id'];
  name: string;
  /** Directory on disk. */
  root: string;
  /** URL prefix under which the files are served (default `/sources/{name}`). */
  urlPrefix?: string;
  /** Hide dotfiles (default true). */
  hideDotfiles?: boolean;
  /** Build a preview URL for an image entry (for example a thumbnail service). Default: the file itself. */
  previewUrl?: (entry: Entry, saveData: boolean) => string;
  /** Offer no mutations (11 MS-09). */
  readOnly?: boolean;
  capabilities?: SourceCapabilities;
  /** Read EXIF GPS from image heads and expose `location` on entries (01 CON-05). Off by default: never read, never sent. */
  location?: boolean;
}

export const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.bmp': 'image/bmp', '.tiff': 'image/tiff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.zip': 'application/zip' };

const SNIFF_BYTES = 4 * 1024 * 1024;
/**
 * Does the image move on its own? SVG: SMIL elements or CSS animation declarations; GIF: more than one graphic
 * control extension; APNG: an acTL chunk; WebP: an ANIM chunk (API `animated`, 02 HTML-66b). `buf` is the head of
 * the file; the filesystem source reads up to 4 MB, remote sources what they can afford.
 */
export function sniffAnimated(buf: Buffer, name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  if (ext === '.svg') return /<(animate|animateTransform|animateMotion|set)[\s>]|@keyframes|animation(?:-name)?\s*:/i.test(buf.toString('utf8'));
  if (ext === '.gif') { let frames = 0; for (let i = 0; i < buf.length - 2 && frames < 2; i++) if (buf[i] === 0x21 && buf[i + 1] === 0xf9 && buf[i + 2] === 0x04) frames++; return frames > 1; }
  if (ext === '.png') return buf.includes('acTL', 8, 'latin1');
  if (ext === '.webp') return buf.includes('ANIM', 12, 'latin1');
  return false;
}
export const ANIMATABLE = ['.svg', '.gif', '.png', '.webp'];

/** `sniffAnimated` over the first 4 MB of a file on disk. */
export async function isAnimated(abs: string, name: string): Promise<boolean> {
  if (!ANIMATABLE.includes(path.extname(name).toLowerCase())) return false;
  let buf: Buffer;
  try {
    const fh = await fs.open(abs, 'r');
    try { const st = await fh.stat(); buf = Buffer.alloc(Math.min(st.size, SNIFF_BYTES)); await fh.read(buf, 0, buf.length, 0); } finally { await fh.close(); }
  } catch { return false; }
  return sniffAnimated(buf, name);
}

/** Default levels of the folder tree a source returns (11 MS-43; MODX shipped 3). */
export const DEFAULT_TREE_DEPTH = 3;
export const clampDepth = (d: number | undefined): number => (Number.isFinite(d) && (d as number) >= 1 ? Math.min(Math.floor(d as number), 64) : DEFAULT_TREE_DEPTH);

/** The capabilities a source declares from its options: read-only or explicit ones, plus `location` when opted in (01 CON-04/05). */
export function capabilitiesFor(opts: { readOnly?: boolean; capabilities?: SourceCapabilities; location?: boolean }): { capabilities?: SourceCapabilities } {
  const base: SourceCapabilities | undefined = opts.readOnly ? { ...READ_ONLY } : opts.capabilities ? { ...opts.capabilities } : undefined;
  if (!opts.location) return base ? { capabilities: base } : {};
  return { capabilities: { ...(base ?? {}), location: true } };
}

export class PathError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = 'PathError'; } }

/** EXIF GPS from the first 64 KB of a file, only for sources that opted in. */
async function gpsOf(abs: string): Promise<GpsLocation | null> {
  try { const fh = await fs.open(abs, 'r'); try { const st = await fh.stat(); const buf = Buffer.alloc(Math.min(st.size, 64 * 1024)); await fh.read(buf, 0, buf.length, 0); return readExifGps(buf); } finally { await fh.close(); } } catch { return null; }
}

export function createFilesystemSource(opts: FilesystemSourceOptions): MediaSource {
  const root = path.resolve(opts.root);
  const urlPrefix = (opts.urlPrefix ?? `/sources/${encodeURIComponent(opts.name)}`).replace(/\/+$/, '');
  const hideDot = opts.hideDotfiles ?? true;

  /** Resolve a source-relative path to disk, refusing anything that escapes the root (01 CON-02). */
  function resolve(p: string): { rel: string; abs: string } {
    const rel = normalizePath(decodeURIComponentSafe(p));
    if (rel.split('/').some((seg) => seg === '..')) throw new PathError('path escapes the source', 400);
    const abs = rel === '/' ? root : path.resolve(root, rel);
    if (abs !== root && !abs.startsWith(root + path.sep)) throw new PathError('path escapes the source', 400);
    return { rel, abs };
  }
  const urlFor = (rel: string) => `${urlPrefix}/${encodePathForURL(rel)}`;
  const thumbs = new Map<string, { svg: string; etag: string }>(); // text thumbnails, LRU by insertion order

  /** Dimensions and page count from the file's head, with ranged reads where the header points elsewhere (11 MS-74, MS-76). */
  async function probeImage(abs: string, size: number): Promise<{ dimensions?: [number, number]; pages?: number }> {
    const out: { dimensions?: [number, number]; pages?: number } = {};
    let fh: fs.FileHandle | undefined;
    try {
      fh = await fs.open(abs, 'r');
      const handle = fh;
      const range = async (s: number, e: number) => { const b = Buffer.alloc(e - s + 1); const { bytesRead } = await handle.read(b, 0, b.length, s); return b.subarray(0, bytesRead); };
      const head = await range(0, Math.min(size, 64 * 1024) - 1);
      const d = await readImageDimensions(head, range, size); if (d) out.dimensions = d;
      if (isTiff(head)) { const pages = await readPageCount(head, range, size); if (pages > 1) out.pages = pages; }
    } catch { /* not a readable image */ } finally { await fh?.close().catch(() => undefined); }
    return out;
  }

  async function entryFor(dirRel: string, name: string, saveData = false): Promise<Entry | null> {
    const rel = joinPath(dirRel, name);
    const abs = path.join(root, rel);
    let st; try { st = await fs.stat(abs); } catch { return null; }
    const base: Entry = {
      directory: st.isDirectory() ? rel : dirRel,
      path: rel, absoluteURL: urlFor(rel), editedOn: Math.round(st.mtimeMs), fileSize: st.size,
      ...(st.birthtimeMs > 0 ? { createdOn: Math.round(st.birthtimeMs) } : {})
    };
    if (st.isDirectory()) return { ...base, foldername: name };
    const e: Entry = { ...base, filename: name };
    if (mediaKind(name) === 'image') {
      const probed = await probeImage(abs, st.size); if (probed.dimensions) e.dimensions = probed.dimensions; if (probed.pages) e.pages = probed.pages;
      if (await isAnimated(abs, name)) e.animated = true;
      if (opts.location && /\.(jpe?g|tiff?)$/i.test(name)) { const loc = await gpsOf(abs); if (loc) e.location = loc; }
    }
    // text-like files preview as a rendered thumbnail (HTML-66c); everything else previews as itself unless the host says otherwise
    e.absolutePreviewURL = opts.previewUrl ? opts.previewUrl(e, saveData) : isTextLike(name) ? `${urlPrefix}/__thumb/${encodePathForURL(rel)}` : e.absoluteURL;
    return e;
  }

  async function listDirectory(dir: string, saveData = false): Promise<Entry[]> {
    const { rel, abs } = resolve(dir);
    let names: string[];
    try { names = await fs.readdir(abs); } catch (err) { throw new PathError(`no such directory: ${rel}`, (err as NodeJS.ErrnoException).code === 'ENOENT' ? 404 : 500); }
    const entries = await Promise.all(names.filter((n) => !(hideDot && n.startsWith('.'))).sort().map((n) => entryFor(rel, n, saveData)));
    return entries.filter((e): e is Entry => e !== null);
  }

  /** Subfolders of `rel`, `depth` levels deep; at the cut-off `children` is left out (11 MS-43). */
  async function tree(rel: string, depth: number): Promise<TreeNode[]> {
    const abs = rel === '/' ? root : path.join(root, rel);
    let dirents; try { dirents = await fs.readdir(abs, { withFileTypes: true }); } catch { return []; }
    const nodes: TreeNode[] = [];
    for (const d of dirents.filter((d) => d.isDirectory() && !(hideDot && d.name.startsWith('.'))).sort((a, b) => a.name.localeCompare(b.name))) {
      const cd = joinPath(rel, d.name);
      nodes.push(depth > 1 ? { name: d.name, cd, children: await tree(cd, depth - 1) } : { name: d.name, cd });
    }
    return nodes;
  }

  return {
    id: opts.id, name: opts.name,
    ...capabilitiesFor(opts),
    async listTree(cd = '/', depth = DEFAULT_TREE_DEPTH) {
      const { rel, abs } = resolve(cd);
      if (rel !== '/') { let st; try { st = await fs.stat(abs); } catch { throw new PathError(`no such directory: ${rel}`, 404); } if (!st.isDirectory()) throw new PathError(`no such directory: ${rel}`, 404); }
      return tree(rel, clampDepth(depth));
    },
    listDirectory: (dir) => listDirectory(dir),
    async upload(dir, files) {
      const { rel, abs } = resolve(dir);
      await fs.mkdir(abs, { recursive: true });
      for (const f of files) await fs.writeFile(path.join(abs, sanitizeFilename(f.filename)), f.data);
      return listDirectory(rel);
    },
    async createDirectory(dir) { const { abs } = resolve(dir); await fs.mkdir(abs, { recursive: true }); },
    async rename(p, name) {
      const { rel, abs } = resolve(p);
      const clean = sanitizeFilename(name);
      const target = path.join(path.dirname(abs), clean);
      if (!isWithin('/', joinPath(parentPath(rel), clean))) throw new PathError('bad name', 400);
      try { await fs.access(target); throw new PathError(`${clean} already exists`, 409); } catch (err) { if (err instanceof PathError) throw err; }
      await fs.rename(abs, target);
      return listDirectory(parentPath(rel));
    },
    async remove(p) { const { rel, abs } = resolve(p); if (rel === '/') throw new PathError('refusing to delete the source root', 400); await fs.rm(abs, { recursive: true, force: false }); },
    async removeMany(dir, filenames) {
      const { rel } = resolve(dir);
      for (const n of filenames) { const { abs } = resolve(joinPath(rel, sanitizeFilename(n))); await fs.rm(abs, { recursive: true, force: true }); }
      return listDirectory(rel);
    },
    async zip(dir, filenames) {
      const { rel } = resolve(dir);
      const zip = new ZipFile();
      for (const n of filenames) { const { abs } = resolve(joinPath(rel, sanitizeFilename(n))); try { if ((await fs.stat(abs)).isFile()) zip.addFile(abs, basename(n)); } catch { /* skip missing */ } }
      zip.end();
      return zip.outputStream as unknown as Readable;
    },
    async open(p, range) {
      let r; try { r = resolve(p); } catch { return null; }
      let st; try { st = await fs.stat(r.abs); } catch { return null; }
      if (!st.isFile()) return null;
      const contentType = MIME[path.extname(r.abs).toLowerCase()] ?? 'application/octet-stream';
      if (range) { // a byte range (the worker reads the head of text files for thumbnails, HTML-66c)
        const start = Math.max(0, range.start); const end = Math.min(st.size - 1, range.end ?? st.size - 1);
        if (start > end) return { stream: createReadStream(r.abs, { start: 0, end: -1 }), size: st.size, contentType, start, end };
        return { stream: createReadStream(r.abs, { start, end }), size: st.size, contentType, start, end };
      }
      return { stream: createReadStream(r.abs), size: st.size, contentType };
    },
    async thumbnail(p) { // 02 HTML-66c: the first 8 KB of a text-like file as an SVG, cached by size and mtime
      let r; try { r = resolve(p); } catch { return null; }
      if (!isTextLike(r.rel)) return null;
      let st; try { st = await fs.stat(r.abs); } catch { return null; }
      if (!st.isFile()) return null;
      const key = `${r.rel}:${st.size}:${Math.round(st.mtimeMs)}`;
      const hit = thumbs.get(key);
      if (hit) { thumbs.delete(key); thumbs.set(key, hit); return hit; }
      const fh = await fs.open(r.abs, 'r');
      let buf: Buffer;
      try { buf = Buffer.alloc(Math.min(st.size, 8192)); await fh.read(buf, 0, buf.length, 0); } finally { await fh.close(); }
      if (looksBinary(buf)) return null;
      const entry = { svg: renderTextThumbnail(buf.toString('utf8'), { filename: basename(r.rel) }), etag: `"t-${st.size.toString(16)}-${Math.round(st.mtimeMs).toString(16)}"` };
      thumbs.set(key, entry);
      if (thumbs.size > 500) thumbs.delete(thumbs.keys().next().value as string);
      return entry;
    }
  };
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
