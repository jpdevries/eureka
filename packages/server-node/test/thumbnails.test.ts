import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createFilesystemSource, withThumbnails, sharpDecodes, type Thumbnailer, type RenderJob } from '../src/index.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const read = async (s: NodeJS.ReadableStream) => { const parts: Buffer[] = []; for await (const c of s) parts.push(c as Buffer); return Buffer.concat(parts); };

let root: string, cacheDir: string;
const renders: Array<{ file: string; size: number; jobs: RenderJob[] }> = [];
const fake: Thumbnailer = {
  accepts: (f) => /\.(tif|tiff|jpe?g)$/i.test(f),
  async render(file, jobs) { renders.push({ file, size: (await fs.stat(file)).size, jobs }); return jobs.map((j) => ({ ...j, data: Buffer.concat([PNG, Buffer.from(`${j.width}-${j.format}`)]) })); }
};

beforeAll(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'eureka-thumbs-src-'));
  cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'eureka-thumbs-cache-'));
  await fs.writeFile(path.join(root, 'scan.tif'), Buffer.alloc(9000, 1));
  await fs.writeFile(path.join(root, 'huge.tif'), Buffer.alloc(20000, 2));
  await fs.writeFile(path.join(root, 'tiny.jpg'), Buffer.alloc(100, 3));
  await fs.writeFile(path.join(root, 'pixel.png'), PNG);
  await fs.writeFile(path.join(root, 'notes.txt'), 'text');
});
afterAll(async () => { await fs.rm(root, { recursive: true, force: true }); await fs.rm(cacheDir, { recursive: true, force: true }); });

describe('server-rendered previews (11 MS-70..MS-73)', () => {
  it('advertises the preview route and renditions only for files the adapter accepts and no source pictures, within the size window', async () => {
    const src = withThumbnails(createFilesystemSource({ id: 0, name: 'fs', root }), { thumbnailer: fake, cacheDir, maxSourceBytes: 10000, minSourceBytes: 500 });
    const entries = await src.listDirectory('/');
    const by = Object.fromEntries(entries.map((e) => [e.filename, e]));
    expect(by['scan.tif']!.absolutePreviewURL).toBe('/sources/fs/__preview/scan.tif');
    expect(by['scan.tif']!.renditions).toEqual([
      { url: '/sources/fs/__preview/scan.tif?w=220&f=webp', width: 220, type: 'image/webp' }, { url: '/sources/fs/__preview/scan.tif?w=440&f=webp', width: 440, type: 'image/webp' }, { url: '/sources/fs/__preview/scan.tif?w=880&f=webp', width: 880, type: 'image/webp' },
      { url: '/sources/fs/__preview/scan.tif?w=220&f=jpeg', width: 220, type: 'image/jpeg' }, { url: '/sources/fs/__preview/scan.tif?w=440&f=jpeg', width: 440, type: 'image/jpeg' }, { url: '/sources/fs/__preview/scan.tif?w=880&f=jpeg', width: 880, type: 'image/jpeg' }
    ]);
    expect(by['huge.tif']!.absolutePreviewURL).toBe(by['huge.tif']!.absoluteURL); expect(by['huge.tif']!.renditions).toBeUndefined(); // over the ceiling
    expect(by['tiny.jpg']!.absolutePreviewURL).toBe(by['tiny.jpg']!.absoluteURL); // under the floor: previews as itself
    expect(by['pixel.png']!.renditions).toBeUndefined(); // the adapter does not take PNG
    expect(by['notes.txt']!.absolutePreviewURL).toContain('__thumb/'); // text keeps its SVG thumbnail
    expect(src.id).toBe(0); expect(src.name).toBe('fs');
  });
  it('renders every width and format from one fetch of the original, caches them on disk and answers 304 by ETag', async () => {
    renders.length = 0;
    const src = withThumbnails(createFilesystemSource({ id: 0, name: 'fs', root }), { thumbnailer: fake, cacheDir, maxSourceBytes: 10000 });
    const first = await src.preview!('scan.tif', { width: 300, format: 'webp' });
    expect(first && !first.notModified && first.contentType).toBe('image/webp');
    expect((await read((first as { stream: NodeJS.ReadableStream }).stream)).toString('latin1')).toContain('440-webp'); // 300 snaps up to the 440 rendition
    expect(renders).toHaveLength(1); expect(renders[0]!.size).toBe(9000); expect(renders[0]!.jobs).toHaveLength(6);
    const again = await src.preview!('scan.tif', { width: 880, format: 'jpeg' });
    expect(again && !again.notModified && again.contentType).toBe('image/jpeg');
    expect(renders).toHaveLength(1); // served from the cache, no second decode
    expect(await src.preview!('scan.tif', { width: 880, format: 'jpeg', ifNoneMatch: again!.etag })).toEqual({ etag: again!.etag, notModified: true });
    expect((await fs.readdir(cacheDir)).filter((f) => !f.startsWith('tmp-'))).toHaveLength(6);
    expect((await fs.readdir(cacheDir)).some((f) => f.startsWith('tmp-'))).toBe(false); // the original is not kept
  });
  it('is null for files it must not render, and the preview route falls back to the source\'s own picture first', async () => {
    renders.length = 0;
    const src = withThumbnails(createFilesystemSource({ id: 0, name: 'fs', root }), { thumbnailer: fake, cacheDir, maxSourceBytes: 10000 });
    expect(await src.preview!('huge.tif', { width: 220 })).toBeNull();
    expect(await src.preview!('pixel.png', { width: 220 })).toBeNull();
    expect(await src.preview!('missing.tif', { width: 220 })).toBeNull();
    expect(renders).toHaveLength(0);
  });
});

