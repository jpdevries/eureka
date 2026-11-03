// Sorting and filtering of listings (07 STATE-10, 09 I18N-22/23).
import { toDate } from './format.js';
import { isFile, isFolder, type DisplayRecord, type Entry, type FileEntry, type FolderEntry, type Sort } from './types.js';

const collators = new Map<string, Intl.Collator>();
function collator(locale: string): Intl.Collator {
  let c = collators.get(locale);
  if (!c) { c = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' }); collators.set(locale, c); }
  return c;
}

const area = (e: Entry) => (e.dimensions ? e.dimensions[0] * e.dimensions[1] : Number.NaN);

/** Compare two entries for `sort`. Unknown values (no dimensions, invalid dates) sort last in either direction. */
export function compareEntries(a: Entry, b: Entry, sort: Sort, locale: string): number {
  let n: number;
  switch (sort.by) {
    case 'dimensions': {
      const x = area(a), y = area(b);
      if (Number.isNaN(x) && Number.isNaN(y)) n = 0; else if (Number.isNaN(x)) return 1; else if (Number.isNaN(y)) return -1; else n = x - y;
      break;
    }
    case 'editedOn': n = toDate(a.editedOn).getTime() - toDate(b.editedOn).getTime(); break;
    case 'fileSize': n = a.fileSize - b.fileSize; break;
    default: n = collator(locale).compare(a.filename ?? a.foldername ?? '', b.filename ?? b.foldername ?? '');
  }
  if (sort.dir === 'descending') n = -n;
  if (n === 0 && sort.by !== 'filename') n = collator(locale).compare(a.filename ?? '', b.filename ?? ''); // tie-break by name, never reversed
  return n;
}

export function sortEntries<T extends Entry>(entries: readonly T[], sort: Sort, locale: string): T[] {
  return [...entries].sort((a, b) => compareEntries(a, b, sort, locale));
}

/** Case-insensitive substring match against the display record's haystack, or the raw name when no record exists. */
export function matchesFilter(entry: Entry, text: string, record?: DisplayRecord): boolean {
  const q = text.trim().toLowerCase();
  if (!q) return true;
  const hay = record?.haystack ?? (entry.filename ?? entry.foldername ?? '').toLowerCase();
  return hay.includes(q) || hay.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
}

export function filterEntries<T extends Entry>(entries: readonly T[], text: string, records: Readonly<Record<string, DisplayRecord>> = {}): T[] {
  if (!text.trim()) return [...entries];
  return entries.filter((e) => matchesFilter(e, text, records[e.path]));
}

/** Folders, filtered by name and sorted by name in the sort's direction: the items above the files (02 HTML-62). */
export function visibleFolders(entries: readonly Entry[], view: { filter: string; sort: Sort }, locale: string, records: Readonly<Record<string, DisplayRecord>> = {}): FolderEntry[] {
  const folders = entries.filter(isFolder);
  return sortEntries(filterEntries(folders, view.filter, records), { by: 'filename', dir: view.sort.dir }, locale);
}

/** Files only, filtered then sorted: what the listing shows (07 STATE-10). */
export function visibleFiles(entries: readonly Entry[], view: { filter: string; sort: Sort }, locale: string, records: Readonly<Record<string, DisplayRecord>> = {}): FileEntry[] {
  const files = entries.filter(isFile);
  return sortEntries(filterEntries(files, view.filter, records), view.sort, locale);
}
