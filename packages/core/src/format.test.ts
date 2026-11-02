import { describe, it, expect } from 'vitest';
import { formatFileSize, formatDates, mediaKind, iconForExtension, buildDisplayRecord, isCroppable } from './format.js';
import { sortEntries, filterEntries, visibleFiles } from './sort-filter.js';
import type { Entry } from './types.js';

const t0 = Date.UTC(2017, 3, 2, 14, 25);
const file = (filename: string, fileSize: number, dimensions?: [number, number], daysAgo = 0): Entry => ({
  filename, directory: 'assets/img', path: `assets/img/${filename}`, absoluteURL: `/s/${filename}`, editedOn: t0 - daysAgo * 86400000, dimensions, fileSize
});

describe('format', () => {
  it('formats sizes like v2', () => {
    expect(formatFileSize(37888, 'en-US', { round: 0 })).toBe('38 KB');
    expect(formatFileSize(98000, 'en-US')).toBe('98 KB');
    expect(formatFileSize(12000000, 'en-US')).toBe('12 MB');
    expect(formatFileSize(812, 'en-US')).toBe('812 B');
    expect(formatFileSize(1234567, 'de-DE')).toBe('1,23 MB');
  });
  it('formats dates in the requested time zone', () => {
    const d = formatDates(t0, 'en-US', 'UTC');
    expect(d.short).toBe('04/02/17');
    expect(d.long).toMatch(/^Sunday, April 02, 2017/);
    expect(d.iso).toBe('2017-04-02T14:25:00.000Z');
  });
  it('classifies media', () => {
    expect(mediaKind('a.JPG')).toBe('image');
    expect(mediaKind('clip.mp4')).toBe('video');
    expect(mediaKind('x.pdf')).toBe('pdf');
    expect(mediaKind('archive.zip')).toBe('other');
    expect(iconForExtension('.zip')).toBe('file-archive-o');
    expect(isCroppable('logo.svg')).toBe(false);
    expect(isCroppable('photo.png')).toBe(true);
  });
  it('builds the display record and description (HTML-64)', () => {
    const r = buildDisplayRecord(file('schildpad.jpg', 37888, [336, 125]), { locale: 'en-US', timeZone: 'UTC' });
    expect(r.description).toBe('schildpad.jpg displays at 336x125, weighs 38 KB, and was edited on Sunday, April 02, 2017 at Coordinated Universal Time');
    expect(r.haystack).toContain('336x125');
    expect(r.haystack).toContain('38 kb'.replace(' ', ' '));
    const z = buildDisplayRecord(file('archive.zip', 12000000), { locale: 'en-US', timeZone: 'UTC' });
    expect(z.description).toMatch(/^archive\.zip weighs 12 MB, and was edited on/);
    expect(z.icon).toBe('file-archive-o');
  });
});

describe('sort and filter', () => {
  const entries = [file('file10.png', 10, [10, 10]), file('File2.png', 2000, [20, 20], 5), file('notes.txt', 90), file('a.jpg', 500, [100, 5], 1)];
  it('sorts names numerically and case-insensitively', () => {
    expect(sortEntries(entries, { by: 'filename', dir: 'ascending' }, 'en').map((e) => e.filename)).toEqual(['a.jpg', 'File2.png', 'file10.png', 'notes.txt']);
  });
  it('sorts by size, date and area with unknowns last', () => {
    expect(sortEntries(entries, { by: 'fileSize', dir: 'ascending' }, 'en').map((e) => e.filename)).toEqual(['file10.png', 'notes.txt', 'a.jpg', 'File2.png']);
    expect(sortEntries(entries, { by: 'fileSize', dir: 'descending' }, 'en')[0]!.filename).toBe('File2.png');
    expect(sortEntries(entries, { by: 'editedOn', dir: 'descending' }, 'en')[0]!.filename).toBe('file10.png');
    const byArea = sortEntries(entries, { by: 'dimensions', dir: 'ascending' }, 'en').map((e) => e.filename);
    expect(byArea).toEqual(['file10.png', 'File2.png', 'a.jpg', 'notes.txt']);
    expect(sortEntries(entries, { by: 'dimensions', dir: 'descending' }, 'en').at(-1)!.filename).toBe('notes.txt');
  });
  it('filters on the record haystack, ignoring spaces in sizes', () => {
    const records = Object.fromEntries(entries.map((e) => [e.path, buildDisplayRecord(e, { locale: 'en-US', timeZone: 'UTC' })]));
    expect(filterEntries(entries, 'png', records).length).toBe(2);
    expect(filterEntries(entries, '100x5', records).map((e) => e.filename)).toEqual(['a.jpg']);
    expect(filterEntries(entries, '2kb', records).map((e) => e.filename)).toEqual(['File2.png']);
    expect(filterEntries(entries, '', records).length).toBe(4);
  });
  it('visibleFiles drops folders and applies filter then sort', () => {
    const withFolder: Entry[] = [...entries, { foldername: 'sub', directory: 'assets/img/sub', path: 'assets/img/sub', absoluteURL: '/s/sub', editedOn: t0, fileSize: 4096 }];
    const v = visibleFiles(withFolder, { filter: '.png', sort: { by: 'filename', dir: 'descending' } }, 'en');
    expect(v.map((e) => e.filename)).toEqual(['file10.png', 'File2.png']);
  });
});
