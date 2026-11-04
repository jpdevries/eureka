// The reference thumbnail adapter (11 MS-75): sharp (libvips), an optional peer dependency the host installs.
import path from 'node:path';
import type { Thumbnailer } from './thumbnailer.js';

/** Every format sharp can be built to decode that the row benefits from. SVG and GIF are left out: a raster rendition would lose their animation (02 HTML-66b). */
export const SHARP_EXTENSIONS = ['.tif', '.tiff', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif', '.jp2', '.j2k', '.jpx', '.j2c', '.jxl'];

type SharpFormats = { [k: string]: { input?: { file?: boolean; fileSuffix?: string[] } } | undefined };

/**
 * What the installed build decodes, read from `sharp.format` (11 MS-75): the prebuilt binaries read TIFF, JPEG, PNG, WebP and AVIF;
 * HEIC/HEIF (HEVC), JPEG 2000 and JPEG XL need a libvips built with libde265, OpenJPEG or libjxl. Advertising a format the build
 * cannot decode would promise a rendition that fails, so those rows stay skeleton tiles (02 HTML-66e) until the host installs one.
 */
export function sharpDecodes(format: SharpFormats): string[] {
  const out = ['.tif', '.tiff', '.jpg', '.jpeg', '.png', '.webp'];
  const heif = format.heif?.input;
  if (heif?.file) { out.push('.avif'); if ((heif.fileSuffix ?? []).some((s) => /hei[cf]/i.test(s))) out.push('.heic', '.heif'); }
  if (format.jxl?.input?.file) out.push('.jxl');
  if (format.jp2?.input?.file) out.push('.jp2', '.j2k', '.jpx', '.j2c');
  return out;
}

export interface SharpThumbnailerOptions {
  /** Extensions to picture (default: what this build of sharp decodes, `sharpDecodes(sharp.format)`). */
  extensions?: string[];
  /** Encoder quality for JPEG and WebP (default 80). */
  quality?: number;
  /** Refuse originals above this many pixels (sharp's default is about 268 megapixels); `false` lifts the limit. */
  limitInputPixels?: number | false;
}

/** A thumbnailer over sharp. Rejects with a plain message when sharp is not installed. */
export async function createSharpThumbnailer(opts: SharpThumbnailerOptions = {}): Promise<Thumbnailer> {
  let sharp: typeof import('sharp').default;
  try { sharp = (await import('sharp')).default; } catch (err) { throw new Error('the sharp thumbnailer needs the optional dependency "sharp": npm install sharp', { cause: err }); }
  const exts = new Set((opts.extensions ?? sharpDecodes(sharp.format as unknown as SharpFormats)).map((e) => e.toLowerCase()));
  const quality = opts.quality ?? 80;
  return {
    extensions: [...exts],
    accepts: (filename) => exts.has(path.extname(filename).toLowerCase()),
    async render(file, jobs) {
      const base = sharp(file, { sequentialRead: true, ...(opts.limitInputPixels !== undefined ? { limitInputPixels: opts.limitInputPixels } : {}) }).rotate(); // EXIF orientation applied, first page of a multi-page file
      return Promise.all(jobs.map(async (j) => ({ ...j, data: await base.clone().resize({ width: j.width, height: j.width, fit: 'inside', withoutEnlargement: true }).toFormat(j.format, { quality }).toBuffer() })));
    }
  };
}
