// An in-memory S3-compatible server for tests: path-style, ListObjectsV2, Head/Get/Put/Copy/Delete, DeleteObjects.
// Every request's SigV4 signature is recomputed from what was *received* (method, path, query, signed headers), so a
// mismatch between what the client signs and what it sends fails here.
import http from 'node:http';
import { createHash } from 'node:crypto';
import { signV4 } from '../src/s3/client.js';

export interface FakeObject { body: Buffer; contentType: string; lastModified: Date; etag: string }
export interface FakeS3 { origin: string; objects: Map<string, FakeObject>; requests: string[]; pageSize: number; close(): Promise<void> }

const CREDS = { accessKeyId: 'AKIAFAKEFAKEFAKEFAKE', secretAccessKey: 'fake/secret/key' };
export const FAKE_CREDENTIALS = CREDS;

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const etagOf = (b: Buffer) => `"${createHash('md5').update(b).digest('hex')}"`;

export async function startFakeS3(bucket: string, seed: Record<string, string | Buffer> = {}): Promise<FakeS3> {
  const objects = new Map<string, FakeObject>();
  const requests: string[] = [];
  const state: FakeS3 = { origin: '', objects, requests, pageSize: 1000, close: async () => {} };
  const putObject = (key: string, body: Buffer, contentType: string) => objects.set(key, { body, contentType, lastModified: new Date('2026-11-02T12:00:00Z'), etag: etagOf(body) });
  for (const [k, v] of Object.entries(seed)) putObject(k, Buffer.isBuffer(v) ? v : Buffer.from(v), 'application/octet-stream');

  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
    const body = Buffer.concat(chunks);
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    requests.push(`${req.method} ${url.pathname}${url.search}`);
    const error = (status: number, code: string) => { res.writeHead(status, { 'content-type': 'application/xml' }); res.end(`<?xml version="1.0"?><Error><Code>${code}</Code><Message>${code}</Message></Error>`); };

    // signature check against the received request
    const auth = String(req.headers.authorization ?? '');
    const signed = /SignedHeaders=([^,]+)/.exec(auth)?.[1]?.split(';') ?? [];
    const headers: Record<string, string> = {};
    for (const h of signed) if (h !== 'host' && h !== 'x-amz-date' && h !== 'x-amz-content-sha256' && h !== 'x-amz-security-token') headers[h] = String(req.headers[h] ?? '');
    const amzDate = String(req.headers['x-amz-date'] ?? '');
    const date = new Date(`${amzDate.slice(0, 4)}-${amzDate.slice(4, 6)}-${amzDate.slice(6, 8)}T${amzDate.slice(9, 11)}:${amzDate.slice(11, 13)}:${amzDate.slice(13, 15)}Z`);
    const payloadHash = String(req.headers['x-amz-content-sha256'] ?? '');
    const expected = signV4({ method: req.method!, url, headers, payloadHash, region: 'us-east-1', credentials: CREDS, date });
    if (!auth.startsWith('AWS4-HMAC-SHA256') || expected !== auth.replace(/, /g, ', ')) return error(403, 'SignatureDoesNotMatch');
    if (payloadHash !== createHash('sha256').update(body).digest('hex')) return error(400, 'XAmzContentSHA256Mismatch');

    const segs = url.pathname.split('/').slice(1);
    if (segs[0] !== bucket) return error(404, 'NoSuchBucket');
    const key = decodeURIComponent(segs.slice(1).join('/'));

    if (req.method === 'GET' && key === '' && url.searchParams.get('list-type') === '2') {
      const prefix = url.searchParams.get('prefix') ?? '', delimiter = url.searchParams.get('delimiter') ?? '';
      const token = url.searchParams.get('continuation-token');
      const keys = [...objects.keys()].filter((k) => k.startsWith(prefix)).sort();
      const contents: string[] = []; const prefixes = new Set<string>();
      for (const k of keys) {
        const rest = k.slice(prefix.length);
        const i = delimiter ? rest.indexOf(delimiter) : -1;
        if (i >= 0) prefixes.add(prefix + rest.slice(0, i + delimiter.length)); else contents.push(k);
      }
      const all = [...contents.map((k) => ({ k, kind: 'c' as const })), ...[...prefixes].map((k) => ({ k, kind: 'p' as const }))].sort((a, b) => a.k.localeCompare(b.k));
      const start = token ? all.findIndex((x) => x.k === token) : 0;
      const page = all.slice(start, start + state.pageSize);
      const next = all[start + state.pageSize];
      const xml = `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>${bucket}</Name><Prefix>${xmlEscape(prefix)}</Prefix><KeyCount>${page.length}</KeyCount><MaxKeys>${state.pageSize}</MaxKeys><IsTruncated>${next ? 'true' : 'false'}</IsTruncated>${next ? `<NextContinuationToken>${xmlEscape(next.k)}</NextContinuationToken>` : ''}${page.map((x) => x.kind === 'c' ? `<Contents><Key>${xmlEscape(x.k)}</Key><LastModified>${objects.get(x.k)!.lastModified.toISOString()}</LastModified><ETag>${xmlEscape(objects.get(x.k)!.etag)}</ETag><Size>${objects.get(x.k)!.body.length}</Size><StorageClass>STANDARD</StorageClass></Contents>` : `<CommonPrefixes><Prefix>${xmlEscape(x.k)}</Prefix></CommonPrefixes>`).join('')}</ListBucketResult>`;
      res.writeHead(200, { 'content-type': 'application/xml' }); return res.end(xml);
    }
    if (req.method === 'POST' && key === '' && url.searchParams.has('delete')) {
      if (!req.headers['content-md5']) return error(400, 'InvalidRequest');
      for (const m of body.toString().matchAll(/<Key>([\s\S]*?)<\/Key>/g)) objects.delete(m[1]!.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
      res.writeHead(200, { 'content-type': 'application/xml' }); return res.end('<?xml version="1.0"?><DeleteResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"></DeleteResult>');
    }
    if (req.method === 'PUT') {
      const src = req.headers['x-amz-copy-source'];
      if (src) {
        const srcKey = decodeURIComponent(String(src).replace(/^\//, '').split('/').slice(1).join('/'));
        const o = objects.get(srcKey); if (!o) return error(404, 'NoSuchKey');
        objects.set(key, { ...o, lastModified: new Date() });
        res.writeHead(200, { 'content-type': 'application/xml' }); return res.end(`<CopyObjectResult><ETag>${xmlEscape(o.etag)}</ETag></CopyObjectResult>`);
      }
      putObject(key, body, String(req.headers['content-type'] ?? 'application/octet-stream'));
      res.writeHead(200, { etag: etagOf(body) }); return res.end();
    }
    if (req.method === 'DELETE') { objects.delete(key); res.writeHead(204); return res.end(); }
    if (req.method === 'HEAD' || req.method === 'GET') {
      const o = objects.get(key); if (!o) return error(404, 'NoSuchKey');
      const base = { 'content-type': o.contentType, etag: o.etag, 'last-modified': o.lastModified.toUTCString(), 'accept-ranges': 'bytes' };
      const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ''));
      if (m && req.method === 'GET') {
        const start = m[1] ? Number(m[1]) : Math.max(0, o.body.length - Number(m[2])); const end = Math.min(o.body.length - 1, m[2] && m[1] ? Number(m[2]) : o.body.length - 1);
        if (start > end || start >= o.body.length) { res.writeHead(416, { 'content-range': `bytes */${o.body.length}` }); return res.end(); }
        res.writeHead(206, { ...base, 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${o.body.length}` }); return res.end(o.body.subarray(start, end + 1));
      }
      res.writeHead(200, { ...base, 'content-length': o.body.length }); return res.end(req.method === 'HEAD' ? undefined : o.body);
    }
    error(405, 'MethodNotAllowed');
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  state.origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  state.close = () => new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r())));
  return state;
}
