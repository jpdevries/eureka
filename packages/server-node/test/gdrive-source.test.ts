import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { createGoogleDriveSource, createServiceAccountToken, createRefreshTokenProvider, startServer } from '../src/index.js';
import { startFakeDrive, FOLDER_MIME, type FakeDrive } from './fake-gdrive.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const GIF2 = Buffer.from('47494638396101000100800000000000ffffff21f90400000000002c0000000001000100000202440100' + '21f90400000000002c0000000001000100000202440100' + '3b', 'hex');
const specDir = path.resolve(__dirname, '../../../spec/schema');
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
for (const f of await fs.readdir(specDir)) if (f.endsWith('.json')) ajv.addSchema(JSON.parse(await fs.readFile(path.join(specDir, f), 'utf8')));
const base = 'https://eureka.markup.tips/spec/3/schema/';
const validEntries = ajv.compile({ type: 'array', items: { $ref: base + 'entry.json' } });
const validTree = ajv.compile({ type: 'array', items: { $ref: base + 'tree-node.json' } });

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const PRIVATE_PEM = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
const PUBLIC_PEM = publicKey.export({ type: 'spki', format: 'pem' }) as string;
const REFRESH = { clientId: 'client-1', clientSecret: 'secret-1', refreshToken: 'refresh-1' };

describe('Google OAuth without a client library (11 MS-44)', () => {
  let drive: FakeDrive;
  beforeAll(async () => { drive = await startFakeDrive({ publicKeyPem: PUBLIC_PEM, refresh: REFRESH }); });
  afterAll(async () => { await drive.close(); });
  it('signs the service-account JWT with RS256 and caches the token until it nearly expires', async () => {
    let now = Date.now(); // the fake checks exp against the real clock
    const getToken = createServiceAccountToken({ clientEmail: 'eureka@project.iam.gserviceaccount.com', privateKey: PRIVATE_PEM.replace(/\n/g, '\\n'), tokenUrl: drive.tokenUrl, now: () => now });
    expect(await getToken()).toBe('tok-1');
    expect(await getToken()).toBe('tok-1'); // cached
    now += 3600 * 1000; // past expiry minus the minute of slack
    expect(await getToken()).toBe('tok-2');
    expect(drive.tokenCalls).toBe(2);
  });
  it('rejects a JWT signed with another key as 403', async () => {
    const other = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
    const getToken = createServiceAccountToken({ clientEmail: 'x@y', privateKey: other, tokenUrl: drive.tokenUrl });
    await expect(getToken()).rejects.toMatchObject({ name: 'GoogleAuthError', status: 403 });
  });
  it('exchanges a refresh token', async () => {
    const getToken = createRefreshTokenProvider({ ...REFRESH, tokenUrl: drive.tokenUrl });
    expect(await getToken()).toMatch(/^tok-/);
    await expect(createRefreshTokenProvider({ ...REFRESH, refreshToken: 'wrong', tokenUrl: drive.tokenUrl })()).rejects.toMatchObject({ status: 403 });
  });
});

