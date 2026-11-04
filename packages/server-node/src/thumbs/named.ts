// Adapters by name, for `--thumbnails sharp,magick` and EUREKA_THUMBNAILS: composed in the order given (11 MS-75, MS-77, MS-78).
import { createMagickThumbnailer } from './magick.js';
import { createSharpThumbnailer } from './sharp.js';
import { composeThumbnailers, type Thumbnailer } from './thumbnailer.js';

export const THUMBNAILER_NAMES = ['sharp', 'magick'] as const;
export type ThumbnailerName = (typeof THUMBNAILER_NAMES)[number];

/** `"sharp"`, `"magick"` or `"sharp,magick"` (also an array) into one adapter; an unknown name throws. */
export async function createNamedThumbnailer(spec: string | readonly string[]): Promise<Thumbnailer> {
  const names = (typeof spec === 'string' ? spec.split(',') : spec).map((n) => n.trim().toLowerCase()).filter(Boolean);
  if (!names.length) throw new Error('no thumbnailer named');
  const adapters = await Promise.all(names.map((n) => {
    if (n === 'sharp') return createSharpThumbnailer();
    if (n === 'magick') return createMagickThumbnailer();
    throw new Error(`unknown thumbnailer "${n}" (known: ${THUMBNAILER_NAMES.join(', ')})`);
  }));
  return composeThumbnailers(...adapters);
}
