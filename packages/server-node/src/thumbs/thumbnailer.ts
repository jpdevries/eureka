// Previews the server renders itself (11 MS-70..MS-75): an adapter decodes originals a source cannot picture, lazily,
// one file at a time, into a disk cache behind the existing `__preview` route. Nothing happens for a file nobody looks at.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { encodePathForURL, mediaKind, parentPath, type Entry } from '@mrktps/eureka-core';
import type { MediaSource, PreviewResult } from '../fs-source.js';

export type PreviewFormat = 'jpeg' | 'webp' | 'png';
export interface RenderJob { width: number; format: PreviewFormat }

/** What a thumbnail adapter provides: which files it can picture and the renditions of one original (MS-71). */
export interface Thumbnailer {
  /** Can this adapter decode the file? Judged by filename (extension). */
  accepts(filename: string): boolean;
  /** Every rendition asked for, from one decode of the original on disk at `file`. `width` bounds the long edge; never enlarge. */
  render(file: string, jobs: RenderJob[]): Promise<Array<RenderJob & { data: Buffer }>>;
}

export interface ThumbnailOptions {
  thumbnailer: Thumbnailer;
  /** Where renditions live between runs (default `{tmpdir}/eureka-thumbnails`). */
  cacheDir?: string;
  /** Long-edge widths offered in `renditions` (default 220, 440, 880; 02 HTML-66a). */
  widths?: number[];
  /** Formats offered, modern first; the last is the `<img>` fallback (default webp then jpeg). */
  formats?: PreviewFormat[];
  /** Originals above this are never rendered (default 512 MB); below `minSourceBytes` (default 0) they preview as themselves. */
  maxSourceBytes?: number;
  minSourceBytes?: number;
  /** Originals decoded at the same time (default 2). */
  concurrency?: number;
  /** Fetching and decoding one original may take this long (default 120 s). */
  timeoutMs?: number;
  /** URL prefix the source's files are served under (default `/sources/{name}`). */
  urlPrefix?: string;
  log?: (line: string) => void;
}

const DEFAULT_WIDTHS = [220, 440, 880];
const DEFAULT_FORMATS: PreviewFormat[] = ['webp', 'jpeg'];
const EXT: Record<PreviewFormat, string> = { jpeg: 'jpg', webp: 'webp', png: 'png' };
const KNOWN_MAX = 20000;

