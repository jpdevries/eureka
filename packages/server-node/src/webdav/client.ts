// The slice of WebDAV (RFC 4918) a media source needs, over fetch: PROPFIND with Depth 0/1, GET with Range, PUT,
// MKCOL, MOVE, DELETE. Basic auth or a bearer token. The multistatus parser ignores namespace prefixes, because
// servers answer with `D:`, `d:`, `ns0:` or a default namespace and all of them mean the same thing.

export interface DavResource {
  /** Path relative to the client's base collection, "/" for the base itself. */
  path: string;
  name: string;
  collection: boolean;
  size: number;
  /** ms since the epoch, 0 when the server gave none. */
  modified: number;
  etag: string;
  contentType: string;
  /** ms since the epoch from `creationdate`, 0 when absent. */
  created: number;
}

export interface DavClientOptions {
  /** The collection the source is confined to, e.g. `https://cloud.example.org/remote.php/dav/files/jp/Photos/`. */
  url: string;
  username?: string;
  password?: string;
  /** Bearer token instead of basic auth. */
  token?: string;
  fetch?: typeof fetch;
}

export class DavError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = 'DavError'; }
}

const PROPFIND_BODY = '<?xml version="1.0" encoding="utf-8"?><D:propfind xmlns:D="DAV:"><D:prop><D:resourcetype/><D:getcontentlength/><D:getlastmodified/><D:getetag/><D:getcontenttype/><D:displayname/><D:creationdate/></D:prop></D:propfind>';

/** Percent-encode a path for a URL, keeping the slashes. */
export const encodeDavPath = (p: string) => p.split('/').map((seg) => encodeURIComponent(seg).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())).join('/');
const decodeXml = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
/** Drop namespace prefixes (`<D:href>` → `<href>`) so one regex fits every server. */
const stripNs = (xml: string) => xml.replace(/<(\/?)[A-Za-z_][\w.-]*:/g, '<$1');
const inner = (xml: string, tag: string): string | undefined => new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i').exec(xml)?.[1];
const all = (xml: string, tag: string): string[] => [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'gi'))].map((m) => m[1]!);

/** Parse a 207 multistatus into resources relative to `basePath` (the base collection's path on the server). */
export function parseMultistatus(xml: string, basePath: string): DavResource[] {
  const body = stripNs(xml);
  const base = basePath.replace(/\/+$/, '');
  const out: DavResource[] = [];
  for (const resp of all(body, 'response')) {
    const hrefRaw = inner(resp, 'href'); if (hrefRaw === undefined) continue;
    let href = decodeXml(hrefRaw.trim());
    try { href = new URL(href, 'http://x').pathname; } catch { /* keep as is */ }
    href = decodeURIComponentSafe(href).replace(/\/+$/, '');
    if (href !== base && !href.startsWith(base + '/')) continue; // outside the base: not ours
    const rel = href === base ? '/' : href.slice(base.length + 1);
    // the first 200 propstat holds the properties; others report missing props
    const ok = all(resp, 'propstat').find((ps) => /\b200\b/.test(inner(ps, 'status') ?? '')) ?? all(resp, 'propstat')[0] ?? resp;
    const prop = inner(ok, 'prop') ?? ok;
    const collection = /<collection\s*\/?>/i.test(inner(prop, 'resourcetype') ?? '');
    const modified = Date.parse((inner(prop, 'getlastmodified') ?? '').trim()) || 0;
    const created = Date.parse((inner(prop, 'creationdate') ?? '').trim()) || 0;
    out.push({
      path: rel, name: rel === '/' ? '' : rel.slice(rel.lastIndexOf('/') + 1), collection,
      size: Number((inner(prop, 'getcontentlength') ?? '0').trim()) || 0, modified, created,
      etag: decodeXml((inner(prop, 'getetag') ?? '').trim()), contentType: decodeXml((inner(prop, 'getcontenttype') ?? '').trim())
    });
  }
  return out;
}

