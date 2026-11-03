// An in-memory WebDAV server for tests: PROPFIND Depth 0/1 (multistatus with a rotating namespace prefix, so the parser's
// tolerance is exercised), GET with Range, PUT, MKCOL (405 exists / 409 no parent), MOVE (Overwrite: F → 412),
// DELETE (collections whole), basic auth, a read-only switch, and a Nextcloud-shaped preview endpoint.
import http from 'node:http';

export interface FakeDavNode { collection: boolean; data: Buffer; contentType: string; modified: Date; etag: string }
export interface FakeDav {
  origin: string; url: string; nodes: Map<string, FakeDavNode>; requests: string[]; previewRequests: string[];
  readOnly: boolean;
  put(path: string, data: Buffer | string, contentType?: string): void; mkcol(path: string): void;
  close(): Promise<void>;
}

const CREDS = { username: 'jp', password: 'app-password-1234' };
export const FAKE_DAV_CREDENTIALS = CREDS;
const PREFIXES = ['D', 'd', 'ns0', ''];

/** `base` is the collection path on the server, e.g. `/remote.php/dav/files/jp/Photos`. */
export async function startFakeDav(base = '/remote.php/dav/files/jp/Photos'): Promise<FakeDav> {
  const nodes = new Map<string, FakeDavNode>(); // keys: server paths without trailing slash
  const requests: string[] = []; const previewRequests: string[] = [];
  let etags = 0, call = 0;
  const state = { readOnly: false };
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  const parent = (p: string) => { const i = p.lastIndexOf('/'); return i <= 0 ? '/' : p.slice(0, i); };
  const put = (path: string, data: Buffer | string, contentType = 'application/octet-stream') => { nodes.set(norm(path), { collection: false, data: Buffer.isBuffer(data) ? data : Buffer.from(data), contentType, modified: new Date('2026-11-02T12:00:00Z'), etag: `"e${++etags}"` }); };
  const mkcol = (path: string) => { nodes.set(norm(path), { collection: true, data: Buffer.alloc(0), contentType: 'httpd/unix-directory', modified: new Date('2026-11-02T12:00:00Z'), etag: `"c${++etags}"` }); };
  for (const seg of base.split('/').filter(Boolean).reduce<string[]>((acc, s) => [...acc, `${acc[acc.length - 1] ?? ''}/${s}`], [])) mkcol(seg);

  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
    const body = Buffer.concat(chunks);
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    const p = norm(decodeURIComponent(url.pathname));
    requests.push(`${req.method} ${url.pathname}${url.search}${req.headers.depth !== undefined ? ` depth=${req.headers.depth}` : ''}`);
    const auth = String(req.headers.authorization ?? '');
    if (auth !== `Basic ${Buffer.from(`${CREDS.username}:${CREDS.password}`).toString('base64')}`) { res.writeHead(401, { 'www-authenticate': 'Basic realm="dav"' }); return res.end(); }

    if (url.pathname === '/index.php/core/preview' && req.method === 'GET') { // Nextcloud's preview endpoint
      const file = url.searchParams.get('file') ?? ''; previewRequests.push(url.search);
      const target = nodes.get(norm(`/remote.php/dav/files/jp${file}`));
      if (!target || target.collection) { res.writeHead(404); return res.end(); }
      const img = Buffer.from(`jpeg preview ${file.split('/').pop()} ${url.searchParams.get('x')}`);
      res.writeHead(200, { 'content-type': 'image/jpeg', 'content-length': img.length }); return res.end(img);
    }

    const node = nodes.get(p);
    const write = !['GET', 'HEAD', 'PROPFIND', 'OPTIONS'].includes(req.method ?? '');
    if (write && state.readOnly) { res.writeHead(403); return res.end('<d:error><s:message>forbidden</s:message></d:error>'); }

    if (req.method === 'PROPFIND') {
      if (!node) { res.writeHead(404); return res.end(); }
      const depth = String(req.headers.depth ?? 'infinity');
      const list = [p, ...(depth === '0' || !node.collection ? [] : [...nodes.keys()].filter((k) => parent(k) === p && k !== p))];
      const ns = PREFIXES[call++ % PREFIXES.length]!; const t = (tag: string) => (ns ? `${ns}:${tag}` : tag);
      const xml = `<?xml version="1.0"?><${t('multistatus')} xmlns${ns ? ':' + ns : ''}="DAV:">${list.map((k) => { const n = nodes.get(k)!; const href = encodeURI(k) + (n.collection ? '/' : ''); return `<${t('response')}><${t('href')}>${href}</${t('href')}><${t('propstat')}><${t('prop')}><${t('resourcetype')}>${n.collection ? `<${t('collection')}/>` : ''}</${t('resourcetype')}>${n.collection ? '' : `<${t('getcontentlength')}>${n.data.length}</${t('getcontentlength')}><${t('getcontenttype')}>${n.contentType}</${t('getcontenttype')}>`}<${t('getlastmodified')}>${n.modified.toUTCString()}</${t('getlastmodified')}><${t('getetag')}>${n.etag.replace(/"/g, '&quot;')}</${t('getetag')}><${t('displayname')}>${k.split('/').pop()}</${t('displayname')}></${t('prop')}><${t('status')}>HTTP/1.1 200 OK</${t('status')}></${t('propstat')}><${t('propstat')}><${t('prop')}><${t('quota-used-bytes')}/></${t('prop')}><${t('status')}>HTTP/1.1 404 Not Found</${t('status')}></${t('propstat')}></${t('response')}>`; }).join('')}</${t('multistatus')}>`;
      res.writeHead(207, { 'content-type': 'application/xml; charset=utf-8' }); return res.end(xml);
    }
    if (req.method === 'GET') {
      if (!node) { res.writeHead(404); return res.end(); }
      if (node.collection) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<html>index of collection</html>'); }
      const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ''));
      const basek = { 'content-type': node.contentType, etag: node.etag, 'accept-ranges': 'bytes' };
      if (m) {
        const start = m[1] ? Number(m[1]) : Math.max(0, node.data.length - Number(m[2])); const end = Math.min(node.data.length - 1, m[2] && m[1] ? Number(m[2]) : node.data.length - 1);
        if (start > end || start >= node.data.length) { res.writeHead(416, { 'content-range': `bytes */${node.data.length}` }); return res.end(); }
        res.writeHead(206, { ...basek, 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${node.data.length}` }); return res.end(node.data.subarray(start, end + 1));
      }
      res.writeHead(200, { ...basek, 'content-length': node.data.length }); return res.end(node.data);
    }
    if (req.method === 'PUT') {
      if (!nodes.get(parent(p))?.collection) { res.writeHead(409); return res.end(); }
      const existed = !!node; put(p, body, String(req.headers['content-type'] ?? 'application/octet-stream'));
      res.writeHead(existed ? 204 : 201); return res.end();
    }
    if (req.method === 'MKCOL') {
      if (node) { res.writeHead(405); return res.end(); }
      if (!nodes.get(parent(p))?.collection) { res.writeHead(409); return res.end(); }
      mkcol(p); res.writeHead(201); return res.end();
    }
    if (req.method === 'MOVE') {
      if (!node) { res.writeHead(404); return res.end(); }
      const dest = norm(decodeURIComponent(new URL(String(req.headers.destination), url).pathname));
      if (nodes.has(dest) && String(req.headers.overwrite ?? 'T').toUpperCase() === 'F') { res.writeHead(412); return res.end(); }
      for (const [k, v] of [...nodes.entries()]) if (k === p || k.startsWith(p + '/')) { nodes.delete(k); nodes.set(dest + k.slice(p.length), v); }
      res.writeHead(201); return res.end();
    }
    if (req.method === 'DELETE') {
      if (!node) { res.writeHead(404); return res.end(); }
      for (const k of [...nodes.keys()]) if (k === p || k.startsWith(p + '/')) nodes.delete(k);
      res.writeHead(204); return res.end();
    }
    res.writeHead(405); res.end();
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  return { origin, url: `${origin}${base}/`, nodes, requests, previewRequests, put, mkcol, get readOnly() { return state.readOnly; }, set readOnly(v) { state.readOnly = v; }, close: () => new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r()))) };
}
