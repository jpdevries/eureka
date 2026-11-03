// HTTP handler implementing api/openapi.yaml over one or more media sources,
// plus the Level 0 form protocol (03) through a pluggable page renderer and
// static file serving. Framework-free: plug it into node:http or any adapter
// that exposes IncomingMessage/ServerResponse.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizePath, sourceAllows, splitSourcePath, type Entry, type MutationKind, type Source, type TreeNode } from '@mrktps/eureka-core';
import { PathError, clampDepth, DEFAULT_TREE_DEPTH, type MediaSource } from './fs-source.js';
import { withThumbnails, type ThumbnailOptions } from './thumbs/thumbnailer.js';
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
  /** Levels of the folder tree returned by default and used when rendering the page (default 3; 11 MS-43). */
  treeDepth?: number;
  /** Extra headers on API responses (CORS for a separate front end, for example). */
  responseHeaders?: Record<string, string>;
  log?: (line: string) => void;
  /** Render previews for files no source can picture, through an adapter such as `createSharpThumbnailer()` (11 MS-70). Off unless set. */
  thumbnails?: ThumbnailOptions;
}

export type NodeHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;

const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.map': 'application/json', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };

export function createEurekaHandler(opts: HandlerOptions): NodeHandler {
  const basePath = '/' + (opts.basePath ?? '/').replace(/^\/+|\/+$/g, '');
  const apiRoot = (basePath === '/' ? '' : basePath) + '/' + (opts.mediaPath ?? 'media').replace(/^\/+|\/+$/g, '');
  const treeDepth = clampDepth(opts.treeDepth ?? DEFAULT_TREE_DEPTH);
  const maxUpload = opts.maxUploadBytes ?? 256 * 1024 * 1024;
  const log = opts.log ?? (() => {});
  const sources = opts.thumbnails ? opts.sources.map((s) => withThumbnails(s, { log, ...opts.thumbnails! })) : opts.sources; // 11 MS-70
  const bySourceId = (id: string) => sources.find((s) => String(s.id) === id);
  const sourceList = (): Source[] => sources.map((s) => ({ id: s.id, name: s.name, ...(s.capabilities ? { capabilities: s.capabilities } : {}) }));
  /** The source declared it does not allow this (11 MS-09): refuse before the driver is asked. */
  const allow = (source: MediaSource, kind: MutationKind) => { if (!sourceAllows(source, kind)) throw new PathError(`the ${source.name} source does not allow ${kind}`, 403); };

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
        if (method === 'GET') {
          if (pathParam !== null) return json(res, await source.listDirectory(pathParam));
          const depthRaw = url.searchParams.get('depth');
          return json(res, await source.listTree(url.searchParams.get('tree') ?? '/', depthRaw === null ? treeDepth : clampDepth(Number(depthRaw))));
        }
        if (method === 'PUT') {
          if (pathParam === null) return json(res, { error: 'Missing required parameter `path`' }, 400);
          const name = url.searchParams.get('name');
          if (name) { allow(source, 'rename'); return json(res, await source.rename(pathParam, name)); }
          allow(source, 'createDirectory');
          await source.createDirectory(pathParam);
          return json(res, await source.listDirectory(normalizePath(pathParam).split('/').slice(0, -1).join('/') || '/'));
        }
        if (method === 'POST') {
          if (pathParam === null) return json(res, { error: 'Missing required parameter `path`' }, 400);
          allow(source, 'upload');
          const { files } = parseMultipart(await readBody(req, maxUpload), req.headers['content-type']);
          return json(res, await source.upload(pathParam, files.filter((f) => f.field === 'eureka__uploadFiles' || files.length === 1)));
        }
        if (method === 'DELETE') {
          allow(source, 'delete');
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
    const lang = requestLanguage(url.searchParams.get('ln'), req.headers['accept-language']);
    try {
      const [entries, tree] = await Promise.all([source.listDirectory(state.path), treeAlong(source, normalizePath(state.path), treeDepth)]);
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
    if (uploads.length) { allow(source, 'upload'); await source.upload(uploadDir, uploads); uploaded = uploads.map((f) => f.filename); }
    const chosen = first(fields.eureka__chosen_item);
    if (chosen) {
      const entries = await source.listDirectory(uploadDir);
      const entry = entries.find((e) => e.filename === chosen);
      const ctx: ChooseContext = { source, path: uploadDir, filename: chosen, entry, lang: url.searchParams.get('ln') ?? 'en' };
      if (opts.onChoose) return opts.onChoose(ctx, req, res);
      return html(res, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Eureka!</title></head><body><h1>Eureka!</h1><p>You chose <code>${escapeHtml(entry?.path ?? chosen)}</code> of the ${escapeHtml(source.name)} media source.</p>${entry ? `<p><a href="${escapeHtml(entry.absoluteURL)}">${escapeHtml(entry.absoluteURL)}</a></p>` : ''}</body></html>`);
    }
    const open = first(fields.eureka__open); // a folder item's button (03 NOJS-32a) wins over the directory selector
    const browsing = open ?? Object.entries(fields).find(([k]) => /^eureka__media-browser_.*__browsing$/.test(k))?.[1]?.[0];
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
      for (const s of sources) {
        const prefix = `/sources/${encodeURIComponent(s.name)}/`;
        if (url.pathname.startsWith(prefix + '__thumb/')) { // text thumbnails (02 HTML-66c)
          const thumb = s.thumbnail ? await s.thumbnail(url.pathname.slice((prefix + '__thumb/').length)) : null;
          if (!thumb) { json(res, { error: 'not found' }, 404); return true; }
          if (req.headers['if-none-match'] === thumb.etag) { res.writeHead(304, { etag: thumb.etag }); res.end(); return true; }
          res.writeHead(200, { 'content-type': 'image/svg+xml', 'content-length': Buffer.byteLength(thumb.svg), etag: thumb.etag, 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' });
          res.end(thumb.svg); return true;
        }
        if (url.pathname.startsWith(prefix + '__preview/')) { // rendered previews from the backend (11 MS-04a)
          const width = Math.min(1600, Math.max(64, Number(url.searchParams.get('w')) || 320));
          const ifNoneMatch = typeof req.headers['if-none-match'] === 'string' ? req.headers['if-none-match'] : undefined;
          const f = url.searchParams.get('f'); const format = f === 'webp' || f === 'png' ? f : 'jpeg';
          const pv = s.preview ? await s.preview(url.pathname.slice((prefix + '__preview/').length), { width, format, ...(ifNoneMatch ? { ifNoneMatch } : {}) }) : null;
          if (!pv) { json(res, { error: 'not found' }, 404); return true; }
          if (pv.notModified) { res.writeHead(304, { etag: pv.etag }); res.end(); return true; }
          res.writeHead(200, { 'content-type': pv.contentType, ...(pv.size !== undefined ? { 'content-length': pv.size } : {}), etag: pv.etag, 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' });
          pv.stream.pipe(res); return true;
        }
        if (url.pathname.startsWith(prefix)) {
          const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
          const range = m && (m[1] || m[2]) ? { start: m[1] ? Number(m[1]) : 0, ...(m[2] ? { end: Number(m[2]) } : {}) } : undefined;
          const file = await s.open(url.pathname.slice(prefix.length), range);
          if (!file) { json(res, { error: 'not found' }, 404); return true; }
          if (range && file.start !== undefined && file.end !== undefined) {
            if (file.end < file.start) { res.writeHead(416, { 'content-range': `bytes */${file.size}` }); res.end(); return true; }
            res.writeHead(206, { 'content-type': file.contentType, 'content-length': file.end - file.start + 1, 'content-range': `bytes ${file.start}-${file.end}/${file.size}`, 'accept-ranges': 'bytes', 'cache-control': 'private, max-age=60' });
          } else res.writeHead(200, { 'content-type': file.contentType, 'content-length': file.size, 'accept-ranges': 'bytes', 'cache-control': 'private, max-age=60' });
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

/** `?ln=` or the first well-formed tag of Accept-Language (weights and `*` dropped), else `en`; a bad tag never reaches Intl (09 I18N-10). */
export function requestLanguage(ln: string | null, acceptLanguage: string | undefined): string {
  const candidates = [ln ?? '', ...(acceptLanguage ?? '').split(',').map((part) => part.split(';')[0]!.trim())].filter((t) => t && t !== '*');
  for (const tag of candidates) { try { const [canonical] = Intl.getCanonicalLocales(tag); if (canonical) return canonical; } catch { /* malformed tag */ } }
  return 'en';
}

/**
 * The tree for a page at `cd`: the root `depth` levels deep, then every unloaded node along `cd` expanded
 * `depth` more levels, so the branch to the current directory is always present (11 MS-43).
 */
export async function treeAlong(source: MediaSource, cd: string, depth: number): Promise<TreeNode[]> {
  const root = await source.listTree('/', depth);
  if (cd === '/') return root;
  const segs = cd.split('/');
  let nodes = root;
  for (let i = 0; i < segs.length; i++) {
    const at = segs.slice(0, i + 1).join('/');
    const node = nodes.find((n) => normalizePath(n.cd) === at);
    if (!node) break;
    if (!node.children) { try { node.children = await source.listTree(at, depth); } catch { break; } }
    nodes = node.children;
  }
  return root;
}
