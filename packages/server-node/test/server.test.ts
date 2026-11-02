import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { createFilesystemSource, createEurekaHandler, startServer, type PageContext } from '../src/index.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const specDir = path.resolve(__dirname, '../../../spec/schema');
const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
for (const f of await fs.readdir(specDir)) if (f.endsWith('.json')) ajv.addSchema(JSON.parse(await fs.readFile(path.join(specDir, f), 'utf8')));
const base = 'https://eureka.markup.tips/spec/3/schema/';
const validEntries = ajv.compile({ type: 'array', items: { $ref: base + 'entry.json' } });
const validTree = ajv.compile({ type: 'array', items: { $ref: base + 'tree-node.json' } });
const validSources = ajv.compile({ type: 'array', items: { $ref: base + 'source.json' } });

let root: string, origin: string, close: () => Promise<void>, rendered: PageContext[] = [];
const api = (p: string) => `${origin}/assets/components/eureka/media${p}`;
const j = async (r: Response) => ({ status: r.status, body: await r.json() });

beforeAll(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'eureka-src-'));
  await fs.mkdir(path.join(root, 'assets/img/redwoods'), { recursive: true });
  await fs.mkdir(path.join(root, 'uploads'), { recursive: true });
  await fs.mkdir(path.join(root, '.hidden'), { recursive: true });
  await fs.writeFile(path.join(root, 'assets/img/pixel.png'), PNG);
  await fs.writeFile(path.join(root, 'assets/img/Wide Banner (final).png'), PNG);
  await fs.writeFile(path.join(root, 'assets/img/notes.txt'), 'hello');
  await fs.writeFile(path.join(root, 'readme.txt'), 'root file');
  const sources = [createFilesystemSource({ id: 0, name: 'filesystem', root }), createFilesystemSource({ id: 'cloud', name: 'cloud', root: path.join(root, 'uploads') })];
  const started = await startServer({ sources, port: 0, basePath: '/assets/components/eureka/', renderPage: async (ctx) => { rendered.push(ctx); return `<!doctype html><title>stub</title><p id="cd">${ctx.path}</p><p id="n">${ctx.entries.length}</p>`; } });
  origin = `http://127.0.0.1:${started.port}`; close = started.close;
});
afterAll(async () => { await close(); await fs.rm(root, { recursive: true, force: true }); });

describe('REST API (api/openapi.yaml)', () => {
  it('lists sources', async () => {
    const { status, body } = await j(await fetch(api('/sources/')));
    expect(status).toBe(200); expect(validSources(body)).toBe(true);
    expect(body).toEqual([{ id: 0, name: 'filesystem' }, { id: 'cloud', name: 'cloud' }]);
  });
  it('returns the tree without path and the listing with path, hiding dotfiles', async () => {
    const tree = await j(await fetch(api('/sources/0')));
    expect(validTree(tree.body)).toBe(true);
    expect(tree.body).toEqual([{ name: 'assets', cd: 'assets', children: [{ name: 'img', cd: 'assets/img', children: [{ name: 'redwoods', cd: 'assets/img/redwoods', children: [] }] }] }, { name: 'uploads', cd: 'uploads', children: [] }]);
    const listing = await j(await fetch(api('/sources/0?path=assets%2Fimg')));
    expect(listing.status).toBe(200); expect(validEntries(listing.body), JSON.stringify(validEntries.errors)).toBe(true);
    const names = (listing.body as Array<{ filename?: string; foldername?: string }>).map((e) => e.filename ?? e.foldername);
    expect(names).toEqual(['Wide Banner (final).png', 'notes.txt', 'pixel.png', 'redwoods']);
    const pixel = (listing.body as Array<{ filename?: string; dimensions?: number[]; absoluteURL: string; fileSize: number; directory: string; path: string }>).find((e) => e.filename === 'pixel.png')!;
    expect(pixel).toMatchObject({ dimensions: [1, 1], fileSize: PNG.length, directory: 'assets/img', path: 'assets/img/pixel.png', absoluteURL: '/sources/filesystem/assets/img/pixel.png' });
    const wide = (listing.body as Array<{ filename?: string; absoluteURL: string }>).find((e) => e.filename?.startsWith('Wide'))!;
    expect(wide.absoluteURL).toBe('/sources/filesystem/assets/img/Wide%20Banner%20(final).png');
    const rootListing = await j(await fetch(api('/sources/0?path=/')));
    expect((rootListing.body as Array<{ foldername?: string }>).some((e) => e.foldername === '.hidden')).toBe(false);
  });
  it('serves files at absoluteURL and refuses traversal', async () => {
    const r = await fetch(`${origin}/sources/filesystem/assets/img/pixel.png`);
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toBe('image/png');
    expect(Buffer.from(await r.arrayBuffer()).equals(PNG)).toBe(true);
    expect((await fetch(`${origin}/sources/filesystem/..%2F..%2Fetc%2Fpasswd`)).status).toBe(404);
    const t = await j(await fetch(api('/sources/0?path=..%2F..')));
    expect(t.status).toBe(400); expect(t.body).toHaveProperty('error');
    expect((await j(await fetch(api('/sources/0?path=nope')))).status).toBe(404);
    expect((await j(await fetch(api('/sources/zzz')))).status).toBe(404);
  });
  it('uploads multipart files and returns the refreshed listing', async () => {
    const fd = new FormData();
    fd.append('eureka__uploadFiles', new File([PNG], 'new one.png', { type: 'image/png' }));
    fd.append('eureka__uploadFiles', new File(['x'], '../evil.txt'));
    const { status, body } = await j(await fetch(api('/sources/0?path=uploads'), { method: 'POST', body: fd }));
    expect(status).toBe(200); expect(validEntries(body)).toBe(true);
    expect((body as Array<{ filename?: string }>).map((e) => e.filename)).toEqual(['evil.txt', 'new one.png']);
    expect(await fs.readFile(path.join(root, 'uploads/evil.txt'), 'utf8')).toBe('x');
    await expect(fs.access(path.join(root, 'evil.txt'))).rejects.toThrow();
  });
  it('creates, renames and deletes', async () => {
    const created = await j(await fetch(api('/sources/0?path=uploads%2Fnewdir'), { method: 'PUT' }));
    expect(created.status).toBe(200); expect((created.body as Array<{ foldername?: string }>).some((e) => e.foldername === 'newdir')).toBe(true);
    const renamed = await j(await fetch(api('/sources/0?path=uploads%2Fnewdir&name=renamed'), { method: 'PUT' }));
    expect((renamed.body as Array<{ foldername?: string }>).map((e) => e.foldername).filter(Boolean)).toEqual(['renamed']);
    const conflict = await j(await fetch(api('/sources/0?path=uploads%2Frenamed&name=evil.txt'), { method: 'PUT' }));
    expect(conflict.status).toBe(409);
    const removed = await j(await fetch(api('/sources/0?path=uploads%2Frenamed'), { method: 'DELETE' }));
    expect(removed.status).toBe(200); expect((removed.body as Array<{ foldername?: string }>).some((e) => e.foldername === 'renamed')).toBe(false);
    const fd = new FormData(); fd.append('cd', 'uploads'); fd.append('cs', '0'); fd.append('delete_file[]', 'evil.txt'); fd.append('delete_file[]', 'missing.txt');
    const bulk = await j(await fetch(api('/sources/0'), { method: 'DELETE', body: fd }));
    expect(bulk.status).toBe(200); expect((bulk.body as Array<{ filename?: string }>).map((e) => e.filename)).toEqual(['new one.png']);
    expect((await j(await fetch(api('/sources/0?path=/'), { method: 'DELETE' }))).status).toBe(400);
  });
  it('zips a selection', async () => {
    const fd = new FormData(); fd.append('cd', 'assets/img'); fd.append('cs', '0'); fd.append('zip_file[]', 'pixel.png'); fd.append('zip_file[]', 'notes.txt');
    const r = await fetch(api('/attachments/0'), { method: 'POST', body: fd });
    expect(r.status).toBe(200); expect(r.headers.get('content-type')).toBe('application/zip');
    expect(r.headers.get('content-disposition')).toContain('eureka-0.zip');
    const buf = Buffer.from(await r.arrayBuffer());
    expect(buf.subarray(0, 4).toString('hex')).toBe('504b0304');
    expect(buf.includes(Buffer.from('notes.txt'))).toBe(true);
  });
  it('rejects bad requests with 4xx and an error body', async () => {
    expect((await j(await fetch(api('/sources/0'), { method: 'POST', body: new FormData() }))).status).toBe(400);
    expect((await j(await fetch(api('/sources/0'), { method: 'PUT' }))).status).toBe(400);
    expect((await j(await fetch(api('/sources/'), { method: 'POST' }))).status).toBe(405);
  });
});

