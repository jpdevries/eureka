// The engine: fetch, normalise, cache, sort and filter off the main thread
// (10 PERF-01..03). The same code runs inline when no Worker is available.
import { looksBinary } from '../thumbs/kinds.js';
import { buildDisplayRecord, type Translate } from '../format.js';
import { normalizePath } from '../paths.js';
import { filterEntries, sortEntries } from '../sort-filter.js';
import { isFile, type DisplayRecord, type Entry, type Sort, type SourceId } from '../types.js';
import { createRestApi, type EurekaApi } from '../api/client.js';
import type { EngineRequest, EngineResponse, ListingResult } from './protocol.js';

export interface EngineOptions {
  /** Factory so the worker can build a client from the request's basePath/headers; defaults to createRestApi. */
  apiFor?: (req: { basePath?: string; headers: Record<string, string> }) => EurekaApi;
  translateFor?: (locale: string) => Translate | undefined;
  /** Optional listing cache (IndexedDB in the worker, PERF-05). */
  cache?: ListingCache;
  /** Text thumbnail renderer (02 HTML-66c). The worker entry supplies renderTextThumbnail; the inline twin leaves it out so the element bundle stays small, and text files keep their icon there. */
  renderText?: (text: string, filename: string) => string;
}
export interface ListingCache {
  get(key: string): Promise<Entry[] | undefined>;
  set(key: string, entries: Entry[]): Promise<void>;
}

export interface Engine {
  handle(req: EngineRequest): Promise<EngineResponse>;
  /** For the inline twin: typed convenience over handle(). */
  request<T extends EngineRequest>(req: T): Promise<unknown>;
}

const cacheKey = (source: SourceId, path: string) => `${source}::${normalizePath(path)}`;

