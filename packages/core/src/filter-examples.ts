// What the filter can lend the placeholder before the parser has loaded (02 HTML-40a, 10 PERF-29): the context type and
// the example tokens worth showing for a listing. Small on purpose: this ships in the main bundle, the parser does not.
import { mediaKind, toDate } from './format.js';
import { extname } from './paths.js';
import { isFile, type Entry } from './types.js';

/** What the surrounding state lends the predicates. */
export interface FilterContext {
  /** Paths of the chosen items, for `is:chosen`. */
  chosen?: ReadonlySet<string>;
  /** The current source lists `capabilities.location`: `near:`, `within:` and `has:location` are live. */
  location?: boolean;
  /** Whether any entry carries `createdOn`; only affects which examples are offered, never matching. */
  created?: boolean;
}

/** Example tokens worth showing for a listing: only qualifiers that can match something in it (02 HTML-40a). */
export function filterExamples(entries: readonly Entry[], ctx: FilterContext = {}): string[] {
  const files = entries.filter(isFile);
  const kinds = new Set(files.map((f) => mediaKind(f.filename)));
  const out: string[] = [];
  const firstKind = ['image', 'video', 'pdf', 'audio', 'text'].find((k) => kinds.has(k as ReturnType<typeof mediaKind>));
  if (firstKind) out.push(`type:${firstKind}`);
  if (files.some((f) => f.fileSize > 1024 ** 2)) out.push('size:>1mb'); else if (files.length) out.push('size:<500kb');
  const dated = files.filter((f) => Number.isFinite(toDate(f.editedOn).getTime()));
  if (dated.length) { const newest = new Date(Math.max(...dated.map((f) => toDate(f.editedOn).getTime()))); out.push(`modified:>${newest.getUTCFullYear()}-${String(newest.getUTCMonth() + 1).padStart(2, '0')}`.replace(/-(\d{2})$/, (_, m) => `-${String(Math.max(1, Number(m) - 1)).padStart(2, '0')}`)); }
  if (files.some((f) => f.dimensions)) { out.push('width:>2000', 'orientation:landscape', 'min:1080p'); }
  if (files.some((f) => f.animated)) out.push('is:animated');
  if (ctx.created || files.some((f) => f.createdOn !== undefined)) out.push(`created:${new Date().getUTCFullYear()}`);
  if (ctx.location) out.push('has:location', 'near:37.77,-122.42,25km');
  if (firstKind && kinds.size > 1) out.push(`-type:${firstKind}`);
  if (files.length) { const ext = extname(files[0]!.filename).slice(1); if (ext) out.push(`ext:${ext}`); }
  return out;
}
