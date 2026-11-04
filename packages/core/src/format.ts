// Display formatting (09 I18N-20..22, 02 HTML-64/66/69). Pure functions over Intl.
import { extname } from './paths.js';
import { isTextLike } from './thumbs/kinds.js';
import type { DisplayRecord, Entry, MediaKind } from './types.js';

export type Translate = (id: string, values?: Record<string, unknown>) => string;

const IMAGE = new Set(['.jpg', '.jpeg', '.gif', '.png', '.png8', '.png24', '.svg', '.bmp', '.tiff', '.tif', '.webp', '.avif', '.heic', '.heif', '.jxl', '.jp2', '.j2k', '.jpx', '.j2c']); // HEIC, JPEG XL and JPEG 2000 are images the server measures and may render; no browser shows them (11 MS-76)
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.tiff', '.tif']);
const BROWSER_IMAGE = new Set(['.jpg', '.jpeg', '.gif', '.png', '.png8', '.png24', '.svg', '.bmp', '.webp', '.avif']);
const VIDEO = new Set(['.mp4', '.mov', '.webm', '.wbm', '.ogv', '.m4v']);
const AUDIO = new Set(['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac']);

export function mediaKind(nameOrUrl: string): MediaKind {
  const ext = extname(nameOrUrl);
  if (IMAGE.has(ext)) return 'image';
  if (VIDEO.has(ext)) return 'video';
  if (AUDIO.has(ext)) return 'audio';
  if (ext === '.pdf') return 'pdf';
  if (isTextLike(nameOrUrl)) return 'text';
  return 'other';
}
/** Raster images are the ones the crop tool accepts (02 HTML-68). */
export function isCroppable(nameOrUrl: string): boolean { return RASTER.has(extname(nameOrUrl)); }
/** Can a browser decode this image itself? TIFF is an image for listing and cropping (the server reads it) but never an <img> source (02 HTML-66e). */
export function browserDecodes(nameOrUrl: string): boolean { return BROWSER_IMAGE.has(extname(nameOrUrl)); }

/** Icon name in the sprite, by extension (v2 utility.getIconByExtension, extended). */
export function iconForExtension(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg': case '.jpeg': case '.gif': case '.png': case '.png8': case '.png24': case '.svg': case '.bmp': case '.tiff': case '.tif': case '.webp': case '.avif': case '.heic': case '.heif': case '.jxl': case '.jp2': case '.j2k': case '.jpx': case '.j2c': return 'file-image-o';
    case '.pdf': return 'file-pdf-o';
    case '.zip': case '.tar': case '.gz': case '.7z': case '.rar': return 'file-archive-o';
    case '.ppt': case '.pot': case '.pps': case '.pptx': return 'file-powerpoint-o';
    case '.doc': case '.dot': case '.wbk': case '.docx': case '.docm': case '.dotx': case '.dotm': case '.docb': return 'file-word-o';
    case '.xls': case '.xlt': case '.xlm': case '.xlsx': case '.xlsm': case '.xltx': case '.xltm': case '.xlsb': case '.xla': case '.xlam': case '.xll': case '.xlw': case '.csv': return 'file-excel-o';
    case '.txt': case '.rtf': case '.md': return 'file-text-o';
    case '.js': case '.mjs': case '.ts': case '.json': case '.html': case '.htm': case '.css': case '.scss': case '.xml': case '.yaml': case '.yml': return 'file-code-o';
    case '.mp3': case '.wav': case '.ogg': case '.flac': case '.m4a': case '.aac': return 'file-audio-o';
    case '.webm': case '.wbm': case '.mp4': case '.mov': case '.ogv': case '.m4v': return 'file-video-o';
    default: return 'file-o';
  }
}

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
/**
 * File sizes as v2's `filesize` produced them: binary multiples (1024) with the
 * familiar KB/MB labels ("37 KB" for 37,888 bytes, "95.7 KB", "11.44 MB", "812 B"),
 * localised digits, non-breaking space before the unit (09 I18N-21).
 */
