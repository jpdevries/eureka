// An in-memory Google Drive v3 (files.list with q, get, alt=media with Range, export, multipart upload, media
// replace, folder create, metadata patch, trash/delete) plus an OAuth token endpoint that verifies the service
// account's RS256 JWT against a public key and accepts a refresh-token grant. Every Drive call needs a token it issued.
import http from 'node:http';
import { createVerify } from 'node:crypto';

export interface FakeDriveFile { id: string; name: string; mimeType: string; parents: string[]; data: Buffer; createdTime: string; modifiedTime: string; trashed: boolean; md5Checksum?: string; imageMediaMetadata?: { width: number; height: number }; shortcutDetails?: { targetId: string; targetMimeType: string }; /** Drive would render a thumbnail for it. */ thumbnail?: boolean; thumbnailVersion?: number }
export interface FakeDrive {
  origin: string; tokenUrl: string; apiBase: string; uploadBase: string;
  files: Map<string, FakeDriveFile>; requests: string[]; tokenCalls: number; pageSize: number;
  /** Refuse writes with 403 insufficientPermissions. */ readOnly: boolean;
  /** Thumbnail fetches seen: the `=s{n}` size, the format flag and whether an Authorization header came along. */ thumbnailRequests: Array<{ size: number; format: string; authorized: boolean }>;
  /** Make every current thumbnail link expire (403), as Google does after some hours. */ expireThumbnails(): void;
  add(f: Partial<FakeDriveFile> & { name: string; parents?: string[] }): FakeDriveFile;
  close(): Promise<void>;
}

export const FOLDER_MIME = 'application/vnd.google-apps.folder';
let seq = 0;
const nextId = () => `f${(++seq).toString(36).padStart(4, '0')}`;