export class DavClient {
  readonly base: URL;
  /** The base collection's path on the server, no trailing slash ("" for the server root). */
  readonly basePath: string;
  /** The Authorization header value, shared with the Nextcloud preview fetch. */
  readonly auth: string | undefined;
  private readonly f: typeof fetch;
  constructor(opts: DavClientOptions) {
    this.base = new URL(opts.url.endsWith('/') ? opts.url : opts.url + '/');
    this.basePath = decodeURIComponentSafe(this.base.pathname).replace(/\/+$/, '');
    this.auth = opts.token ? `Bearer ${opts.token}` : opts.username !== undefined ? `Basic ${Buffer.from(`${opts.username}:${opts.password ?? ''}`).toString('base64')}` : undefined;
    this.f = opts.fetch ?? fetch;
  }

  /** The URL of a path under the base ("/" is the base). Collections get a trailing slash, as servers expect. */
  url(rel: string, collection = false): string {
    const u = new URL(this.base.toString());
    if (rel !== '/' && rel !== '') u.pathname = `${this.base.pathname.replace(/\/$/, '')}/${encodeDavPath(rel)}${collection ? '/' : ''}`;
    return u.toString();
  }

  async request(method: string, rel: string, init: { headers?: Record<string, string>; body?: BodyInit; collection?: boolean; ok?: number[] } = {}): Promise<Response> {
    const res = await this.f(this.url(rel, init.collection), { method, headers: { ...(this.auth ? { authorization: this.auth } : {}), 'accept-encoding': 'identity', ...init.headers }, ...(init.body !== undefined ? { body: init.body } : {}), redirect: 'manual' });
    if (res.ok || (init.ok ?? [206, 207, 304, 404, 412, 416]).includes(res.status)) return res;
    const text = await res.text().catch(() => '');
    const status = res.status === 401 || res.status === 403 ? 403 : res.status === 404 ? 404 : res.status === 405 || res.status === 409 || res.status === 412 || res.status === 423 ? 409 : res.status === 507 ? 507 : res.status >= 500 ? 502 : res.status === 400 ? 400 : 502;
    throw new DavError(`WebDAV ${method} ${rel}: ${res.status} ${text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)}`.trim(), status);
  }

  /** The resource at `rel` and, with depth 1, its children. Null when it does not exist. */
  async propfind(rel: string, depth: 0 | 1): Promise<DavResource[] | null> {
    const res = await this.request('PROPFIND', rel, { headers: { depth: String(depth), 'content-type': 'application/xml; charset=utf-8' }, body: PROPFIND_BODY, collection: true, ok: [207, 404] });
    if (res.status === 404) { await res.body?.cancel(); return null; }
    if (res.status !== 207) { await res.body?.cancel(); throw new DavError(`WebDAV PROPFIND ${rel}: expected 207, got ${res.status}`, 502); }
    return parseMultistatus(await res.text(), this.basePath);
  }

  async get(rel: string, range?: { start: number; end?: number }): Promise<Response | null> {
    const res = await this.request('GET', rel, range ? { headers: { range: `bytes=${range.start}-${range.end ?? ''}` } } : {});
    if (res.status === 404) { await res.body?.cancel(); return null; }
    return res;
  }

  async put(rel: string, body: Buffer, contentType: string): Promise<void> {
    const res = await this.request('PUT', rel, { body: new Uint8Array(body), headers: { 'content-type': contentType, 'content-length': String(body.length) } });
    await res.body?.cancel();
  }

  /** MKCOL; 405 (already exists) is reported by throwing a 409 DavError, which callers treat as "fine". */
  async mkcol(rel: string): Promise<void> { const res = await this.request('MKCOL', rel, { collection: true }); await res.body?.cancel(); }

  /** MOVE without overwrite: a 412 means the destination exists. */
  async move(from: string, to: string, collection: boolean): Promise<'ok' | 'exists'> {
    const res = await this.request('MOVE', from, { headers: { destination: this.url(to, collection), overwrite: 'F' }, collection, ok: [412] });
    await res.body?.cancel();
    return res.status === 412 ? 'exists' : 'ok';
  }

  async delete(rel: string, collection: boolean): Promise<void> { const res = await this.request('DELETE', rel, { collection }); await res.body?.cancel(); }
}

function decodeURIComponentSafe(s: string): string { try { return decodeURIComponent(s); } catch { return s; } }
