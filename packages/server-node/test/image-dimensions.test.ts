import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { readImageDimensions, dimensionsOf, isTiff, isHeif, heifDimensions, readPageCount } from '../src/image-dimensions.js';

/** A TIFF whose only IFD carries ImageWidth/ImageLength and sits at `ifdOffset`, padded to `total` bytes. */
function tiff({ le = true, big = false, ifdOffset, w, h, total }: { le?: boolean; big?: boolean; ifdOffset: number; w: number; h: number; total: number }): Buffer {
  const b = Buffer.alloc(total);
  const u16 = (o: number, v: number) => (le ? b.writeUInt16LE(v, o) : b.writeUInt16BE(v, o));
  const u32 = (o: number, v: number) => (le ? b.writeUInt32LE(v, o) : b.writeUInt32BE(v, o));
  const u64 = (o: number, v: number) => (le ? b.writeBigUInt64LE(BigInt(v), o) : b.writeBigUInt64BE(BigInt(v), o));
  b.write(le ? 'II' : 'MM', 0, 'latin1');
  if (big) { u16(2, 43); u16(4, 8); u16(6, 0); u64(8, ifdOffset); } else { u16(2, 42); u32(4, ifdOffset); }
  let o = ifdOffset;
  if (big) { u64(o, 2); o += 8; } else { u16(o, 2); o += 2; }
  for (const [tag, v] of [[256, w], [257, h]] as const) {
    u16(o, tag); u16(o + 2, big ? 16 : 4);
    if (big) { u64(o + 4, 1); u64(o + 12, v); o += 20; } else { u32(o + 4, 1); u32(o + 8, v); o += 12; }
  }
  return b;
}
const reader = (full: Buffer, calls: Array<[number, number]> = []) => async (s: number, e: number) => { calls.push([s, e]); return full.subarray(s, Math.min(e + 1, full.length)); };
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

describe('image dimensions from file heads (11 MS-74)', () => {
  it('reads formats whose size is in the first bytes without any further read', async () => {
    expect(dimensionsOf(PNG)).toEqual([1, 1]);
    const calls: Array<[number, number]> = [];
    expect(await readImageDimensions(PNG.subarray(0, 33), reader(PNG, calls), PNG.length)).toEqual([1, 1]);
    expect(calls).toEqual([]);
  });
  it('follows a TIFF directory placed at the end of the file with one ranged read', async () => {
    const full = tiff({ ifdOffset: 180_000, w: 4000, h: 3000, total: 180_100 });
    expect(isTiff(full)).toBe(true);
    const calls: Array<[number, number]> = [];
    expect(await readImageDimensions(full.subarray(0, 65536), reader(full, calls), full.length)).toEqual([4000, 3000]);
    expect(calls.length).toBeGreaterThanOrEqual(1); expect(calls[0]![0]).toBe(180_000);
    expect(await readImageDimensions(full.subarray(0, 65536))).toBeNull(); // no reader: the head alone is not enough
  });
  it('reads big-endian and BigTIFF directories within the head', async () => {
    expect(await readImageDimensions(tiff({ le: false, ifdOffset: 8, w: 640, h: 480, total: 200 }))).toEqual([640, 480]);
    expect(await readImageDimensions(tiff({ big: true, ifdOffset: 16, w: 20000, h: 10000, total: 400 }))).toEqual([20000, 10000]);
  });
  it('walks a JPEG past large metadata to its frame header, fetching more as needed', async () => {
    const app1 = Buffer.alloc(65535 + 2); app1[0] = 0xff; app1[1] = 0xe1; app1.writeUInt16BE(65535, 2); // a 64 KB APP1 segment
    const sof = Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, 0x0b, 0xb8, 0x0f, 0xa0, 0x03]); // SOF0: height 3000, width 4000
    const full = Buffer.concat([Buffer.from([0xff, 0xd8]), app1, sof, Buffer.alloc(32)]);
    const calls: Array<[number, number]> = [];
    expect(await readImageDimensions(full.subarray(0, 4096), reader(full, calls), full.length)).toEqual([4000, 3000]);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(await readImageDimensions(full.subarray(0, 4096))).toBeNull();
  });
  it('is null for bytes that are not an image', async () => {
    expect(await readImageDimensions(Buffer.from('hello world, not an image at all'))).toBeNull();
  });
});

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url));
// A JPEG XL container (signature, ftyp, jxlc) whose codestream header says 64×48 in the small-size form.
const JXL = Buffer.from('0000000c4a584c200d0a870a00000014667479706a786c20000000006a786c200000000c6a786c63ff0a0b0e', 'hex');

describe('more heads (11 MS-76)', () => {
  it('reads a HEIC through its clean aperture, not the padded coded size image-size reports', async () => {
    const heic = fixture('photo.heic'); // 48×32 encoded by libheif: ispe says 64×64, clap crops it
    expect(isHeif(heic)).toBe(true);
    expect(dimensionsOf(heic)).toEqual([64, 64]);
    expect(heifDimensions(heic)).toEqual([48, 32]);
    expect(await readImageDimensions(heic)).toEqual([48, 32]);
    expect(heifDimensions(heic.subarray(0, 40))).toBeNull(); // meta not within the bytes
  });
  it('reads JPEG 2000 and JPEG XL heads from the first bytes', async () => {
    expect(await readImageDimensions(fixture('map.jp2'))).toEqual([36, 24]);
    expect(await readImageDimensions(JXL)).toEqual([64, 48]);
  });
  it('counts the directories of a multi-page TIFF with one ranged read per page', async () => {
    const pages = fixture('pages.tif'); // three 40×30 pages
    expect(await readImageDimensions(pages)).toEqual([40, 30]);
    expect(await readPageCount(pages)).toBe(3);
    const calls: Array<[number, number]> = [];
    expect(await readPageCount(pages.subarray(0, 16), reader(pages, calls), pages.length)).toBe(3);
    expect(calls.length).toBeGreaterThanOrEqual(3);
    expect(await readPageCount(tiff({ ifdOffset: 8, w: 2, h: 2, total: 64 }))).toBe(1);
    expect(await readPageCount(PNG)).toBe(1);
  });
});
