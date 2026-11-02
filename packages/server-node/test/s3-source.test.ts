import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { createS3Source, startServer, signV4, S3Client } from '../src/index.js';
import { startFakeS3, FAKE_CREDENTIALS, type FakeS3 } from './fake-s3.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const GIF2 = Buffer.from('47494638396101000100800000000000ffffff21f90400000000002c0000000001000100000202440100' + '21f90400000000002c0000000001000100000202440100' + '3b', 'hex'); // two frames, each with a graphic control extension
const specDir = path.resolve(__dirname, '../../../spec/schema');
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
for (const f of await fs.readdir(specDir)) if (f.endsWith('.json')) ajv.addSchema(JSON.parse(await fs.readFile(path.join(specDir, f), 'utf8')));
const base = 'https://eureka.markup.tips/spec/3/schema/';
const validEntries = ajv.compile({ type: 'array', items: { $ref: base + 'entry.json' } });
const validTree = ajv.compile({ type: 'array', items: { $ref: base + 'tree-node.json' } });

describe('SigV4 (spec 11 MS-30..MS-32)', () => {
  it('reproduces the GET Object example from the S3 developer guide', () => {
    // docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html, "Example: GET Object"
    const headers: Record<string, string> = { Range: 'bytes=0-9' };
    const auth = signV4({ method: 'GET', url: new URL('https://examplebucket.s3.amazonaws.com/test.txt'), headers, payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', region: 'us-east-1', credentials: { accessKeyId: 'AKIAIOSFODNN7EXAMPLE', secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' }, date: new Date('2013-05-24T00:00:00Z') });
    expect(auth).toBe('AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/20130524/us-east-1/s3/aws4_request, SignedHeaders=host;range;x-amz-content-sha256;x-amz-date, Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41');
    expect(headers['x-amz-date']).toBe('20130524T000000Z');
  });
  it('reproduces the GET Bucket (list objects) example, a query string with empty values', () => {
    const auth = signV4({ method: 'GET', url: new URL('https://examplebucket.s3.amazonaws.com/?max-keys=2&prefix=J'), headers: {}, payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', region: 'us-east-1', credentials: { accessKeyId: 'AKIAIOSFODNN7EXAMPLE', secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' }, date: new Date('2013-05-24T00:00:00Z') });
    expect(auth).toContain('Signature=34b48302e7b5fa45bde8084f4b7868a86f0a534bc59db6670ed5711ef69dc6f7');
  });
  it('moves to the region AWS names in x-amz-bucket-region and re-signs there, once', async () => {
    const seen: string[] = [];
    const fakeFetch: typeof fetch = async (input, init) => {
      const url = new URL(String(input)); seen.push(url.host + ' ' + /Credential=[^/]+\/\d+\/([^/]+)/.exec(String((init?.headers as Record<string, string>).authorization))?.[1]);
      if (url.host.includes('us-east-1')) return new Response('', { status: 301, headers: { 'x-amz-bucket-region': 'eu-central-1' } });
      return new Response('', { status: 200, headers: { 'content-length': '3', 'last-modified': 'Sun, 02 Nov 2026 12:00:00 GMT', etag: '"x"' } });
    };
    const c = new S3Client({ bucket: 'b', credentials: FAKE_CREDENTIALS, fetch: fakeFetch });
    expect(await c.head('k')).toMatchObject({ size: 3 });
    expect(seen).toEqual(['b.s3.us-east-1.amazonaws.com us-east-1', 'b.s3.eu-central-1.amazonaws.com eu-central-1']);
    expect(c.region).toBe('eu-central-1');
    seen.length = 0; await c.head('k'); expect(seen).toEqual(['b.s3.eu-central-1.amazonaws.com eu-central-1']); // remembered
  });
  it('builds virtual-hosted URLs for AWS and path-style URLs for a custom endpoint, RFC 3986-encoded', () => {
    const aws = new S3Client({ bucket: 'b', region: 'eu-west-1', credentials: FAKE_CREDENTIALS });
    expect(aws.objectUrl("dir/Wide Banner (final)'s*.png").toString()).toBe("https://b.s3.eu-west-1.amazonaws.com/dir/Wide%20Banner%20%28final%29%27s%2A.png");
    const r2 = new S3Client({ bucket: 'b', endpoint: 'https://acct.r2.cloudflarestorage.com', credentials: FAKE_CREDENTIALS });
    expect(r2.objectUrl('a b.txt', { 'list-type': '2', prefix: 'x y/' }).toString()).toBe('https://acct.r2.cloudflarestorage.com/b/a%20b.txt?list-type=2&prefix=x%20y%2F');
  });
});