describe('the sharp adapter (11 MS-75)', () => {
  it('accepts only what the installed build decodes: prebuilt sharp reads AVIF but not HEIC, JPEG XL or JPEG 2000', () => {
    const prebuilt = { heif: { input: { file: true, fileSuffix: ['.avif'] } }, jxl: { input: { file: false } }, jp2: { input: { file: false } } };
    expect(sharpDecodes(prebuilt)).toEqual(['.tif', '.tiff', '.jpg', '.jpeg', '.png', '.webp', '.avif']);
    const full = { heif: { input: { file: true, fileSuffix: ['.avif', '.heic', '.heif'] } }, jxl: { input: { file: true } }, jp2: { input: { file: true } } };
    expect(sharpDecodes(full)).toEqual(expect.arrayContaining(['.heic', '.heif', '.jxl', '.jp2', '.j2k']));
    expect(sharpDecodes({})).toEqual(['.tif', '.tiff', '.jpg', '.jpeg', '.png', '.webp']);
  });
  it('renders a TIFF into WebP and JPEG renditions no wider than asked, from one decode', async () => {
    let sharp: typeof import('sharp').default;
    try { sharp = (await import('sharp')).default; } catch { return; } // optional: skip where sharp is not installed
    const { createSharpThumbnailer } = await import('../src/thumbs/sharp.js');
    const file = path.join(root, 'real.tif');
    await sharp({ create: { width: 1200, height: 600, channels: 3, background: { r: 200, g: 40, b: 40 } } }).tiff().toFile(file);
    const t = await createSharpThumbnailer();
    expect(t.accepts('x.TIF')).toBe(true); expect(t.accepts('x.svg')).toBe(false); expect(t.accepts('x.gif')).toBe(false);
    const out = await t.render(file, [{ width: 220, format: 'webp' }, { width: 880, format: 'jpeg' }, { width: 4000, format: 'jpeg' }]);
    const meta = await Promise.all(out.map((o) => sharp(o.data).metadata()));
    expect(meta.map((m) => [m.format, m.width, m.height])).toEqual([['webp', 220, 110], ['jpeg', 880, 440], ['jpeg', 1200, 600]]); // never enlarged
  });
});
