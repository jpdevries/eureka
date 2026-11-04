// An ImageMagick thumbnail adapter (11 MS-78): `magick` (ImageMagick 7) or `convert` (6) on PATH, for the formats the installed
// sharp cannot decode, HEIC first. Composed behind sharp with `composeThumbnailers(sharp, magick)` it only ever sees those.
import { execFile } from 'node:child_process';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import type { PreviewFormat, Thumbnailer } from './thumbnailer.js';

const run = promisify(execFile);

/** The ImageMagick coder for each extension; the input is always named `CODER:file[0]`, so a file is never sniffed as another coder (MVG, MSL, TEXT…). */
const CODER: Record<string, string> = { '.heic': 'HEIC', '.heif': 'HEIC', '.avif': 'AVIF', '.jxl': 'JXL', '.jp2': 'JP2', '.j2k': 'J2K', '.jpx': 'JP2', '.j2c': 'J2C', '.psd': 'PSD', '.psb': 'PSB', '.tif': 'TIFF', '.tiff': 'TIFF', '.jpg': 'JPEG', '.jpeg': 'JPEG', '.png': 'PNG', '.webp': 'WEBP' };
const OUTPUT: Record<PreviewFormat, string> = { jpeg: 'JPEG', webp: 'WEBP', png: 'PNG' };

/** The formats this adapter offers by default: what the prebuilt sharp leaves out. A host passes `extensions` for more. */
export const MAGICK_EXTENSIONS = ['.heic', '.heif', '.jxl', '.jp2', '.j2k', '.jpx', '.j2c'];

export interface MagickThumbnailerOptions {
  /** The executable (default: `magick`, else `convert`). */
  binary?: string;
  /** Extensions to picture (default `MAGICK_EXTENSIONS`), kept only where `-list format` says the coder reads. */
  extensions?: string[];
  /** Encoder quality for JPEG and WebP (default 80). */
  quality?: number;
  /** One render may take this long (default 120 s). */
  timeoutMs?: number;
}

async function findBinary(): Promise<string> {
  for (const bin of ['magick', 'convert']) { try { await run(bin, ['-version']); return bin; } catch { /* next */ } }
  throw new Error('the ImageMagick thumbnailer needs `magick` (ImageMagick 7) or `convert` on PATH');
}

/** Coders the installed ImageMagick can read, from `-list format` (a `*` marks a native blob coder; the mode column is r/w/+). */
export function readableCoders(listing: string): Set<string> {
  const out = new Set<string>();
  for (const line of listing.split('\n')) {
    const m = /^\s*([A-Z0-9-]+)\*?\s+[A-Z0-9-]+\s+([rw+-]{3})(\s|$)/.exec(line);
    if (m && m[2]!.includes('r')) out.add(m[1]!);
  }
  return out;
}

/** A thumbnailer over ImageMagick. Rejects with a plain message when no binary is found. */
export async function createMagickThumbnailer(opts: MagickThumbnailerOptions = {}): Promise<Thumbnailer> {
  const binary = opts.binary ?? await findBinary();
  const readable = readableCoders((await run(binary, ['-list', 'format'], { maxBuffer: 4 * 1024 * 1024 })).stdout);
  const exts = new Set((opts.extensions ?? MAGICK_EXTENSIONS).map((e) => e.toLowerCase()).filter((e) => readable.has(CODER[e] ?? e.slice(1).toUpperCase())));
  const quality = String(opts.quality ?? 80);
  const timeout = opts.timeoutMs ?? 120_000;
  return {
    extensions: [...exts],
    accepts: (filename) => exts.has(path.extname(filename).toLowerCase()),
    async render(file, jobs) {
      const ext = path.extname(file).toLowerCase();
      const coder = CODER[ext] ?? ext.slice(1).toUpperCase();
      const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'eureka-magick-'));
      try {
        // One decode: every rendition but the last is written from a clone, the last from the image itself.
        const outs = jobs.map((j, i) => path.join(dir, `${i}.${j.format}`));
        const args = [`${coder}:${file}[0]`, '-auto-orient', '-quality', quality];
        jobs.forEach((j, i) => {
          const resize = ['-resize', `${j.width}x${j.width}>`]; // bounds the long edge, never enlarges
          if (i < jobs.length - 1) args.push('(', '+clone', ...resize, '-write', `${OUTPUT[j.format]}:${outs[i]}`, '+delete', ')');
          else args.push(...resize, `${OUTPUT[j.format]}:${outs[i]}`);
        });
        await run(binary, args, { timeout, maxBuffer: 1024 * 1024 });
        return Promise.all(jobs.map(async (j, i) => ({ ...j, data: await fsp.readFile(outs[i]!) })));
      } finally {
        await fsp.rm(dir, { recursive: true, force: true }).catch(() => {});
      }
    }
  };
}