describe('S3 media source over a fake bucket (spec 11 MS-20..MS-27)', () => {
  let s3: FakeS3, origin: string, close: () => Promise<void>;
  const api = (p: string) => `${origin}/media${p}`;
  const j = async (r: Response) => ({ status: r.status, body: await r.json() });
  const names = (body: unknown) => (body as Array<{ filename?: string; foldername?: string }>).map((e) => e.filename ?? e.foldername);

  beforeAll(async () => {
    s3 = await startFakeS3('media', {
      'lib/assets/img/pixel.png': PNG,
      'lib/assets/img/Wide Banner (final).png': PNG,
      'lib/assets/img/loop.gif': GIF2,
      'lib/assets/img/notes.txt': 'hello from a bucket\nline two',
      'lib/assets/img/redwoods/': '',            // a folder marker with nothing in it yet
      'lib/assets/.hidden/secret.txt': 'x',
      'lib/readme.txt': 'root file',
      'lib/uploads/': '',
      'other/outside.txt': 'not ours'          // outside the prefix
    });
    const source = createS3Source({ id: 0, name: 's3', bucket: 'media', endpoint: s3.origin, prefix: 'lib', credentials: FAKE_CREDENTIALS, treeTtl: 0 });
    const cdn = createS3Source({ id: 'cdn', name: 'cdn', bucket: 'media', endpoint: s3.origin, prefix: 'lib/assets', publicBaseUrl: 'https://cdn.example.com', credentials: FAKE_CREDENTIALS, probe: false });
    const started = await startServer({ sources: [source, cdn], port: 0, basePath: '/' });
    origin = `http://127.0.0.1:${started.port}`; close = started.close;
  });
  afterAll(async () => { await close(); await s3.close(); });

  it('lists the tree level by level and a directory with a delimiter, hiding dotfiles and markers', async () => {
    const tree = await j(await fetch(api('/sources/0')));
    expect(tree.status).toBe(200); expect(validTree(tree.body)).toBe(true);
    expect(tree.body).toEqual([{ name: 'assets', cd: 'assets', children: [{ name: 'img', cd: 'assets/img', children: [{ name: 'redwoods', cd: 'assets/img/redwoods' }] }] }, { name: 'uploads', cd: 'uploads', children: [] }]);
    expect((await j(await fetch(api('/sources/0?tree=assets&depth=1')))).body).toEqual([{ name: 'img', cd: 'assets/img' }]);
    expect((await j(await fetch(api('/sources/0?tree=assets%2Fimg')))).body).toEqual([{ name: 'redwoods', cd: 'assets/img/redwoods', children: [] }]);
    expect((await j(await fetch(api('/sources/0?tree=nope')))).status).toBe(404);
    const listing = await j(await fetch(api('/sources/0?path=assets%2Fimg')));
    expect(listing.status).toBe(200); expect(validEntries(listing.body), JSON.stringify(validEntries.errors)).toBe(true);
    expect(names(listing.body)).toEqual(['Wide Banner (final).png', 'loop.gif', 'notes.txt', 'pixel.png', 'redwoods']);
    const pixel = (listing.body as Array<Record<string, unknown>>).find((e) => e.filename === 'pixel.png')!;
    expect(pixel).toMatchObject({ dimensions: [1, 1], fileSize: PNG.length, directory: 'assets/img', path: 'assets/img/pixel.png', absoluteURL: '/sources/s3/assets/img/pixel.png', editedOn: Date.parse('2026-11-02T12:00:00Z') });
    expect((listing.body as Array<Record<string, unknown>>).find((e) => e.filename === 'loop.gif')).toMatchObject({ animated: true });
    expect((listing.body as Array<Record<string, unknown>>).find((e) => e.filename === 'notes.txt')).toMatchObject({ absolutePreviewURL: '/sources/s3/__thumb/assets/img/notes.txt' });
    const root = await j(await fetch(api('/sources/0?path=/')));
    expect(names(root.body)).toEqual(['assets', 'readme.txt', 'uploads']);
    expect(names((await j(await fetch(api('/sources/0?path=assets')))).body)).toEqual(['img']);
    expect((await j(await fetch(api('/sources/0?path=nope')))).status).toBe(404);
    expect((await j(await fetch(api('/sources/0?path=..%2Fother')))).status).toBe(400);
  });
  it('probes each image once (cached by ETag) and follows continuation tokens', async () => {
    s3.requests.length = 0;
    await j(await fetch(api('/sources/0?path=assets%2Fimg')));
    expect(s3.requests.filter((r) => r.startsWith('GET /media/lib/assets/img/') && !r.includes('list-type')).length).toBe(0);
    s3.pageSize = 2; s3.requests.length = 0;
    try {
      const tree = await j(await fetch(api('/sources/0')));
      expect(validTree(tree.body)).toBe(true);
      expect((tree.body as Array<{ name: string }>).map((n) => n.name)).toEqual(['assets', 'uploads']);
      expect(s3.requests.filter((r) => r.includes('continuation-token=')).length).toBeGreaterThanOrEqual(1);
      expect(s3.requests.every((r) => r.includes('delimiter=%2F'))).toBe(true); // no full key scan
    } finally { s3.pageSize = 1000; }
  });
  it('proxies objects at absoluteURL with Range, or links to the public base URL', async () => {
    const r = await fetch(`${origin}/sources/s3/assets/img/pixel.png`);
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toBe('image/png'); expect(r.headers.get('accept-ranges')).toBe('bytes');
    expect(Buffer.from(await r.arrayBuffer()).equals(PNG)).toBe(true);
    const part = await fetch(`${origin}/sources/s3/assets/img/notes.txt`, { headers: { range: 'bytes=0-4' } });
    expect(part.status).toBe(206); expect(part.headers.get('content-range')).toBe('bytes 0-4/28'); expect(await part.text()).toBe('hello');
    expect((await fetch(`${origin}/sources/s3/assets/img/notes.txt`, { headers: { range: 'bytes=99-' } })).status).toBe(416);
    expect((await fetch(`${origin}/sources/s3/missing.png`)).status).toBe(404);
    expect((await fetch(`${origin}/sources/s3/..%2Fother%2Foutside.txt`)).status).toBe(404);
    const cdn = await j(await fetch(api('/sources/cdn?path=img')));
    const px = (cdn.body as Array<Record<string, unknown>>).find((e) => e.filename === 'pixel.png')!;
    expect(px.absoluteURL).toBe('https://cdn.example.com/lib/assets/img/pixel.png'); expect(px.absolutePreviewURL).toBe(px.absoluteURL); expect(px.dimensions).toBeUndefined();
  });
  it('renders text thumbnails from the head of the object with an ETag', async () => {
    const t = await fetch(`${origin}/sources/s3/__thumb/assets/img/notes.txt`);
    expect(t.status).toBe(200); expect(t.headers.get('content-type')).toBe('image/svg+xml');
    const svg = await t.text(); expect(svg).toContain('<svg'); expect(svg).toContain('hello'); expect(svg).toContain('<title>Preview of notes.txt</title>');
    expect((await fetch(`${origin}/sources/s3/__thumb/assets/img/notes.txt`, { headers: { 'if-none-match': t.headers.get('etag')! } })).status).toBe(304);
    expect((await fetch(`${origin}/sources/s3/__thumb/assets/img/pixel.png`)).status).toBe(404);
  });
  it('uploads with content types, creates folders as markers, renames by copy + delete, deletes recursively', async () => {
    const fd = new FormData();
    fd.append('eureka__uploadFiles', new File([PNG], 'new one.png', { type: 'image/png' }));
    fd.append('eureka__uploadFiles', new File(['x'], '../evil.txt'));
    const up = await j(await fetch(api('/sources/0?path=uploads'), { method: 'POST', body: fd }));
    expect(up.status).toBe(200); expect(validEntries(up.body)).toBe(true); expect(names(up.body)).toEqual(['evil.txt', 'new one.png']);
    expect(s3.objects.get('lib/uploads/new one.png')?.contentType).toBe('image/png');
    expect(s3.objects.has('lib/evil.txt')).toBe(false);

    const created = await j(await fetch(api('/sources/0?path=uploads%2Fnewdir'), { method: 'PUT' }));
    expect(created.status).toBe(200); expect(names(created.body)).toContain('newdir');
    expect(s3.objects.has('lib/uploads/newdir/')).toBe(true);
    expect((await j(await fetch(api('/sources/0')))).body).toContainEqual({ name: 'uploads', cd: 'uploads', children: [{ name: 'newdir', cd: 'uploads/newdir', children: [] }] });

    const renamedFile = await j(await fetch(api('/sources/0?path=uploads%2Fevil.txt&name=fine.txt'), { method: 'PUT' }));
    expect(renamedFile.status).toBe(200); expect(names(renamedFile.body)).toEqual(['fine.txt', 'new one.png', 'newdir']);
    expect(s3.objects.has('lib/uploads/evil.txt')).toBe(false); expect(s3.objects.get('lib/uploads/fine.txt')?.body.toString()).toBe('x');
    const conflict = await j(await fetch(api('/sources/0?path=uploads%2Ffine.txt&name=new one.png'), { method: 'PUT' }));
    expect(conflict.status).toBe(409);

    await fetch(api('/sources/0?path=uploads%2Fnewdir%2Fdeep'), { method: 'PUT' });
    s3.objects.set('lib/uploads/newdir/deep/a.txt', { body: Buffer.from('a'), contentType: 'text/plain', lastModified: new Date(), etag: '"a"' });
    const renamedDir = await j(await fetch(api('/sources/0?path=uploads%2Fnewdir&name=renamed'), { method: 'PUT' }));
    expect(renamedDir.status).toBe(200); expect(names(renamedDir.body)).toEqual(['fine.txt', 'new one.png', 'renamed']);
    expect([...s3.objects.keys()].filter((k) => k.startsWith('lib/uploads/')).sort()).toEqual(['lib/uploads/', 'lib/uploads/fine.txt', 'lib/uploads/new one.png', 'lib/uploads/renamed/', 'lib/uploads/renamed/deep/', 'lib/uploads/renamed/deep/a.txt']);

    const removed = await j(await fetch(api('/sources/0?path=uploads%2Frenamed'), { method: 'DELETE' }));
    expect(removed.status).toBe(200); expect(names(removed.body)).toEqual(['fine.txt', 'new one.png']);
    expect([...s3.objects.keys()].some((k) => k.startsWith('lib/uploads/renamed'))).toBe(false);
    const bulk = new FormData(); bulk.append('cd', 'uploads'); bulk.append('cs', '0'); bulk.append('delete_file[]', 'fine.txt'); bulk.append('delete_file[]', 'missing.txt');
    const bulked = await j(await fetch(api('/sources/0'), { method: 'DELETE', body: bulk }));
    expect(bulked.status).toBe(200); expect(names(bulked.body)).toEqual(['new one.png']);
    expect((await j(await fetch(api('/sources/0?path=/'), { method: 'DELETE' }))).status).toBe(400);
    expect((await j(await fetch(api('/sources/0?path=uploads%2Fghost'), { method: 'DELETE' }))).status).toBe(404);
    expect(s3.objects.has('other/outside.txt')).toBe(true);
  });
  it('zips a selection by streaming each object', async () => {
    const fd = new FormData(); fd.append('cd', 'assets/img'); fd.append('cs', '0'); fd.append('zip_file[]', 'pixel.png'); fd.append('zip_file[]', 'notes.txt'); fd.append('zip_file[]', 'missing.txt');
    const r = await fetch(api('/attachments/0'), { method: 'POST', body: fd });
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toBe('application/zip');
    const buf = Buffer.from(await r.arrayBuffer());
    expect(buf.subarray(0, 4).toString('hex')).toBe('504b0304'); expect(buf.includes(Buffer.from('notes.txt'))).toBe(true); expect(buf.includes(Buffer.from('pixel.png'))).toBe(true);
    expect(buf.toString('latin1').split('PK\u0003\u0004').length - 1).toBe(2); // two local file headers, the missing one skipped
  });
  it('turns provider errors into 5xx JSON without leaking them', async () => {
    const bad = createS3Source({ id: 9, name: 'bad', bucket: 'nope', endpoint: s3.origin, credentials: FAKE_CREDENTIALS });
    await expect(bad.listDirectory('/')).rejects.toMatchObject({ name: 'S3Error', status: 502 });
    const forged = createS3Source({ id: 8, name: 'forged', bucket: 'media', endpoint: s3.origin, credentials: { accessKeyId: 'AKIAFAKEFAKEFAKEFAKE', secretAccessKey: 'wrong' } });
    await expect(forged.listDirectory('/')).rejects.toMatchObject({ name: 'S3Error', status: 403 });
  });
});