// Intl formatters are expensive to construct (hundreds of microseconds each); a 5,000-item
// directory needs 20,000 of them, so cache per locale/options (10 PERF-01).
const formatterCache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();
function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = 'n|' + locale + '|' + JSON.stringify(options);
  let f = formatterCache.get(key) as Intl.NumberFormat | undefined;
  if (!f) { f = new Intl.NumberFormat(locale, options); formatterCache.set(key, f); }
  return f;
}
function dateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = 'd|' + locale + '|' + JSON.stringify(options);
  let f = formatterCache.get(key) as Intl.DateTimeFormat | undefined;
  if (!f) { f = new Intl.DateTimeFormat(locale, options); formatterCache.set(key, f); }
  return f;
}

export function formatFileSize(bytes: number, locale: string, { round = 2 }: { round?: number } = {}): string {
  if (!Number.isFinite(bytes) || bytes < 0) bytes = 0;
  let value = bytes, unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) { value /= 1024; unit++; }
  const digits = unit === 0 ? 0 : round;
  const num = numberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
  return `${num} ${UNITS[unit]}`;
}

export function toDate(editedOn: number | string): Date {
  const d = typeof editedOn === 'number' ? new Date(editedOn) : new Date(editedOn);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

export interface DateFormats { short: string; long: string; verbose: string; iso: string }
/** The date renditions v2 precomputed per item, via Intl (09 I18N-20). */
export function formatDates(editedOn: number | string, locale: string, timeZone?: string): DateFormats {
  const d = toDate(editedOn);
  const tz = timeZone ? { timeZone } : {};
  return {
    short: dateFormat(locale, { year: '2-digit', month: '2-digit', day: '2-digit', ...tz }).format(d),
    long: dateFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long', ...tz }).format(d),
    verbose: dateFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', ...tz }).format(d),
    iso: d.toISOString()
  };
}

export const dimensionsText = (e: Entry): string => (e.dimensions ? `${e.dimensions[0]}x${e.dimensions[1]}` : '');

/** English fallback for the two description messages, used when no translator is supplied. */
export const englishTranslate: Translate = (id, v = {}) => {
  switch (id) {
    case 'item.description': return `${v.filename} displays at ${v.width}x${v.height}, weighs ${v.size}, and was edited on ${v.date}`;
    case 'item.descriptionNoDimensions': return `${v.filename} weighs ${v.size}, and was edited on ${v.date}`;
    case 'item.pages': return `${v.n} ${v.n === 1 ? 'page' : 'pages'}`;
    case 'item.descriptionPages': return `${v.description}, ${v.pages}`;
    default: return id;
  }
};

export interface RecordOptions { locale: string; timeZone?: string; t?: Translate }

/** Build the per-item display record (07 STATE-12). Deterministic for (entry, locale, timeZone). */
export function buildDisplayRecord(entry: Entry, { locale, timeZone, t = englishTranslate }: RecordOptions): DisplayRecord {
  const name = entry.filename ?? entry.foldername ?? '';
  const ext = extname(entry.filename ?? entry.absoluteURL ?? '');
  const dates = formatDates(entry.editedOn, locale, timeZone);
  const sizeText = formatFileSize(entry.fileSize, locale);
  const sizeRounded = formatFileSize(entry.fileSize, locale, { round: 0 });
  const dims = dimensionsText(entry);
  const pagesText = entry.pages && entry.pages > 1 ? t('item.pages', { n: entry.pages }) : ''; // a multi-page original (11 MS-76)
  const described = entry.dimensions
    ? t('item.description', { filename: name, width: entry.dimensions[0], height: entry.dimensions[1], size: sizeRounded, date: dates.long })
    : t('item.descriptionNoDimensions', { filename: name, size: sizeRounded, date: dates.long });
  const description = pagesText ? t('item.descriptionPages', { description: described, pages: pagesText }) : described;
  const haystack = [name, dims, pagesText, sizeText, sizeText.replace(/\s+/g, ''), sizeRounded, sizeRounded.replace(/\s+/g, ''), dates.short, dates.long, dates.verbose].join(' ').toLowerCase();
  return {
    path: entry.path,
    kind: entry.filename ? mediaKind(entry.filename) : 'other',
    icon: entry.filename ? iconForExtension(ext) : 'folder',
    sizeText, dimensionsText: dims, pagesText,
    dateShort: dates.short, dateLong: dates.long, dateVerbose: dates.verbose,
    description, haystack
  };
}
