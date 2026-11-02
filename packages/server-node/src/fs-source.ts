// A media source backed by a directory on disk (api/openapi.yaml semantics).
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import { ZipFile } from 'yazl';
import type { Readable } from 'node:stream';
import { encodePathForURL, normalizePath, isWithin, joinPath, parentPath, basename, mediaKind } from '@mrktps/eureka-core';
import type { Entry, Source, TreeNode } from '@mrktps/eureka-core';
import { sanitizeFilename } from './multipart.js';

export interface MediaSource extends Source {
  listTree(): Promise<TreeNode[]>;
  listDirectory(dir: string): Promise<Entry[]>;
  upload(dir: string, files: Array<{ filename: string; data: Buffer }>): Promise<Entry[]>;
  createDirectory(dir: string): Promise<void>;
  rename(p: string, name: string): Promise<Entry[]>;
  remove(p: string): Promise<void>;
  removeMany(dir: string, filenames: string[]): Promise<Entry[]>;
  zip(dir: string, filenames: string[]): Promise<Readable>;
  /** Serve a file for `absoluteURL` requests, or null when outside the source. */
  open(p: string): Promise<{ stream: Readable; size: number; contentType: string } | null>;
}

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
}

const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.bmp': 'image/bmp', '.tiff': 'image/tiff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.zip': 'application/zip' };

const SNIFF_BYTES = 4 * 1024 * 1024;
/**
 * Does the image move on its own? SVG: SMIL elements or CSS animation declarations; GIF: more than one graphic
 * control extension; APNG: an acTL chunk; WebP: an ANIM chunk. Reads at most 4 MB (API `animated`, 02 HTML-66b).
 */
export async function isAnimated(abs: string, name: string): Promise<boolean> {
  const ext = path.extname(name).toLowerCase();
  if (!['.svg', '.gif', '.png', '.webp'].includes(ext)) return false;
  let buf: Buffer;
  try {
    const fh = await fs.open(abs, 'r');
    try { const st = await fh.stat(); buf = Buffer.alloc(Math.min(st.size, SNIFF_BYTES)); await fh.read(buf, 0, buf.length, 0); } finally { await fh.close(); }
  } catch { return false; }
  if (ext === '.svg') return /<(animate|animateTransform|animateMotion|set)[\s>]|@keyframes|animation(?:-name)?\s*:/i.test(buf.toString('utf8'));
  if (ext === '.gif') { let frames = 0; for (let i = 0; i < buf.length - 2 && frames < 2; i++) if (buf[i] === 0x21 && buf[i + 1] === 0xf9 && buf[i + 2] === 0x04) frames++; return frames > 1; }
  if (ext === '.png') return buf.includes('acTL', 8, 'latin1');
  return buf.includes('ANIM', 12, 'latin1'); // webp
}

export class PathError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = 'PathError'; } }

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

  async function entryFor(dirRel: string, name: string, saveData = false): Promise<Entry | null> {
    const rel = joinPath(dirRel, name);
    const abs = path.join(root, rel);
    let st; try { st = await fs.stat(abs); } catch { return null; }
    const base: Entry = {
      directory: st.isDirectory() ? rel : dirRel,
      path: rel, absoluteURL: urlFor(rel), editedOn: Math.round(st.mtimeMs), fileSize: st.size
    };
    if (st.isDirectory()) return { ...base, foldername: name };
    const e: Entry = { ...base, filename: name };
    if (mediaKind(name) === 'image') {
      try { const d = imageSize(abs); if (d.width && d.height) e.dimensions = [d.width, d.height]; } catch { /* not a decodable image */ }
      if (await isAnimated(abs, name)) e.animated = true;
    }
    e.absolutePreviewURL = opts.previewUrl ? opts.previewUrl(e, saveData) : e.absoluteURL;
    return e;
  }

  async function listDirectory(dir: string, saveData = false): Promise<Entry[]> {
    const { rel, abs } = resolve(dir);
    let names: string[];
    try { names = await fs.readdir(abs); } catch (err) { throw new PathError(`no such directory: ${rel}`, (err as NodeJS.ErrnoException).code === 'ENOENT' ? 404 : 500); }
    const entries = await Promise.all(names.filter((n) => !(hideDot && n.startsWith('.'))).sort().map((n) => entryFor(rel, n, saveData)));
    return entries.filter((e): e is Entry => e !== null);
  }

  async function tree(rel: string): Promise<TreeNode[]> {
    const abs = rel === '/' ? root : path.join(root, rel);
    let dirents; try { dirents = await fs.readdir(abs, { withFileTypes: true }); } catch { return []; }
    const nodes: TreeNode[] = [];
    for (const d of dirents.filter((d) => d.isDirectory() && !(hideDot && d.name.startsWith('.'))).sort((a, b) => a.name.localeCompare(b.name))) {
      const cd = joinPath(rel, d.name);
      nodes.push({ name: d.name, cd, children: await tree(cd) });
    }
    return nodes;
  }

  return {
    id: opts.id, name: opts.name,
    listTree: () => tree('/'),
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
    async open(p) {
      let r; try { r = resolve(p); } catch { return null; }
      let st; try { st = await fs.stat(r.abs); } catch { return null; }
      if (!st.isFile()) return null;
      const ext = path.extname(r.abs).toLowerCase();
      return { stream: createReadStream(r.abs), size: st.size, contentType: MIME[ext] ?? 'application/octet-stream' };
    }
  };
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