export async function startFakeDrive({ publicKeyPem, refresh }: { publicKeyPem: string; refresh?: { clientId: string; clientSecret: string; refreshToken: string } }): Promise<FakeDrive> {
  const files = new Map<string, FakeDriveFile>();
  const tokens = new Set<string>();
  const requests: string[] = [];
  const state = { tokenCalls: 0, pageSize: 1000, readOnly: false };
  const add: FakeDrive['add'] = (f) => {
    const t = f.createdTime ?? new Date(2026, 0, 1 + files.size).toISOString();
    const file: FakeDriveFile = { id: f.id ?? nextId(), mimeType: f.mimeType ?? 'application/octet-stream', parents: f.parents ?? ['root'], data: f.data ?? Buffer.alloc(0), createdTime: t, modifiedTime: f.modifiedTime ?? t, trashed: false, ...(f.imageMediaMetadata ? { imageMediaMetadata: f.imageMediaMetadata } : {}), ...(f.shortcutDetails ? { shortcutDetails: f.shortcutDetails } : {}), ...(f.thumbnail ? { thumbnail: true, thumbnailVersion: f.thumbnailVersion ?? 1 } : {}), name: f.name };
    files.set(file.id, file); return file;
  };
  let thumbEpoch = 1;
  const thumbnailRequests: Array<{ size: number; format: string; authorized: boolean }> = [];
  const meta = (f: FakeDriveFile) => ({ id: f.id, name: f.name, mimeType: f.mimeType, ...(f.thumbnail ? { hasThumbnail: true, thumbnailVersion: String(f.thumbnailVersion ?? 1), thumbnailLink: `${origin}/thumb/${f.id}/e${thumbEpoch}=s220` } : { hasThumbnail: false }), ...(f.mimeType.startsWith('application/vnd.google-apps.') ? {} : { size: String(f.data.length), md5Checksum: f.md5Checksum ?? `md5-${f.id}-${f.data.length}` }), modifiedTime: f.modifiedTime, createdTime: f.createdTime, ...(f.imageMediaMetadata ? { imageMediaMetadata: f.imageMediaMetadata } : {}), ...(f.shortcutDetails ? { shortcutDetails: f.shortcutDetails } : {}) });
  const gerr = (res: http.ServerResponse, status: number, reason: string, message = reason) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: { code: status, message, errors: [{ reason, message }] } })); };

  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
    const body = Buffer.concat(chunks);
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    requests.push(`${req.method} ${url.pathname}${url.search}`);

    if (url.pathname === '/token' && req.method === 'POST') {
      state.tokenCalls++;
      const oerr = (code: string, description = code) => { res.writeHead(400, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: code, error_description: description })); };
      const form = new URLSearchParams(body.toString());
      const grant = form.get('grant_type');
      if (grant === 'urn:ietf:params:oauth:grant-type:jwt-bearer') {
        const [h, c, sig] = (form.get('assertion') ?? '').split('.');
        if (!h || !c || !sig) return oerr('invalid_grant');
        const ok = createVerify('RSA-SHA256').update(`${h}.${c}`).verify(publicKeyPem, Buffer.from(sig, 'base64url'));
        const claims = JSON.parse(Buffer.from(c, 'base64url').toString()) as { aud?: string; exp?: number; iss?: string; scope?: string };
        if (!ok || claims.aud !== `${origin}/token` || !claims.iss || !claims.scope || (claims.exp ?? 0) < Date.now() / 1000) return oerr('invalid_grant', ok ? 'bad claims' : 'bad signature');
      } else if (grant === 'refresh_token') {
        if (!refresh || form.get('client_id') !== refresh.clientId || form.get('client_secret') !== refresh.clientSecret || form.get('refresh_token') !== refresh.refreshToken) return oerr('invalid_grant');
      } else return oerr('unsupported_grant_type');
      const token = `tok-${state.tokenCalls}`; tokens.add(token);
      res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ access_token: token, expires_in: 3600, token_type: 'Bearer' }));
    }

    const th = /^\/thumb\/([^/]+)\/e(\d+)=s(\d+)(?:-r([jwp]))?(?:-l(\d+))?$/.exec(url.pathname);
    if (th && req.method === 'GET') { // the signed thumbnail host: no bearer token expected, links expire by epoch
      const format = { j: 'jpeg', w: 'webp', p: 'png' }[th[4] ?? 'p'] ?? 'png';
      thumbnailRequests.push({ size: Number(th[3]), format, authorized: req.headers.authorization !== undefined });
      const f = files.get(th[1]!);
      if (!f?.thumbnail || Number(th[2]) !== thumbEpoch) { res.writeHead(403); return res.end(); }
      const img = Buffer.from(`${format} thumb ${f.name} ${th[3]}${th[5] ? ` q${th[5]}` : ''}`);
      res.writeHead(200, { 'content-type': `image/${format}`, 'content-length': img.length }); return res.end(img);
    }
    const auth = String(req.headers.authorization ?? '');
    if (!auth.startsWith('Bearer ') || !tokens.has(auth.slice(7))) return gerr(res, 401, 'authError', 'Invalid Credentials');
    const write = req.method !== 'GET';
    if (write && state.readOnly) return gerr(res, 403, 'insufficientPermissions', 'The user does not have sufficient permissions for this file.');
    const json = (o: unknown, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };

    // ---- upload API ----
    if (url.pathname === '/upload/drive/v3/files' && req.method === 'POST') {
      const boundary = /boundary=([^;]+)/.exec(String(req.headers['content-type']))?.[1];
      if (!boundary) return gerr(res, 400, 'badContent');
      const parts = body.toString('latin1').split(`--${boundary}`).slice(1, -1).map((p) => { const i = p.indexOf('\r\n\r\n'); return { head: p.slice(0, i), data: Buffer.from(p.slice(i + 4, p.length - 2), 'latin1') }; });
      const metadata = JSON.parse(parts[0]!.data.toString()) as { name: string; parents?: string[] };
      const type = /content-type:\s*([^\r\n]+)/i.exec(parts[1]!.head)?.[1] ?? 'application/octet-stream';
      return json(meta(add({ name: metadata.name, parents: metadata.parents ?? ['root'], data: parts[1]!.data, mimeType: type })));
    }
    const up = /^\/upload\/drive\/v3\/files\/([^/]+)$/.exec(url.pathname);
    if (up && req.method === 'PATCH') { const f = files.get(decodeURIComponent(up[1]!)); if (!f) return gerr(res, 404, 'notFound'); f.data = body; f.mimeType = String(req.headers['content-type'] ?? f.mimeType); f.modifiedTime = new Date().toISOString(); return json(meta(f)); }

    // ---- files API ----
    if (url.pathname === '/drive/v3/files' && req.method === 'GET') {
      const q = url.searchParams.get('q') ?? '';
      const parent = /'((?:[^'\\]|\\.)*)' in parents/.exec(q)?.[1]?.replace(/\\(.)/g, '$1');
      const mime = /mimeType = '([^']*)'/.exec(q)?.[1];
      const name = /name = '((?:[^'\\]|\\.)*)'/.exec(q)?.[1]?.replace(/\\(.)/g, '$1');
      const all = [...files.values()].filter((f) => !f.trashed && (!parent || f.parents.includes(parent)) && (!mime || f.mimeType === mime) && (name === undefined || f.name === name)).sort((a, b) => a.name.localeCompare(b.name));
      const start = Number(url.searchParams.get('pageToken') ?? 0);
      const page = all.slice(start, start + state.pageSize);
      return json({ files: page.map(meta), ...(start + state.pageSize < all.length ? { nextPageToken: String(start + state.pageSize) } : {}) });
    }
    if (url.pathname === '/drive/v3/files' && req.method === 'POST') {
      const m = JSON.parse(body.toString()) as { name: string; mimeType?: string; parents?: string[] };
      return json(meta(add({ name: m.name, mimeType: m.mimeType ?? 'application/octet-stream', parents: m.parents ?? ['root'] })));
    }
    const exp = /^\/drive\/v3\/files\/([^/]+)\/export$/.exec(url.pathname);
    if (exp && req.method === 'GET') {
      const f = files.get(decodeURIComponent(exp[1]!)); if (!f || f.trashed) return gerr(res, 404, 'notFound');
      const type = url.searchParams.get('mimeType') ?? 'application/pdf'; const out = Buffer.from(`%PDF-fake export of ${f.name} as ${type}`);
      res.writeHead(200, { 'content-type': type, 'content-length': out.length }); return res.end(out);
    }
    const one = /^\/drive\/v3\/files\/([^/]+)$/.exec(url.pathname);
    if (one) {
      const f = files.get(decodeURIComponent(one[1]!));
      if (!f || (f.trashed && req.method === 'GET')) return gerr(res, 404, 'notFound', 'File not found');
      if (req.method === 'GET' && url.searchParams.get('alt') === 'media') {
        const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ''));
        const base = { 'content-type': f.mimeType, 'accept-ranges': 'bytes' };
        if (m) {
          const start = m[1] ? Number(m[1]) : Math.max(0, f.data.length - Number(m[2])); const end = Math.min(f.data.length - 1, m[2] && m[1] ? Number(m[2]) : f.data.length - 1);
          if (start > end || start >= f.data.length) { res.writeHead(416, { 'content-range': `bytes */${f.data.length}` }); return res.end(); }
          res.writeHead(206, { ...base, 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${f.data.length}` }); return res.end(f.data.subarray(start, end + 1));
        }
        res.writeHead(200, { ...base, 'content-length': f.data.length }); return res.end(f.data);
      }
      if (req.method === 'GET') return json(meta(f));
      if (req.method === 'PATCH') { const m = JSON.parse(body.toString()) as Partial<FakeDriveFile>; if (m.name !== undefined) f.name = m.name; if (m.trashed !== undefined) f.trashed = m.trashed; f.modifiedTime = new Date().toISOString(); return json(meta(f)); }
      if (req.method === 'DELETE') { files.delete(f.id); res.writeHead(204); return res.end(); }
    }
    gerr(res, 404, 'notFound', `no route ${req.method} ${url.pathname}`);
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const drive: FakeDrive = {
    origin, tokenUrl: `${origin}/token`, apiBase: `${origin}/drive/v3`, uploadBase: `${origin}/upload/drive/v3`, files, requests, add,
    thumbnailRequests, expireThumbnails() { thumbEpoch++; },
    get tokenCalls() { return state.tokenCalls; }, get pageSize() { return state.pageSize; }, set pageSize(v) { state.pageSize = v; }, get readOnly() { return state.readOnly; }, set readOnly(v) { state.readOnly = v; },
    close: () => new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r())))
  };
  return drive;
}