/** A source whose listings advertise, and whose preview route serves, renditions the adapter renders (MS-70). */
export function withThumbnails(source: MediaSource, opts: ThumbnailOptions): MediaSource {
  const { thumbnailer } = opts;
  const widths = [...(opts.widths ?? DEFAULT_WIDTHS)].sort((a, b) => a - b);
  const formats = opts.formats?.length ? opts.formats : DEFAULT_FORMATS;
  const max = opts.maxSourceBytes ?? 512 * 1024 * 1024, min = opts.minSourceBytes ?? 0;
  const cacheDir = opts.cacheDir ?? path.join(os.tmpdir(), 'eureka-thumbnails');
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const urlPrefix = (opts.urlPrefix ?? `/sources/${encodeURIComponent(source.name)}`).replace(/\/$/, '');
  const log = opts.log ?? (() => {});
  const known = new Map<string, { size: number; edited: number }>(); // path → identity of the original, from the listings that passed through
  const inflight = new Map<string, Promise<void>>();
  const failed = new Map<string, number>(); // key → retry-after time
  let running = 0; const waiting: Array<() => void> = [];
  const acquire = () => new Promise<void>((resolve) => { if (running < (opts.concurrency ?? 2)) { running++; resolve(); } else waiting.push(() => { running++; resolve(); }); });
  const release = () => { running--; waiting.shift()?.(); };

  const eligible = (e: Entry): e is Entry & { filename: string } =>
    !!e.filename && !e.animated && thumbnailer.accepts(e.filename) && mediaKind(e.filename) !== 'text'
    && (!e.absolutePreviewURL || e.absolutePreviewURL === e.absoluteURL) && Number(e.fileSize) >= min && Number(e.fileSize) <= max;

  /** Point the entry at the preview route and list the renditions the adapter will produce (MS-71). */
  function advertise(e: Entry): Entry {
    if (e.filename) { known.set(e.path, { size: Number(e.fileSize), edited: Number(e.editedOn) || 0 }); if (known.size > KNOWN_MAX) known.delete(known.keys().next().value!); }
    if (!eligible(e)) return e;
    const url = `${urlPrefix}/__preview/${encodePathForURL(e.path)}`;
    const longest = e.dimensions ? Math.max(e.dimensions[0], e.dimensions[1]) : Infinity;
    const ws = widths.filter((w, i) => i === 0 || w <= longest);
    return { ...e, absolutePreviewURL: url, renditions: formats.flatMap((f) => ws.map((w) => ({ url: `${url}?w=${w}&f=${f}`, width: w, type: `image/${f}` }))) };
  }
  const advertiseAll = (entries: Entry[]) => entries.map(advertise);

  async function identity(p: string): Promise<{ size: number; edited: number } | null> {
    const hit = known.get(p); if (hit) return hit;
    try { advertiseAll(await source.listDirectory(parentPath(p) || '/')); } catch { return null; }
    return known.get(p) ?? null;
  }

  const file = (key: string, w: number, f: PreviewFormat) => path.join(cacheDir, `${key}-${w}.${EXT[f]}`);
  const statOrNull = (p: string) => fsp.stat(p).catch(() => null);

  /** Fetch the original once and render every width in every format from it (MS-72). */
  function renderAll(p: string, key: string): Promise<void> {
    const running = inflight.get(key); if (running) return running;
    const job = (async () => {
      await acquire();
      const tmp = path.join(cacheDir, `tmp-${key}-${process.pid}-${Date.now()}`);
      try {
        await fsp.mkdir(cacheDir, { recursive: true });
        const opened = await source.open(p);
        if (!opened) throw new Error('not found');
        if (opened.size > max) throw new Error(`${opened.size} bytes is over the ${max} byte ceiling`);
        await pipeline(opened.stream, fs.createWriteStream(tmp), { signal: AbortSignal.timeout(timeoutMs) });
        const out = await thumbnailer.render(tmp, formats.flatMap((format) => widths.map((width) => ({ width, format }))));
        for (const r of out) { const dest = file(key, r.width, r.format); await fsp.writeFile(dest + '.part', r.data); await fsp.rename(dest + '.part', dest); }
      } catch (err) {
        failed.set(key, Date.now() + 60_000);
        log(`thumbnail: ${source.name}/${p}: ${(err as Error).message}`);
      } finally {
        await fsp.rm(tmp, { force: true }).catch(() => {});
        release(); inflight.delete(key);
      }
    })();
    inflight.set(key, job);
    return job;
  }

  async function preview(p: string, o: { width: number; format?: PreviewFormat; ifNoneMatch?: string }): Promise<PreviewResult | null> {
    if (source.preview) { const own = await source.preview(p, o); if (own) return own; } // the backend's own picture wins (MS-04a)
    if (!thumbnailer.accepts(p) || mediaKind(p) === 'text') return null;
    const id = await identity(p); if (!id || id.size < min || id.size > max) return null;
    const w = widths.find((x) => x >= o.width) ?? widths[widths.length - 1]!;
    const f: PreviewFormat = o.format && formats.includes(o.format) ? o.format : formats[formats.length - 1]!;
    const key = createHash('sha1').update(`${source.name}|${p}|${id.size}|${id.edited}`).digest('hex').slice(0, 24);
    const etag = `"th-${key}-${w}-${f}"`;
    if (o.ifNoneMatch === etag) return { etag, notModified: true };
    const dest = file(key, w, f);
    let st = await statOrNull(dest);
    if (!st) {
      if ((failed.get(key) ?? 0) > Date.now()) return null;
      await renderAll(p, key);
      st = await statOrNull(dest);
      if (!st) return null;
    }
    return { etag, stream: fs.createReadStream(dest), contentType: `image/${f}`, size: st.size };
  }

  // the original stays the prototype, so `capabilities` a driver sets later still show through
  const decorated: MediaSource = Object.create(source);
  return Object.assign(decorated, {
    id: source.id, name: source.name,
    listDirectory: async (dir: string) => advertiseAll(await source.listDirectory(dir)),
    upload: async (dir: string, files: Parameters<MediaSource['upload']>[1]) => advertiseAll(await source.upload(dir, files)),
    rename: async (p: string, name: string) => advertiseAll(await source.rename(p, name)),
    removeMany: async (dir: string, names: string[]) => advertiseAll(await source.removeMany(dir, names)),
    preview
  });
}
