// Image dimensions from the head of a file, with bounded extra reads where the header points elsewhere (11 MS-04, MS-74).
// image-size covers the formats whose size sits in the first bytes; TIFF keeps it in an IFD that writers may place at the
// end of the file, and a JPEG's SOF can follow large APP segments, so both get a parser that asks for more bytes by range.
import { imageSize } from 'image-size';

/** Bytes `start`..`end` inclusive of the file; may return fewer at the end of the file. */
export type RangeReader = (start: number, end: number) => Promise<Buffer>;

const MORE = 64 * 1024;
const MAX_EXTRA = 4 * 1024 * 1024;

/** Width and height from these bytes alone, or null when they are not enough (or not an image). */
export function dimensionsOf(buf: Buffer): [number, number] | null {
  try { const d = imageSize(buf); if (d.width && d.height) return [d.width, d.height]; } catch { /* not decodable from these bytes */ }
  return null;
}

/**
 * Width and height of the image whose first bytes are `head`, reading further ranges through `read` when the header
 * points past them (a TIFF IFD at the end of the file, a JPEG SOF after big metadata). Never reads more than 4 MB
 * extra; null when the format is unknown or the bytes run out.
 */
export async function readImageDimensions(head: Buffer, read?: RangeReader, size = Infinity): Promise<[number, number] | null> {
  const quick = dimensionsOf(head);
  if (quick) return quick;
  if (isTiff(head)) return tiffDimensions(head, read, size);
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return jpegDimensions(head, read, size);
  return null;
}

export function isTiff(b: Buffer): boolean {
  if (b.length < 8) return false;
  const le = b[0] === 0x49 && b[1] === 0x49, be = b[0] === 0x4d && b[1] === 0x4d;
  if (!le && !be) return false;
  const magic = le ? b.readUInt16LE(2) : b.readUInt16BE(2);
  return magic === 42 || magic === 43; // classic or BigTIFF
}

async function slice(head: Buffer, read: RangeReader | undefined, start: number, len: number, size: number): Promise<Buffer | null> {
  if (start + len <= head.length) return head.subarray(start, start + len);
  if (!read || start >= size || len > MAX_EXTRA) return null;
  try { const b = await read(start, Math.min(start + Math.max(len, MORE), size) - 1); return b.length >= len ? b.subarray(0, len) : null; } catch { return null; }
}

async function tiffDimensions(head: Buffer, read: RangeReader | undefined, size: number): Promise<[number, number] | null> {
  const le = head[0] === 0x49;
  const u16 = (b: Buffer, o: number) => (le ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const u32 = (b: Buffer, o: number) => (le ? b.readUInt32LE(o) : b.readUInt32BE(o));
  const u64 = (b: Buffer, o: number) => Number(le ? b.readBigUInt64LE(o) : b.readBigUInt64BE(o));
  const big = u16(head, 2) === 43;
  if (big && head.length < 16) return null;
  const ifd = big ? u64(head, 8) : u32(head, 4);
  const countSize = big ? 8 : 2, entrySize = big ? 20 : 12;
  const counted = await slice(head, read, ifd, countSize, size);
  if (!counted) return null;
  const count = big ? u64(counted, 0) : u16(counted, 0);
  if (!count || count > 4096) return null;
  const dir = await slice(head, read, ifd, countSize + count * entrySize, size);
  if (!dir) return null;
  let w = 0, h = 0;
  for (let i = 0; i < count; i++) {
    const o = countSize + i * entrySize;
    const tag = u16(dir, o);
    if (tag !== 256 && tag !== 257) continue;
    const type = u16(dir, o + 2), vo = big ? o + 12 : o + 8;
    const v = type === 3 ? u16(dir, vo) : type === 4 ? u32(dir, vo) : type === 16 ? u64(dir, vo) : 0;
    if (tag === 256) w = v; else h = v;
  }
  return w && h ? [w, h] : null;
}

async function jpegDimensions(head: Buffer, read: RangeReader | undefined, size: number): Promise<[number, number] | null> {
  let buf = head, o = 2;
  const ensure = async (n: number): Promise<boolean> => {
    if (o + n <= buf.length) return true;
    if (!read || buf.length >= size || buf.length - head.length >= MAX_EXTRA) return false;
    let more: Buffer;
    try { more = await read(buf.length, Math.min(buf.length + Math.max(n, MORE), size) - 1); } catch { return false; }
    if (!more.length) return false;
    buf = Buffer.concat([buf, more]);
    return o + n <= buf.length;
  };
  while (await ensure(4)) {
    if (buf[o] !== 0xff) { o++; continue; }
    const marker = buf[o + 1]!;
    if (marker === 0xff) { o++; continue; } // fill byte
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { o += 2; continue; } // standalone markers
    if (marker === 0xd9 || marker === 0xda) return null; // the image data began without a frame header
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) { // SOFn
      if (!(await ensure(9))) return null;
      const h = buf.readUInt16BE(o + 5), w = buf.readUInt16BE(o + 7);
      return w && h ? [w, h] : null;
    }
    o += 2 + buf.readUInt16BE(o + 2);
  }
  return null;
}
