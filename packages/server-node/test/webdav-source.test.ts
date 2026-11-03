import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { createWebDavSource, startServer, parseMultistatus } from '../src/index.js';
import { startFakeDav, FAKE_DAV_CREDENTIALS, type FakeDav } from './fake-webdav.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const GIF2 = Buffer.from('47494638396101000100800000000000ffffff21f90400000000002c0000000001000100000202440100' + '21f90400000000002c0000000001000100000202440100' + '3b', 'hex');
const specDir = path.resolve(__dirname, '../../../spec/schema');
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
for (const f of await fs.readdir(specDir)) if (f.endsWith('.json')) ajv.addSchema(JSON.parse(await fs.readFile(path.join(specDir, f), 'utf8')));
const base = 'https://eureka.markup.tips/spec/3/schema/';
const validEntries = ajv.compile({ type: 'array', items: { $ref: base + 'entry.json' } });
const validTree = ajv.compile({ type: 'array', items: { $ref: base + 'tree-node.json' } });

describe('multistatus parsing (11 MS-61)', () => {
  it('reads responses whatever the namespace prefix, keeps the 200 propstat, drops hrefs outside the base', () => {
    const xml = `<?xml version="1.0"?><d:multistatus xmlns:d="DAV:"><d:response><d:href>/dav/files/jp/Photos/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/></d:resourcetype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response>
      <d:response><d:href>http://host/dav/files/jp/Photos/a%20b.jpg</d:href><d:propstat><d:prop><d:getcontentlength>12</d:getcontentlength><d:getlastmodified>Sun, 02 Nov 2026 12:00:00 GMT</d:getlastmodified><d:getetag>&quot;x1&quot;</d:getetag><d:getcontenttype>image/jpeg</d:getcontenttype><d:resourcetype/></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:quota/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response>
      <d:response><d:href>/dav/files/jp/Other/x.jpg</d:href><d:propstat><d:prop><d:resourcetype/></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response></d:multistatus>`;
    const out = parseMultistatus(xml, '/dav/files/jp/Photos');
    expect(out).toEqual([
      { path: '/', name: '', collection: true, size: 0, modified: 0, created: 0, etag: '', contentType: '' },
      { path: 'a b.jpg', name: 'a b.jpg', collection: false, size: 12, modified: Date.parse('2026-11-02T12:00:00Z'), created: 0, etag: '"x1"', contentType: 'image/jpeg' }
    ]);
    const plain = parseMultistatus('<multistatus xmlns="DAV:"><response><href>/dav/files/jp/Photos/sub/</href><propstat><prop><resourcetype><collection/></resourcetype></prop><status>HTTP/1.1 200 OK</status></propstat></response></multistatus>', '/dav/files/jp/Photos');
    expect(plain).toEqual([{ path: 'sub', name: 'sub', collection: true, size: 0, modified: 0, created: 0, etag: '', contentType: '' }]);
  });
});