describe('Level 0 protocol (03)', () => {
  it('renders the page with the requested directory and language', async () => {
    rendered = [];
    const r = await fetch(`${origin}/assets/components/eureka/?path=assets%2Fimg&ln=nl`);
    expect(r.status).toBe(200); expect(await r.text()).toContain('<p id="cd">assets/img</p>');
    expect(rendered[0]).toMatchObject({ path: 'assets/img', lang: 'nl', basePath: '/assets/components/eureka' });
    expect(rendered[0]!.entries.length).toBe(4); expect(rendered[0]!.tree.length).toBe(2);
  });
  it('navigates on POST with the browsing select value (NOJS-32)', async () => {
    const fd = new FormData(); fd.append('eureka__mediaSourceId', '0'); fd.append('eureka__upload-dir', 'assets/img'); fd.append('eureka__media-browser_0__browsing', '0||assets/img/redwoods');
    const r = await fetch(`${origin}/assets/components/eureka/`, { method: 'POST', body: fd });
    expect(await r.text()).toContain('<p id="cd">assets/img/redwoods</p>');
  });
  it('uploads then re-renders (NOJS-30) and chooses (NOJS-31)', async () => {
    rendered = [];
    const fd = new FormData(); fd.append('eureka__mediaSourceId', '0'); fd.append('eureka__upload-dir', 'uploads'); fd.append('eureka__media-browser_0__browsing', '0||uploads');
    fd.append('eureka__uploadFiles', new File([PNG], 'form-upload.png', { type: 'image/png' }));
    const r = await fetch(`${origin}/assets/components/eureka/`, { method: 'POST', body: fd });
    expect(r.status).toBe(200); expect(rendered[0]!.uploaded).toEqual(['form-upload.png']);
    const choose = new FormData(); choose.append('eureka__mediaSourceId', '0'); choose.append('eureka__upload-dir', 'uploads'); choose.append('eureka__chosen_item', 'form-upload.png');
    const c = await fetch(`${origin}/assets/components/eureka/`, { method: 'POST', body: choose });
    const text = await c.text();
    expect(text).toContain('Eureka!'); expect(text).toContain('uploads/form-upload.png');
  });
});

describe('handler as a plain function', () => {
  it('returns false for paths it does not own', async () => {
    const handle = createEurekaHandler({ sources: [createFilesystemSource({ id: 0, name: 'x', root })] });
    const res = { headersSent: false, writeHead() { return this; }, end() {} } as never;
    expect(await handle({ url: '/somewhere/else', method: 'GET', headers: {} } as never, res)).toBe(false);
  });
});