export function createEngine(options: EngineOptions = {}): Engine {
  const apis = new Map<string, EurekaApi>();
  const apiFor = (req: { basePath?: string; headers: Record<string, string> }): EurekaApi => {
    const key = JSON.stringify([req.basePath ?? '/', req.headers]);
    let api = apis.get(key);
    if (!api) { api = options.apiFor ? options.apiFor(req) : createRestApi({ basePath: req.basePath, headers: req.headers }); apis.set(key, api); }
    return api;
  };

  // current directory state
  let current: { source: SourceId; path: string; entries: Entry[]; records: Record<string, DisplayRecord>; locale: string; sort: Sort; filter: string } | null = null;

  function recordsFor(entries: Entry[], locale: string, timeZone?: string): Record<string, DisplayRecord> {
    const t = options.translateFor?.(locale);
    const out: Record<string, DisplayRecord> = {};
    for (const e of entries) out[e.path] = buildDisplayRecord(e, { locale, timeZone, t });
    return out;
  }
  function order(sort: Sort, filter: string, locale: string): string[] {
    if (!current) return [];
    const files = current.entries.filter(isFile);
    return sortEntries(filterEntries(files, filter, current.records), sort, locale).map((e) => e.path);
  }
  function setListing(source: SourceId, path: string, entries: Entry[], req: { locale: string; timeZone?: string }, sort: Sort = current?.sort ?? { by: 'filename', dir: 'ascending' }, filter = ''): ListingResult {
    current = { source, path: normalizePath(path), entries, records: recordsFor(entries, req.locale, req.timeZone), locale: req.locale, sort, filter };
    return { source, path: current.path, entries, records: current.records, order: order(sort, filter, req.locale) };
  }

  async function dispatch(req: EngineRequest): Promise<{ result: unknown; fromCache?: boolean }> {
    const api = apiFor(req);
    switch (req.type) {
      case 'listSources': return { result: await api.listSources() };
      case 'listTree': return { result: await api.listTree(req.source) };
      case 'listDirectory': {
        const key = cacheKey(req.source, req.path);
        const cached = req.preferCache ? await options.cache?.get(key) : undefined;
        if (cached) return { result: setListing(req.source, req.path, cached, req), fromCache: true };
        const entries = await api.listDirectory(req.source, req.path);
        await options.cache?.set(key, entries);
        return { result: setListing(req.source, req.path, entries, req) };
      }
      case 'sort': { if (current) current.sort = { by: req.by, dir: req.dir }; return { result: { order: order({ by: req.by, dir: req.dir }, current?.filter ?? '', req.locale) } }; }
      case 'filter': { if (current) { current.filter = req.text; if (req.sort) current.sort = req.sort; } return { result: { order: order(current?.sort ?? req.sort ?? { by: 'filename', dir: 'ascending' }, req.text, req.locale) } }; }
      case 'upload': { const entries = await api.upload(req.source, req.path, req.files); await options.cache?.set(cacheKey(req.source, req.path), entries); return { result: setListing(req.source, req.path, entries, req, current?.sort, current?.filter) }; }
      case 'rename': {
        const entries = await api.rename(req.source, req.path, req.name);
        const dir = current?.path ?? (normalizePath(req.path).split('/').slice(0, -1).join('/') || '/');
        await options.cache?.set(cacheKey(req.source, dir), entries);
        return { result: setListing(req.source, dir, entries, req, current?.sort, current?.filter) };
      }
      case 'delete': {
        let entries: Entry[];
        if (req.paths.length === 1 && req.cd === undefined) { const r = await api.remove(req.source, req.paths[0]!); entries = Array.isArray(r) ? r : (current?.entries.filter((e) => e.path !== req.paths[0]) ?? []); }
        else { const cd = req.cd ?? current?.path ?? '/'; entries = await api.removeMany(req.source, cd, req.paths.map((p) => p.slice(p.lastIndexOf('/') + 1))); }
        const dir = current?.path ?? req.cd ?? '/';
        await options.cache?.set(cacheKey(req.source, dir), entries);
        return { result: setListing(req.source, dir, entries, req, current?.sort, current?.filter) };
      }
      case 'createDirectory': { await api.createDirectory(req.source, req.path); return { result: { path: normalizePath(req.path) } }; }
      case 'decodeThumbnail': {
        const res = await fetch(req.url, { headers: req.headers });
        const blob = await res.blob();
        if (typeof createImageBitmap !== 'function') throw new Error('createImageBitmap unavailable');
        return { result: await createImageBitmap(blob, { resizeWidth: req.width, resizeQuality: 'medium' }) };
      }
      case 'textThumbnail': { // 02 HTML-66c, for sources that serve no preview: the first bytes, rendered here, off the main thread
        const max = req.maxBytes ?? 8192;
        const res = await fetch(req.url, { headers: { ...req.headers, Range: `bytes=0-${max - 1}` } });
        if (!res.ok && res.status !== 206) throw new Error(`fetch ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());
        if (looksBinary(bytes)) throw new Error('binary');
        const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(0, max));
        if (!options.renderText) throw new Error('text thumbnails need the worker');
        return { result: { svg: options.renderText(text, req.filename) } };
      }
      case 'crop': {
        if (typeof OffscreenCanvas === 'undefined') throw new Error('OffscreenCanvas unavailable');
        const res = await fetch(req.url, { headers: req.headers });
        const bitmap = await createImageBitmap(await res.blob());
        const { x, y, width, height, rotate = 0, scaleX = 1, scaleY = 1 } = req.crop;
        const canvas = new OffscreenCanvas(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(bitmap, x, y, width, height, -width / 2, -height / 2, width, height);
        return { result: await canvas.convertToBlob({ type: req.mimeType ?? 'image/png', quality: req.quality }) };
      }
    }
  }

  return {
    async handle(req) {
      try { const { result, fromCache } = await dispatch(req); return { id: req.id, ok: true, result, ...(fromCache ? { fromCache } : {}) }; }
      catch (err) { const e = err as { message?: string; status?: number }; return { id: req.id, ok: false, error: { message: e?.message ?? String(err), ...(typeof e?.status === 'number' ? { status: e.status } : {}) } }; }
    },
    async request(req) { const r = await this.handle(req); if (!r.ok) { const err = new Error(r.error.message) as Error & { status?: number }; err.status = r.error.status; throw err; } return r.result; }
  };
}