describe('Google Drive media source over a fake Drive (11 MS-40..MS-44, MS-50..MS-55)', () => {
  let drive: FakeDrive, origin: string, close: () => Promise<void>;
  const api = (p: string) => `${origin}/media${p}`;
  const j = async (r: Response) => ({ status: r.status, body: await r.json() });
  const names = (body: unknown) => (body as Array<{ filename?: string; foldername?: string }>).map((e) => e.filename ?? e.foldername);
  let photos: string, docs: string, plan: string;

  beforeAll(async () => {
    drive = await startFakeDrive({ publicKeyPem: PUBLIC_PEM });
    photos = drive.add({ name: 'Photos', mimeType: FOLDER_MIME }).id;
    docs = drive.add({ name: 'Docs', mimeType: FOLDER_MIME }).id;
    drive.add({ name: 'readme.txt', mimeType: 'text/plain', data: Buffer.from('hello from drive\nline two') });
    drive.add({ name: 'dup.png', mimeType: 'image/png', data: PNG, createdTime: '2026-01-01T00:00:00Z', imageMediaMetadata: { width: 1, height: 1 } });
    drive.add({ name: 'dup.png', mimeType: 'image/png', data: PNG, createdTime: '2026-02-01T00:00:00Z', imageMediaMetadata: { width: 1, height: 1 } });
    plan = drive.add({ name: 'Plan', mimeType: 'application/vnd.google-apps.document' }).id;
    drive.add({ name: 'a/b.txt', mimeType: 'text/plain', data: Buffer.from('slash') });
    drive.add({ name: 'gone.txt', mimeType: 'text/plain', data: Buffer.from('x') }).trashed = true;
    const turtle = drive.add({ name: 'turtle.jpg', mimeType: 'image/jpeg', parents: [photos], data: Buffer.from('jpegbytes'), imageMediaMetadata: { width: 400, height: 300 }, thumbnail: true });
    drive.add({ name: 'earth.tif', mimeType: 'image/tiff', parents: [photos], data: Buffer.alloc(1000, 1), imageMediaMetadata: { width: 8000, height: 8000 }, thumbnail: true, thumbnailVersion: 7 });
    drive.add({ name: 'loop.gif', mimeType: 'image/gif', parents: [photos], data: GIF2 });
    drive.add({ name: '2026', mimeType: FOLDER_MIME, parents: [photos] });
    drive.add({ name: 'turtle shortcut', mimeType: 'application/vnd.google-apps.shortcut', parents: [docs], shortcutDetails: { targetId: turtle.id, targetMimeType: 'image/jpeg' } });
    const getToken = createServiceAccountToken({ clientEmail: 'eureka@project.iam.gserviceaccount.com', privateKey: PRIVATE_PEM, tokenUrl: drive.tokenUrl });
    const source = createGoogleDriveSource({ id: 0, name: 'drive', getToken, apiBase: drive.apiBase, uploadBase: drive.uploadBase, cacheTtl: 0 });
    const started = await startServer({ sources: [source], port: 0, basePath: '/' });
    origin = `http://127.0.0.1:${started.port}`; close = started.close;
  });
  afterAll(async () => { await close(); await drive.close(); });

  it('maps Drive to paths: unique display names, slashes replaced, native documents with an extension, shortcuts resolved, trash hidden', async () => {
    const root = await j(await fetch(api('/sources/0?path=/')));
    expect(root.status).toBe(200); expect(validEntries(root.body), JSON.stringify(validEntries.errors)).toBe(true);
    expect(names(root.body)).toEqual(['Docs', 'Photos', 'Plan.gdoc', 'a∕b.txt', 'dup (2).png', 'dup.png', 'readme.txt']);
    const planEntry = (root.body as Array<Record<string, unknown>>).find((e) => e.filename === 'Plan.gdoc')!;
    expect(planEntry.fileSize).toBe(0); expect(planEntry.absoluteURL).toBe('/sources/drive/Plan.gdoc');
    const dup2 = (root.body as Array<Record<string, unknown>>).find((e) => e.filename === 'dup (2).png')!;
    expect(dup2).toMatchObject({ dimensions: [1, 1], path: 'dup (2).png' }); // the later-created duplicate gets the suffix, deterministically
    const inDocs = await j(await fetch(api('/sources/0?path=Docs')));
    expect((inDocs.body as Array<Record<string, unknown>>).find((e) => e.filename === 'turtle shortcut')).toMatchObject({ fileSize: 9, dimensions: [400, 300] }); // the shortcut shows its target's facts
    const inPhotos = await j(await fetch(api('/sources/0?path=Photos')));
    expect(names(inPhotos.body)).toEqual(['2026', 'earth.tif', 'loop.gif', 'turtle.jpg']);
    expect((inPhotos.body as Array<Record<string, unknown>>).find((e) => e.filename === 'loop.gif')).toMatchObject({ animated: true });
    expect((await j(await fetch(api('/sources/0?path=nope')))).status).toBe(404);
    expect((await j(await fetch(api('/sources/0?path=..')))).status).toBe(400);
  });
  it('lists the tree by level, with the depth cut-off, and follows page tokens', async () => {
    const tree = await j(await fetch(api('/sources/0')));
    expect(validTree(tree.body)).toBe(true);
    expect(tree.body).toEqual([{ name: 'Docs', cd: 'Docs', children: [] }, { name: 'Photos', cd: 'Photos', children: [{ name: '2026', cd: 'Photos/2026', children: [] }] }]);
    expect((await j(await fetch(api('/sources/0?depth=1')))).body).toEqual([{ name: 'Docs', cd: 'Docs' }, { name: 'Photos', cd: 'Photos' }]);
    expect((await j(await fetch(api('/sources/0?tree=Photos&depth=1')))).body).toEqual([{ name: '2026', cd: 'Photos/2026' }]);
    drive.pageSize = 2; drive.requests.length = 0;
    try { expect(names((await j(await fetch(api('/sources/0?path=/')))).body)).toHaveLength(7); expect(drive.requests.filter((r) => r.includes('pageToken=')).length).toBeGreaterThanOrEqual(1); }
    finally { drive.pageSize = 1000; }
  });
  it('proxies bytes with Range, exports native documents, renders text thumbnails', async () => {
    const r = await fetch(`${origin}/sources/drive/readme.txt`);
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toContain('text/plain'); expect(await r.text()).toBe('hello from drive\nline two');
    const part = await fetch(`${origin}/sources/drive/readme.txt`, { headers: { range: 'bytes=0-4' } });
    expect(part.status).toBe(206); expect(part.headers.get('content-range')).toBe('bytes 0-4/25'); expect(await part.text()).toBe('hello');
    expect((await fetch(`${origin}/sources/drive/readme.txt`, { headers: { range: 'bytes=99-' } })).status).toBe(416);
    const pdf = await fetch(`${origin}/sources/drive/Plan.gdoc`);
    expect(pdf.status).toBe(200); expect(pdf.headers.get('content-type')).toBe('application/pdf'); expect(await pdf.text()).toContain('export of Plan as application/pdf');
    expect((await fetch(`${origin}/sources/drive/a%E2%88%95b.txt`)).status).toBe(200);
    expect((await fetch(`${origin}/sources/drive/missing.txt`)).status).toBe(404);
    expect((await fetch(`${origin}/sources/drive/Photos`)).status).toBe(404); // a folder has no bytes
    const t = await fetch(`${origin}/sources/drive/__thumb/readme.txt`);
    expect(t.status).toBe(200); expect(await t.text()).toContain('<title>Preview of readme.txt</title>');
    expect((await fetch(`${origin}/sources/drive/__thumb/Plan.gdoc`)).status).toBe(404);
  });
  it('uploads (replacing a same-named file), creates folders idempotently, renames by patch, trashes on delete, zips', async () => {
    const fd = new FormData(); fd.append('eureka__uploadFiles', new File([PNG], 'new one.png', { type: 'image/png' })); fd.append('eureka__uploadFiles', new File(['x'], '../evil.txt'));
    const up = await j(await fetch(api('/sources/0?path=Photos'), { method: 'POST', body: fd }));
    expect(up.status).toBe(200); expect(validEntries(up.body)).toBe(true); expect(names(up.body)).toEqual(['2026', 'earth.tif', 'evil.txt', 'loop.gif', 'new one.png', 'turtle.jpg']);
    const created = [...drive.files.values()].find((f) => f.name === 'new one.png')!;
    expect(created.parents).toEqual([photos]); expect(created.mimeType).toBe('image/png');
    const again = new FormData(); again.append('eureka__uploadFiles', new File(['replaced'], 'evil.txt'));
    await fetch(api('/sources/0?path=Photos'), { method: 'POST', body: again });
    const evil = [...drive.files.values()].filter((f) => f.name === 'evil.txt' && !f.trashed);
    expect(evil).toHaveLength(1); expect(evil[0]!.data.toString()).toBe('replaced'); // same id, new bytes, no duplicate

    const mk = await j(await fetch(api('/sources/0?path=Photos%2Fnewdir'), { method: 'PUT' }));
    expect(mk.status).toBe(200); expect(names(mk.body)).toContain('newdir');
    await fetch(api('/sources/0?path=Photos%2Fnewdir'), { method: 'PUT' });
    expect([...drive.files.values()].filter((f) => f.name === 'newdir')).toHaveLength(1); // idempotent

    const renamed = await j(await fetch(api('/sources/0?path=Photos%2Fevil.txt&name=fine.txt'), { method: 'PUT' }));
    expect(renamed.status).toBe(200); expect(names(renamed.body)).toContain('fine.txt'); expect(names(renamed.body)).not.toContain('evil.txt');
    expect((await j(await fetch(api('/sources/0?path=Photos%2Ffine.txt&name=turtle.jpg'), { method: 'PUT' }))).status).toBe(409);
    expect((await j(await fetch(api('/sources/0?path=Plan.gdoc&name=Roadmap.gdoc'), { method: 'PUT' }))).status).toBe(200);
    expect(drive.files.get(plan)!.name).toBe('Roadmap'); // the virtual extension never reaches Drive
    expect(names((await j(await fetch(api('/sources/0?path=/')))).body)).toContain('Roadmap.gdoc');

    const removed = await j(await fetch(api('/sources/0?path=Photos%2Ffine.txt'), { method: 'DELETE' }));
    expect(removed.status).toBe(200); expect(names(removed.body)).not.toContain('fine.txt');
    expect([...drive.files.values()].find((f) => f.name === 'fine.txt')!.trashed).toBe(true); // trashed, not gone (MS-42)
    const bulk = new FormData(); bulk.append('cd', 'Photos'); bulk.append('cs', '0'); bulk.append('delete_file[]', 'new one.png'); bulk.append('delete_file[]', 'missing.txt');
    const bulked = await j(await fetch(api('/sources/0'), { method: 'DELETE', body: bulk }));
    expect(bulked.status).toBe(200); expect(names(bulked.body)).toEqual(['2026', 'earth.tif', 'loop.gif', 'newdir', 'turtle.jpg']);
    expect((await j(await fetch(api('/sources/0?path=/'), { method: 'DELETE' }))).status).toBe(400);

    const zf = new FormData(); zf.append('cd', '/'); zf.append('cs', '0'); zf.append('zip_file[]', 'readme.txt'); zf.append('zip_file[]', 'Roadmap.gdoc'); zf.append('zip_file[]', 'Photos');
    const z = await fetch(api('/attachments/0'), { method: 'POST', body: zf });
    expect(z.status).toBe(200); const buf = Buffer.from(await z.arrayBuffer());
    expect(buf.subarray(0, 4).toString('hex')).toBe('504b0304'); expect(buf.includes(Buffer.from('readme.txt'))).toBe(true); expect(buf.includes(Buffer.from('Roadmap.gdoc.pdf'))).toBe(true);
  });
  it('previews: Drive\'s thumbnail at the requested width, renditions for srcset, ETag/304, token never sent, expired links refreshed (MS-56)', async () => {
    const photos = await j(await fetch(api('/sources/0?path=Photos')));
    const earth = (photos.body as Array<Record<string, unknown>>).find((e) => e.filename === 'earth.tif')!;
    expect(earth.absolutePreviewURL).toBe('/sources/drive/__preview/Photos/earth.tif');
    expect(earth.renditions).toEqual([{ url: '/sources/drive/__preview/Photos/earth.tif?w=220&f=jpeg', width: 220, type: 'image/jpeg' }, { url: '/sources/drive/__preview/Photos/earth.tif?w=440&f=jpeg', width: 440, type: 'image/jpeg' }, { url: '/sources/drive/__preview/Photos/earth.tif?w=880&f=jpeg', width: 880, type: 'image/jpeg' }]);
    const turtle = (photos.body as Array<Record<string, unknown>>).find((e) => e.filename === 'turtle.jpg')!;
    expect((turtle.renditions as Array<{ width: number }>).map((r) => r.width)).toEqual([220]); // never wider than the 400 px picture
    expect((photos.body as Array<Record<string, unknown>>).find((e) => e.filename === 'loop.gif')!.absolutePreviewURL).toBe('/sources/drive/Photos/loop.gif'); // no Drive thumbnail: itself
    drive.thumbnailRequests.length = 0;
    const r = await fetch(`${origin}/sources/drive/__preview/Photos/earth.tif?w=440`);
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toBe('image/jpeg'); expect(r.headers.get('etag')).toBe('"p-7-440-jpeg"');
    expect((await r.text())).toBe('jpeg thumb earth.tif 440 q80'); // JPEG at quality 80 by default, a quarter of Drive's PNG
    expect(drive.thumbnailRequests).toEqual([{ size: 440, format: 'jpeg', authorized: false }]); // the signed link goes out without the bearer token
    expect((await fetch(`${origin}/sources/drive/__preview/Photos/earth.tif?w=440`, { headers: { 'if-none-match': '"p-7-440-jpeg"' } })).status).toBe(304);
    const webp = await fetch(`${origin}/sources/drive/__preview/Photos/earth.tif?w=220&f=webp`);
    expect(webp.headers.get('content-type')).toBe('image/webp'); expect(webp.headers.get('etag')).toBe('"p-7-220-webp"');
    expect((await fetch(`${origin}/sources/drive/__preview/Photos/earth.tif`)).headers.get('etag')).toBe('"p-7-320-jpeg"'); // default width
    expect((await fetch(`${origin}/sources/drive/__preview/Photos/earth.tif?w=99999&f=bmp`)).headers.get('etag')).toBe('"p-7-1600-jpeg"'); // clamped; unknown format falls back
    // a source that caches listings holds the old signed link: the first fetch is refused, fresh metadata gives a new one
    const cachedSource = createGoogleDriveSource({ id: 1, name: 'cached', getToken: createServiceAccountToken({ clientEmail: 'x@y', privateKey: PRIVATE_PEM, tokenUrl: drive.tokenUrl }), apiBase: drive.apiBase, uploadBase: drive.uploadBase });
    await cachedSource.listDirectory('Photos');
    drive.expireThumbnails(); drive.thumbnailRequests.length = 0;
    const again = await cachedSource.preview!('Photos/earth.tif', { width: 220 });
    expect(again && !again.notModified && again.contentType).toBe('image/jpeg');
    expect(drive.thumbnailRequests.length).toBe(2); // expired link (403), fresh metadata, second fetch
    expect((await fetch(`${origin}/sources/drive/__preview/Photos/loop.gif`)).status).toBe(404);
    expect((await fetch(`${origin}/sources/drive/__preview/nope.tif`)).status).toBe(404);
  });
  it('turns read-only after Drive refuses a write (MS-09) and lists it', async () => {
    drive.readOnly = true;
    try {
      const r = await j(await fetch(api('/sources/0?path=Photos%2Fblocked'), { method: 'PUT' }));
      expect(r.status).toBe(403);
      expect((await j(await fetch(api('/sources/')))).body[0].capabilities).toEqual({ upload: false, createDirectory: false, rename: false, delete: false });
      drive.requests.length = 0;
      expect((await j(await fetch(api('/sources/0?path=readme.txt'), { method: 'DELETE' }))).status).toBe(403);
      expect(drive.requests).toEqual([]); // refused up front, Drive not asked
    } finally { drive.readOnly = false; }
  });
});