describe('WebDAV media source over a fake server (11 MS-60..MS-65)', () => {
  let dav: FakeDav, origin: string, close: () => Promise<void>;
  const api = (p: string) => `${origin}/media${p}`;
  const j = async (r: Response) => ({ status: r.status, body: await r.json() });
  const names = (body: unknown) => (body as Array<{ filename?: string; foldername?: string }>).map((e) => e.filename ?? e.foldername);
  const B = '/remote.php/dav/files/jp/Photos';

  beforeAll(async () => {
    dav = await startFakeDav(B);
    dav.mkcol(`${B}/trips`); dav.mkcol(`${B}/trips/2026`); dav.mkcol(`${B}/trips/2026/coast`); dav.mkcol(`${B}/empty`); dav.mkcol(`${B}/.hidden`);
    dav.put(`${B}/readme.txt`, 'hello from dav\nline two', 'text/plain');
    dav.put(`${B}/Wide Banner (final).png`, PNG, 'image/png');
    dav.put(`${B}/trips/pixel.png`, PNG, 'image/png');
    dav.put(`${B}/trips/loop.gif`, GIF2, 'image/gif');
    dav.put(`${B}/trips/notes.md`, '# Notes', 'text/markdown');
    const source = createWebDavSource({ id: 0, name: 'cloud', url: dav.url, ...FAKE_DAV_CREDENTIALS, treeTtl: 0 });
    const started = await startServer({ sources: [source], port: 0, basePath: '/' });
    origin = `http://127.0.0.1:${started.port}`; close = started.close;
  });
  afterAll(async () => { await close(); await dav.close(); });

  it('lists with PROPFIND Depth 1, probes images, hides dotfiles, offers Nextcloud previews', async () => {
    dav.requests.length = 0;
    const root = await j(await fetch(api('/sources/0?path=/')));
    expect(root.status).toBe(200); expect(validEntries(root.body), JSON.stringify(validEntries.errors)).toBe(true);
    expect(names(root.body)).toEqual(['Wide Banner (final).png', 'empty', 'readme.txt', 'trips']);
    expect(dav.requests.filter((r) => r.startsWith('PROPFIND')).length).toBe(1);
    expect(dav.requests[0]).toContain('depth=1');
    const wide = (root.body as Array<Record<string, unknown>>).find((e) => e.filename === 'Wide Banner (final).png')!;
    expect(wide).toMatchObject({ dimensions: [1, 1], fileSize: PNG.length, absoluteURL: '/sources/cloud/Wide%20Banner%20(final).png', absolutePreviewURL: '/sources/cloud/__preview/Wide%20Banner%20(final).png', editedOn: Date.parse('2026-11-02T12:00:00Z') });
    expect((wide.renditions as Array<{ width: number }>).map((r) => r.width)).toEqual([220]);
    expect((root.body as Array<Record<string, unknown>>).find((e) => e.filename === 'readme.txt')!.absolutePreviewURL).toBe('/sources/cloud/__thumb/readme.txt');
    const trips = await j(await fetch(api('/sources/0?path=trips')));
    expect(names(trips.body)).toEqual(['2026', 'loop.gif', 'notes.md', 'pixel.png']);
    expect((trips.body as Array<Record<string, unknown>>).find((e) => e.filename === 'loop.gif')).toMatchObject({ animated: true });
    expect((await j(await fetch(api('/sources/0?path=nope')))).status).toBe(404);
    expect((await j(await fetch(api('/sources/0?path=readme.txt')))).status).toBe(404); // a file is not a directory
    expect((await j(await fetch(api('/sources/0?path=..')))).status).toBe(400);
  });
  it('builds the tree level by level with the depth cut-off', async () => {
    const tree = await j(await fetch(api('/sources/0')));
    expect(validTree(tree.body)).toBe(true);
    expect(tree.body).toEqual([{ name: 'empty', cd: 'empty', children: [] }, { name: 'trips', cd: 'trips', children: [{ name: '2026', cd: 'trips/2026', children: [{ name: 'coast', cd: 'trips/2026/coast' }] }] }]);
    expect((await j(await fetch(api('/sources/0?tree=trips%2F2026&depth=1')))).body).toEqual([{ name: 'coast', cd: 'trips/2026/coast' }]);
    expect((await j(await fetch(api('/sources/0?tree=nope')))).status).toBe(404);
  });
  it('serves bytes with Range, text thumbnails, and Nextcloud previews with ETag/304', async () => {
    const r = await fetch(`${origin}/sources/cloud/readme.txt`);
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toContain('text/plain'); expect(await r.text()).toBe('hello from dav\nline two');
    const part = await fetch(`${origin}/sources/cloud/readme.txt`, { headers: { range: 'bytes=0-4' } });
    expect(part.status).toBe(206); expect(part.headers.get('content-range')).toBe('bytes 0-4/23'); expect(await part.text()).toBe('hello');
    expect((await fetch(`${origin}/sources/cloud/readme.txt`, { headers: { range: 'bytes=99-' } })).status).toBe(416);
    expect((await fetch(`${origin}/sources/cloud/trips`)).status).toBe(404); // a collection's index page is not a file
    expect((await fetch(`${origin}/sources/cloud/missing.txt`)).status).toBe(404);
    const t = await fetch(`${origin}/sources/cloud/__thumb/readme.txt`);
    expect(t.status).toBe(200); expect(await t.text()).toContain('<title>Preview of readme.txt</title>');
    dav.previewRequests.length = 0;
    const pv = await fetch(`${origin}/sources/cloud/__preview/trips/pixel.png?w=440`);
    expect(pv.status).toBe(200); expect(pv.headers.get('content-type')).toBe('image/jpeg'); expect(await pv.text()).toBe('jpeg preview pixel.png 440');
    expect(dav.previewRequests[0]).toContain('file=%2FPhotos%2Ftrips%2Fpixel.png'); // the path under the user's files root
    const etag = pv.headers.get('etag')!; expect(etag).toMatch(/^"p-/);
    expect((await fetch(`${origin}/sources/cloud/__preview/trips/pixel.png?w=440`, { headers: { 'if-none-match': etag } })).status).toBe(304);
    expect((await fetch(`${origin}/sources/cloud/__preview/readme.txt`)).status).toBe(404); // text keeps its SVG thumbnail
  });
  it('uploads with PUT, MKCOL idempotently, MOVE for rename, DELETE for folders whole, zips', async () => {
    const fd = new FormData(); fd.append('eureka__uploadFiles', new File([PNG], 'new one.png', { type: 'image/png' })); fd.append('eureka__uploadFiles', new File(['x'], '../evil.txt'));
    const up = await j(await fetch(api('/sources/0?path=empty'), { method: 'POST', body: fd }));
    expect(up.status).toBe(200); expect(validEntries(up.body)).toBe(true); expect(names(up.body)).toEqual(['evil.txt', 'new one.png']);
    expect(dav.nodes.get(`${B}/empty/new one.png`)?.contentType).toBe('image/png'); expect(dav.nodes.has(`${B}/evil.txt`)).toBe(false);
    expect((await j(await fetch(api('/sources/0?path=ghost'), { method: 'POST', body: fd }))).status).toBe(404);
    const mk = await j(await fetch(api('/sources/0?path=empty%2Fnewdir'), { method: 'PUT' }));
    expect(mk.status).toBe(200); expect(names(mk.body)).toContain('newdir');
    expect((await j(await fetch(api('/sources/0?path=empty%2Fnewdir'), { method: 'PUT' }))).status).toBe(200); // 405 from the server is "exists"
    const renamed = await j(await fetch(api('/sources/0?path=empty%2Fevil.txt&name=fine.txt'), { method: 'PUT' }));
    expect(renamed.status).toBe(200); expect(names(renamed.body)).toEqual(['fine.txt', 'new one.png', 'newdir']);
    expect((await j(await fetch(api('/sources/0?path=empty%2Ffine.txt&name=new one.png'), { method: 'PUT' }))).status).toBe(409);
    expect(dav.requests.filter((r) => r.startsWith('MOVE')).length).toBeGreaterThanOrEqual(2);
    dav.put(`${B}/empty/newdir/deep.txt`, 'deep');
    const renamedDir = await j(await fetch(api('/sources/0?path=empty%2Fnewdir&name=renamed'), { method: 'PUT' }));
    expect(names(renamedDir.body)).toEqual(['fine.txt', 'new one.png', 'renamed']); expect(dav.nodes.has(`${B}/empty/renamed/deep.txt`)).toBe(true);
    const removed = await j(await fetch(api('/sources/0?path=empty%2Frenamed'), { method: 'DELETE' }));
    expect(removed.status).toBe(200); expect(names(removed.body)).toEqual(['fine.txt', 'new one.png']);
    expect([...dav.nodes.keys()].some((k) => k.includes('/renamed'))).toBe(false);
    const bulk = new FormData(); bulk.append('cd', 'empty'); bulk.append('cs', '0'); bulk.append('delete_file[]', 'fine.txt'); bulk.append('delete_file[]', 'missing.txt');
    const bulked = await j(await fetch(api('/sources/0'), { method: 'DELETE', body: bulk }));
    expect(bulked.status).toBe(200); expect(names(bulked.body)).toEqual(['new one.png']);
    expect((await j(await fetch(api('/sources/0?path=/'), { method: 'DELETE' }))).status).toBe(400);
    const zf = new FormData(); zf.append('cd', '/'); zf.append('cs', '0'); zf.append('zip_file[]', 'readme.txt'); zf.append('zip_file[]', 'trips'); zf.append('zip_file[]', 'nope.txt');
    const z = await fetch(api('/attachments/0'), { method: 'POST', body: zf });
    const buf = Buffer.from(await z.arrayBuffer()); expect(buf.subarray(0, 4).toString('hex')).toBe('504b0304'); expect(buf.toString('latin1').split('PK\u0003\u0004').length - 1).toBe(1);
  });
  it('bad credentials are 403; a refused write turns the source read-only (MS-63, MS-09)', async () => {
    const bad = createWebDavSource({ id: 9, name: 'bad', url: dav.url, username: 'jp', password: 'wrong' });
    await expect(bad.listDirectory('/')).rejects.toMatchObject({ name: 'DavError', status: 403 });
    dav.readOnly = true;
    try {
      expect((await j(await fetch(api('/sources/0?path=empty%2Fblocked'), { method: 'PUT' }))).status).toBe(403);
      expect((await j(await fetch(api('/sources/')))).body[0].capabilities).toEqual({ upload: false, createDirectory: false, rename: false, delete: false });
    } finally { dav.readOnly = false; }
  });
  it('without a Nextcloud URL there are no previews and images preview as themselves', async () => {
    const plain = await startFakeDav('/dav');
    plain.put('/dav/a.png', PNG, 'image/png');
    const src = createWebDavSource({ id: 'p', name: 'plain', url: plain.url, ...FAKE_DAV_CREDENTIALS });
    try {
      const [a] = await src.listDirectory('/');
      expect(a!.absolutePreviewURL).toBe('/sources/plain/a.png'); expect(a!.renditions).toBeUndefined();
      expect(await src.preview!('a.png', { width: 220 })).toBeNull();
    } finally { await plain.close(); }
  });
});
