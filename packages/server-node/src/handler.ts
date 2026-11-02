// HTTP handler implementing api/openapi.yaml over one or more media sources,
// plus the Level 0 form protocol (03) through a pluggable page renderer and
// static file serving. Framework-free: plug it into node:http or any adapter
// that exposes IncomingMessage/ServerResponse.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizePath, splitSourcePath, type Entry, type Source, type TreeNode } from '@mrktps/eureka-core';
import { PathError, type MediaSource } from './fs-source.js';
import { first, parseMultipart, readBody } from './multipart.js';

export interface PageContext {
  /** Request-derived state for the renderer (hydration-ready, 03 NOJS-41). */
  sources: Source[];
  source: MediaSource;
  path: string;
  entries: Entry[];
  tree: TreeNode[];
  lang: string;
  basePath: string;
  /** Set after a no-JS upload, for a notice. */
  uploaded?: string[];
  /** True when the location came from the request (POST navigate, ?path=), not the default (07 STATE-40). */
  locationRequested?: boolean;
}
export interface ChooseContext { source: MediaSource; path: string; filename: string; entry: Entry | undefined; lang: string }

export interface HandlerOptions {
  sources: MediaSource[];
  /** URL prefix of the API and of the Level 0 form action (default "/"). */
  basePath?: string;
  /** Path under basePath for the API (v2: "media"). */
  mediaPath?: string;
  /** Render the page for GET {basePath} and after a no-JS navigate/upload. Without it those routes are not served. */
  renderPage?: (ctx: PageContext) => Promise<string> | string;
  /** Handle a no-JS choose (03 NOJS-31). Default: a plain confirmation page. */
  onChoose?: (ctx: ChooseContext, req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
  /** Directory served for everything else (the page's assets). */
  staticDir?: string;
  /** Individual files served at fixed URL paths, e.g. { '/assets/css/eureka.css': '/abs/path/eureka.css' }. */
  assetFiles?: Record<string, string>;
  maxUploadBytes?: number;
  /** Extra headers on API responses (CORS for a separate front end, for example). */
  responseHeaders?: Record<string, string>;
  log?: (line: string) => void;
}

export type NodeHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;

const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.map': 'application/json', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };

export function createEurekaHandler(opts: HandlerOptions): NodeHandler {
  const basePath = '/' + (opts.basePath ?? '/').replace(/^\/+|\/+$/g, '');
  const apiRoot = (basePath === '/' ? '' : basePath) + '/' + (opts.mediaPath ?? 'media').replace(/^\/+|\/+$/g, '');
  const maxUpload = opts.maxUploadBytes ?? 256 * 1024 * 1024;
  const log = opts.log ?? (() => {});
  const bySourceId = (id: string) => opts.sources.find((s) => String(s.id) === id);
  const sourceList = (): Source[] => opts.sources.map((s) => ({ id: s.id, name: s.name }));

  const json = (res: ServerResponse, body: unknown, status = 200) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...opts.responseHeaders }); res.end(JSON.stringify(body)); };
  const html = (res: ServerResponse, body: string, status = 200) => { res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(body); };
  const fail = (res: ServerResponse, err: unknown) => {
    const e = err as { status?: number; message?: string };
    const status = typeof e?.status === 'number' ? e.status : 500;
    if (status >= 500) log(`error: ${e?.message ?? String(err)}`);
    json(res, { error: status >= 500 ? 'internal error' : (e?.message ?? 'error') }, status);
  };

  async function api(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
    const rest = url.pathname.slice(apiRoot.length + 1).replace(/\/$/, '');
    const [kind, idRaw] = rest.split('/');
    const method = req.method ?? 'GET';
    if (kind === 'sources' && !idRaw) { if (method !== 'GET') return json(res, { error: 'method not allowed' }, 405); return json(res, sourceList()); }
    const source = bySourceId(decodeURIComponent(idRaw ?? ''));
    if (!source) return json(res, { error: 'no such source' }, 404);
    const pathParam = url.searchParams.get('path') ?? url.searchParams.get('dir');
    try {
      if (kind === 'sources') {
        if (method === 'GET') return json(res, pathParam === null ? await source.listTree() : await source.listDirectory(pathParam));
        if (method === 'PUT') {
          if (pathParam === null) return json(res, { error: 'Missing required parameter `path`' }, 400);
          const name = url.searchParams.get('name');
          if (name) return json(res, await source.rename(pathParam, name));
          await source.createDirectory(pathParam);
          return json(res, await source.listDirectory(normalizePath(pathParam).split('/').slice(0, -1).join('/') || '/'));
        }
        if (method === 'POST') {
          if (pathParam === null) return json(res, { error: 'Missing required parameter `path`' }, 400);
          const { files } = parseMultipart(await readBody(req, maxUpload), req.headers['content-type']);
          return json(res, await source.upload(pathParam, files.filter((f) => f.field === 'eureka__uploadFiles' || files.length === 1)));
        }
        if (method === 'DELETE') {
          if (pathParam !== null) { await source.remove(pathParam); return json(res, await source.listDirectory(normalizePath(pathParam).split('/').slice(0, -1).join('/') || '/')); }
          const { fields } = parseMultipart(await readBody(req, 1024 * 1024), req.headers['content-type']);
          const cd = first(fields.cd); if (cd === undefined) return json(res, { error: 'Missing `cd` or `path`' }, 400);
          return json(res, await source.removeMany(cd, fields['delete_file[]'] ?? []));
        }
        return json(res, { error: 'method not allowed' }, 405);
      }
      if (kind === 'attachments' && method === 'POST') {
        const { fields } = parseMultipart(await readBody(req, 1024 * 1024), req.headers['content-type']);
        const cd = first(fields.cd) ?? '/';
        const stream = await source.zip(cd, fields['zip_file[]'] ?? []);
        res.writeHead(200, { 'content-type': 'application/zip', 'content-disposition': `attachment; filename="eureka-${encodeURIComponent(String(source.id))}.zip"`, ...opts.responseHeaders });
        stream.pipe(res);
        return;
      }
      return json(res, { error: 'not found' }, 404);
    } catch (err) { return fail(res, err); }
  }

  async function page(req: IncomingMessage, res: ServerResponse, url: URL, state: { sourceId?: string; path: string; uploaded?: string[]; requested?: boolean }): Promise<void> {
    const source = (state.sourceId !== undefined ? bySourceId(state.sourceId) : undefined) ?? opts.sources[0];
    if (!source || !opts.renderPage) return json(res, { error: 'not found' }, 404);
    const lang = url.searchParams.get('ln') ?? (req.headers['accept-language'] ?? 'en').split(',')[0]!.trim() ?? 'en';
    try {
      const [entries, tree] = await Promise.all([source.listDirectory(state.path), source.listTree()]);
      const body = await opts.renderPage({ sources: sourceList(), source, path: normalizePath(state.path), entries, tree, lang, basePath, locationRequested: state.requested ?? false, ...(state.uploaded ? { uploaded: state.uploaded } : {}) });
      return html(res, body);
    } catch (err) { if (err instanceof PathError && err.status === 404) return page(req, res, url, { sourceId: state.sourceId, path: '/', requested: false }); return fail(res, err); }
  }

  /** The Level 0 POST (03 NOJS-30..33). */
  async function formPost(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
    const { fields, files } = parseMultipart(await readBody(req, maxUpload), req.headers['content-type']);
    const sourceId = first(fields.eureka__mediaSourceId);
    const uploadDir = normalizePath(first(fields['eureka__upload-dir']) ?? '/');
    const source = (sourceId !== undefined ? bySourceId(sourceId) : undefined) ?? opts.sources[0];
    if (!source) return json(res, { error: 'no sources' }, 500);
    let uploaded: string[] | undefined;
    const uploads = files.filter((f) => f.field === 'eureka__uploadFiles');
    if (uploads.length) { await source.upload(uploadDir, uploads); uploaded = uploads.map((f) => f.filename); }
    const chosen = first(fields.eureka__chosen_item);
    if (chosen) {
      const entries = await source.listDirectory(uploadDir);
      const entry = entries.find((e) => e.filename === chosen);
      const ctx: ChooseContext = { source, path: uploadDir, filename: chosen, entry, lang: url.searchParams.get('ln') ?? 'en' };
      if (opts.onChoose) return opts.onChoose(ctx, req, res);
      return html(res, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Eureka!</title></head><body><h1>Eureka!</h1><p>You chose <code>${escapeHtml(entry?.path ?? chosen)}</code> of the ${escapeHtml(source.name)} media source.</p>${entry ? `<p><a href="${escapeHtml(entry.absoluteURL)}">${escapeHtml(entry.absoluteURL)}</a></p>` : ''}</body></html>`);
    }
    const browsing = Object.entries(fields).find(([k]) => /^eureka__media-browser_.*__browsing$/.test(k))?.[1]?.[0];
    const target = browsing ? splitSourcePath(browsing) : { sourceId: String(source.id), path: uploadDir };
    return page(req, res, url, { sourceId: target.sourceId, path: target.path, requested: true, ...(uploaded ? { uploaded } : {}) });
  }

  async function serveStatic(res: ServerResponse, url: URL): Promise<boolean> {
    if (!opts.staticDir) return false;
    const root = path.resolve(opts.staticDir);
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const abs = path.resolve(root, rel);
    if (abs !== root && !abs.startsWith(root + path.sep)) return false;
    let st; try { st = await fs.stat(abs); } catch { return false; }
    if (!st.isFile()) return false;
    res.writeHead(200, { 'content-type': MIME[path.extname(abs).toLowerCase()] ?? 'application/octet-stream', 'content-length': st.size });
    createReadStream(abs).pipe(res);
    return true;
  }

  return async function handle(req, res) {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    try {
      if (url.pathname === apiRoot || url.pathname.startsWith(apiRoot + '/')) { await api(req, res, url); return true; }
      // files of each source, at their urlPrefix
      for (const s of opts.sources) {
        const prefix = `/sources/${encodeURIComponent(s.name)}/`;
        if (url.pathname.startsWith(prefix)) {
          const file = await s.open(url.pathname.slice(prefix.length));
          if (!file) { json(res, { error: 'not found' }, 404); return true; }
          res.writeHead(200, { 'content-type': file.contentType, 'content-length': file.size, 'cache-control': 'private, max-age=60' });
          file.stream.pipe(res); return true;
        }
      }
      const asset = opts.assetFiles?.[url.pathname];
      if (asset) {
        let st; try { st = await fs.stat(asset); } catch { st = null; }
        if (st?.isFile()) { res.writeHead(200, { 'content-type': MIME[path.extname(asset).toLowerCase()] ?? 'application/octet-stream', 'content-length': st.size, 'cache-control': 'public, max-age=300' }); createReadStream(asset).pipe(res); return true; }
      }
      if (url.pathname === basePath || url.pathname === basePath + '/') {
        if (req.method === 'POST') { await formPost(req, res, url); return true; }
        if (opts.renderPage) { await page(req, res, url, { sourceId: url.searchParams.get('source') ?? undefined, path: url.searchParams.get('path') ?? '/', requested: url.searchParams.has('path') || url.searchParams.has('source') }); return true; }
      }
      return await serveStatic(res, url);
    } catch (err) { fail(res, err); return true; }
  };
}

export function escapeHtml(s: string): string { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!); }
