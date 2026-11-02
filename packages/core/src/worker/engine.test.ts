import { describe, it, expect, vi } from 'vitest';
import { createEngine } from './engine.js';
import { createEngineClient } from './bridge.js';
import { createRestApi, ApiError, type EurekaApi } from '../api/client.js';
import type { Entry } from '../types.js';

const t0 = Date.UTC(2017, 3, 2);
const entries: Entry[] = [
  { filename: 'b.jpg', directory: 'd', path: 'd/b.jpg', absoluteURL: '/d/b.jpg', editedOn: t0, fileSize: 300, dimensions: [10, 10] },
  { filename: 'a.png', directory: 'd', path: 'd/a.png', absoluteURL: '/d/a.png', editedOn: t0 - 1000, fileSize: 100 },
  { foldername: 'sub', directory: 'd/sub', path: 'd/sub', absoluteURL: '/d/sub', editedOn: t0, fileSize: 0 }
];
const fakeApi = (): EurekaApi & { calls: string[] } => {
  const calls: string[] = [];
  return {
    calls,
    listSources: async () => { calls.push('sources'); return [{ id: 0, name: 'fs' }]; },
    listTree: async () => [{ name: 'd', cd: 'd', children: [] }],
    listDirectory: async (s, p) => { calls.push(`list ${s} ${p}`); return entries; },
    upload: async () => [...entries, { filename: 'up.png', directory: 'd', path: 'd/up.png', absoluteURL: '/d/up.png', editedOn: t0, fileSize: 5 }],
    createDirectory: async () => true,
    rename: async (_s, p, n) => entries.map((e) => (e.path === p ? { ...e, filename: n, path: `d/${n}` } : e)),
    remove: async (_s, p) => entries.filter((e) => e.path !== p),
    removeMany: async (_s, _cd, names) => entries.filter((e) => !names.includes(e.filename ?? '')),
    zipRequest: () => ({ url: '/zip', fields: [] })
  };
};
const base = { locale: 'en-US', headers: {}, timeZone: 'UTC' };

describe('engine', () => {
  it('lists, normalises, orders, then sorts and filters from memory', async () => {
    const api = fakeApi();
    const engine = createEngine({ apiFor: () => api });
    const r = await engine.handle({ ...base, id: '1', type: 'listDirectory', source: 0, path: '/d/' });
    expect(r.ok).toBe(true);
    const listing = (r as { result: { order: string[]; records: Record<string, unknown>; path: string } }).result;
    expect(listing.path).toBe('d');
    expect(listing.order).toEqual(['d/a.png', 'd/b.jpg']); // files only, name ascending
    expect(Object.keys(listing.records)).toHaveLength(3);
    const sorted = await engine.handle({ ...base, id: '2', type: 'sort', by: 'fileSize', dir: 'descending' });
    expect((sorted as { result: { order: string[] } }).result.order).toEqual(['d/b.jpg', 'd/a.png']);
    const filtered = await engine.handle({ ...base, id: '3', type: 'filter', text: '10x10' });
    expect((filtered as { result: { order: string[] } }).result.order).toEqual(['d/b.jpg']);
    expect(api.calls.filter((c) => c.startsWith('list'))).toHaveLength(1);
  });
  it('serves from cache when asked and reports it', async () => {
    const store = new Map<string, Entry[]>();
    const cache = { get: async (k: string) => store.get(k), set: async (k: string, v: Entry[]) => void store.set(k, v) };
    const api = fakeApi();
    const engine = createEngine({ apiFor: () => api, cache });
    await engine.handle({ ...base, id: '1', type: 'listDirectory', source: 0, path: 'd' });
    const again = await engine.handle({ ...base, id: '2', type: 'listDirectory', source: 0, path: 'd', preferCache: true });
    expect(again).toMatchObject({ ok: true, fromCache: true });
    expect(api.calls.filter((c) => c.startsWith('list'))).toHaveLength(1);
  });
  it('mutations refresh the listing and errors become responses', async () => {
    const engine = createEngine({ apiFor: () => ({ ...fakeApi(), listDirectory: async () => { throw new ApiError('nope', 500, '/x'); } }) });
    const bad = await engine.handle({ ...base, id: '1', type: 'listDirectory', source: 0, path: 'd' });
    expect(bad).toEqual({ id: '1', ok: false, error: { message: 'nope', status: 500 } });
    const engine2 = createEngine({ apiFor: () => fakeApi() });
    await engine2.handle({ ...base, id: '1', type: 'listDirectory', source: 0, path: 'd' });
    const renamed = await engine2.handle({ ...base, id: '2', type: 'rename', source: 0, path: 'd/a.png', name: 'z.png' });
    expect((renamed as { result: { order: string[] } }).result.order).toEqual(['d/b.jpg', 'd/z.png']);
    const deleted = await engine2.handle({ ...base, id: '3', type: 'delete', source: 0, paths: ['d/b.jpg'] });
    expect((deleted as { result: { order: string[] } }).result.order).toEqual(['d/a.png']);
  });
  it('inline client has the same surface as the worker client', async () => {
    const client = createEngineClient({ locale: 'en-US', apiFor: () => fakeApi(), workerUrl: null });
    expect(client.mode).toBe('inline');
    const { result } = await client.request({ type: 'listSources' });
    expect(result).toEqual([{ id: 0, name: 'fs' }]);
    await expect(client.request({ type: 'decodeThumbnail', url: 'x', width: 10 })).rejects.toThrow();
  });
});

describe('rest client', () => {
  it('builds v2-compatible URLs and bodies', async () => {
    const seen: Array<{ url: string; init: RequestInit }> = [];
    const f = (async (url: string, init: RequestInit) => { seen.push({ url, init }); return new Response(JSON.stringify([]), { status: 200 }); }) as unknown as typeof fetch;
    const api = createRestApi({ basePath: '/assets/components/eureka/', headers: { 'X-Test': '1' }, fetch: f });
    await api.listSources();
    await api.listDirectory(0, '/assets/img/');
    await api.rename(0, 'assets/img/a b.jpg', 'c.jpg');
    await api.remove('cloud', 'x');
    await api.removeMany(0, 'assets/img', ['a.jpg', 'b.jpg']);
    expect(seen.map((s) => s.url)).toEqual([
      '/assets/components/eureka/media/sources/',
      '/assets/components/eureka/media/sources/0?path=assets%2Fimg',
      '/assets/components/eureka/media/sources/0?path=assets%2Fimg%2Fa+b.jpg&name=c.jpg',
      '/assets/components/eureka/media/sources/cloud?path=x',
      '/assets/components/eureka/media/sources/0'
    ]);
    expect(seen[0]!.init.headers).toMatchObject({ 'X-Test': '1' });
    expect(seen[4]!.init.method).toBe('DELETE');
    expect((seen[4]!.init.body as FormData).getAll('delete_file[]')).toEqual(['a.jpg', 'b.jpg']);
    expect(api.zipRequest(0, 'assets', ['a.jpg']).fields).toEqual([['cd', 'assets'], ['cs', '0'], ['zip_file[]', 'a.jpg']]);
  });
  it('turns HTTP errors and v2-style {error} bodies into ApiError', async () => {
    const f = (async (url: string) => (url.includes('boom') ? new Response('{"error":"Missing path"}', { status: 200 }) : new Response('nope', { status: 500 }))) as unknown as typeof fetch;
    const api = createRestApi({ fetch: f });
    await expect(api.listDirectory(0, 'boom')).rejects.toMatchObject({ name: 'ApiError', message: 'Missing path' });
    await expect(api.listSources()).rejects.toMatchObject({ status: 500 });
  });
});
