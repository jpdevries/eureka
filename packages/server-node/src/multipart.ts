// Minimal multipart/form-data parser for buffered request bodies (uploads are
// bounded by `maxBytes`). Good enough for a reference server; swap for a
// streaming parser if you need multi-gigabyte uploads.
import type { IncomingMessage } from 'node:http';

export interface MultipartFile { field: string; filename: string; contentType: string; data: Buffer }
export interface Multipart { fields: Record<string, string[]>; files: MultipartFile[] }

export async function readBody(req: IncomingMessage, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of req) {
    const b = chunk as Buffer; size += b.length;
    if (size > maxBytes) throw Object.assign(new Error(`body exceeds ${maxBytes} bytes`), { status: 413 });
    chunks.push(b);
  }
  return Buffer.concat(chunks);
}

export function parseMultipart(buf: Buffer, contentType: string | undefined): Multipart {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType ?? '');
  const out: Multipart = { fields: {}, files: [] };
  if (!m) return out;
  const boundary = Buffer.from(`--${(m[1] ?? m[2] ?? '').trim()}`);
  let start = buf.indexOf(boundary);
  if (start < 0) return out;
  start += boundary.length;
  while (start < buf.length) {
    if (buf.subarray(start, start + 2).toString() === '--') break;
    const end = buf.indexOf(boundary, start);
    if (end < 0) break;
    const part = buf.subarray(start + 2, end - 2);
    const sep = part.indexOf('\r\n\r\n');
    if (sep >= 0) {
      const head = part.subarray(0, sep).toString('utf8');
      const body = part.subarray(sep + 4);
      const name = /name="([^"]*)"/i.exec(head)?.[1] ?? '';
      const filename = /filename="([^"]*)"/i.exec(head)?.[1];
      const ct = /content-type:\s*([^\r\n]+)/i.exec(head)?.[1]?.trim() ?? 'application/octet-stream';
      if (filename !== undefined) { if (filename) out.files.push({ field: name, filename: sanitizeFilename(filename), contentType: ct, data: Buffer.from(body) }); }
      else (out.fields[name] ??= []).push(body.toString('utf8'));
    }
    start = end + boundary.length;
  }
  return out;
}

/** Strip directory components and control characters from a client-supplied filename. */
export function sanitizeFilename(name: string): string {
  const base = name.replace(/\\/g, '/').split('/').pop() ?? '';
  const clean = base.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return clean === '' || clean === '.' || clean === '..' ? 'unnamed' : clean;
}

export const first = (v: string[] | undefined): string | undefined => v?.[0];
