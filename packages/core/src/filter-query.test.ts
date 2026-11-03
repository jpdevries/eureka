import { describe, it, expect } from 'vitest';
import { parseFilter, compileFilter, parseSize, parseDatePeriod, parsePixels, parseRatio } from './filter-query.js';
import { filterExamples } from './filter-examples.js';
import type { Entry } from './types.js';

const file = (filename: string, extra: Partial<Entry> = {}): Entry => ({ filename, directory: '/', path: filename, absoluteURL: '/' + filename, editedOn: Date.UTC(2026, 10, 2), fileSize: 1000, ...extra });
const E: Entry[] = [
  file('big-wide.jpg', { fileSize: 12 * 1024 ** 2, dimensions: [6000, 4000], editedOn: Date.UTC(2026, 10, 2), createdOn: Date.UTC(2013, 5, 20) }),
  file('tall.png', { fileSize: 300 * 1024, dimensions: [1080, 1920], editedOn: Date.UTC(2025, 2, 1), location: { lat: 37.7749, lng: -122.4194 } }),
  file('square.gif', { fileSize: 50 * 1024, dimensions: [500, 500], animated: true, editedOn: Date.UTC(2026, 0, 15) }),
  file('clip.mp4', { fileSize: 40 * 1024 ** 2, editedOn: Date.UTC(2026, 9, 31) }),
  file('notes.txt', { fileSize: 90, editedOn: Date.UTC(2024, 11, 31) }),
  { foldername: 'sub', directory: 'sub', path: 'sub', absoluteURL: '/sub', editedOn: 0, fileSize: 0 }
];
const names = (text: string, ctx = {}) => E.filter((e) => compileFilter(text, ctx).test(e)).map((e) => e.filename ?? e.foldername);

describe('filter query grammar (07 STATE-10a)', () => {
  it('tokenizes words, qualifiers, comparisons, ranges, negation and quotes', () => {
    expect(parseFilter('turtle type:image size:>10mb modified:2026-01..2026-03 -is:animated name:"Wide Banner"')).toEqual([
      { kind: 'text', value: 'turtle', negate: false },
      { kind: 'qualifier', key: 'type', op: 'eq', value: 'image', negate: false, raw: 'type:image' },
      { kind: 'qualifier', key: 'size', op: '>', value: '10mb', negate: false, raw: 'size:>10mb' },
      { kind: 'qualifier', key: 'modified', op: 'range', value: '2026-01', to: '2026-03', negate: false, raw: 'modified:2026-01..2026-03' },
      { kind: 'qualifier', key: 'is', op: 'eq', value: 'animated', negate: true, raw: '-is:animated' },
      { kind: 'qualifier', key: 'name', op: 'eq', value: 'Wide Banner', negate: false, raw: 'name:Wide Banner' }
    ]);
    expect(parseFilter('-')).toEqual([{ kind: 'text', value: '-', negate: false }]);
  });
  it('parses sizes, date periods, pixel names and ratios', () => {
    expect(parseSize('10mb')).toBe(10 * 1024 ** 2); expect(parseSize('500 KB')).toBe(500 * 1024); expect(parseSize('1.5gb')).toBe(1.5 * 1024 ** 3); expect(parseSize('2048')).toBe(2048); expect(parseSize('10 bananas')).toBeNull();
    expect(parseDatePeriod('2026')).toEqual({ start: Date.UTC(2026, 0, 1), end: Date.UTC(2027, 0, 1) });
    expect(parseDatePeriod('2026-02')).toEqual({ start: Date.UTC(2026, 1, 1), end: Date.UTC(2026, 2, 1) });
    expect(parseDatePeriod('2026-11-02')).toEqual({ start: Date.UTC(2026, 10, 2), end: Date.UTC(2026, 10, 3) });
    expect(parseDatePeriod('2026-13')).toBeNull(); expect(parseDatePeriod('yesterday')).toBeNull();
    expect(parsePixels('4k')).toBe(3840); expect(parsePixels('1080p')).toBe(1920); expect(parsePixels('720p')).toBe(1280); expect(parsePixels('3000')).toBe(3000); expect(parsePixels('8k')).toBeNull(); expect(parsePixels('480p')).toBeNull();
    expect(parseRatio('16:9')).toBeCloseTo(16 / 9); expect(parseRatio('1.5')).toBe(1.5); expect(parseRatio('0')).toBeNull();
  });
  it('type, ext and is: qualifiers', () => {
    expect(names('type:image')).toEqual(['big-wide.jpg', 'tall.png', 'square.gif']);
    expect(names('-type:image')).toEqual(['clip.mp4', 'notes.txt', 'sub']);
    expect(names('ext:PNG')).toEqual(['tall.png']); expect(names('ext:.gif')).toEqual(['square.gif']);
    expect(names('is:animated')).toEqual(['square.gif']); expect(names('is:folder')).toEqual(['sub']);
    expect(names('is:chosen', { chosen: new Set(['clip.mp4']) })).toEqual(['clip.mp4']); expect(names('is:chosen')).toEqual([]);
    expect(names('is:gif')).toEqual([]); // not a state: degrades to the text "is:gif", which nothing contains
  });
  it('size and date comparisons and ranges', () => {
    expect(names('size:>10mb')).toEqual(['big-wide.jpg', 'clip.mp4']); expect(names('size:<500kb')).toEqual(['tall.png', 'square.gif', 'notes.txt']);
    expect(names('size:1mb..20mb')).toEqual(['big-wide.jpg']); expect(names('size:<=90')).toEqual(['notes.txt']);
    expect(names('modified:>2026-01')).toEqual(['big-wide.jpg', 'clip.mp4']); // after January, not during it
    expect(names('modified:>=2026-01')).toEqual(['big-wide.jpg', 'square.gif', 'clip.mp4']);
    expect(names('modified:2026')).toEqual(['big-wide.jpg', 'square.gif', 'clip.mp4']); expect(names('modified:2026-11-02')).toEqual(['big-wide.jpg']);
    expect(names('modified:<2025')).toEqual(['notes.txt']); expect(names('modified:2025..2026-01')).toEqual(['tall.png', 'square.gif']);
    expect(names('created:2013')).toEqual(['big-wide.jpg']); expect(names('created:>2000')).toEqual(['big-wide.jpg']); // entries without createdOn never match
  });
  it('pixel qualifiers from dimensions; entries without dimensions never match', () => {
    expect(names('width:>2000')).toEqual(['big-wide.jpg']); expect(names('height:<=1080')).toEqual(['square.gif']);
    expect(names('px:6000x4000')).toEqual(['big-wide.jpg']); expect(names('px:>=1000x1000')).toEqual(['big-wide.jpg', 'tall.png']);
    expect(names('min:4k')).toEqual(['big-wide.jpg']); expect(names('min:1080p')).toEqual(['big-wide.jpg', 'tall.png']); expect(names('min:8k')).toEqual([]); // refused suffix → text
    expect(names('orientation:landscape')).toEqual(['big-wide.jpg']); expect(names('orientation:portrait')).toEqual(['tall.png']); expect(names('orientation:square')).toEqual(['square.gif']);
    expect(names('ratio:3:2')).toEqual(['big-wide.jpg']); expect(names('ratio:>1.4')).toEqual(['big-wide.jpg']); expect(names('ratio:9:16')).toEqual(['tall.png']);
  });
  it('location qualifiers only when the source offers location; otherwise plain text', () => {
    expect(names('has:location', { location: true })).toEqual(['tall.png']);
    expect(names('near:37.78,-122.41,25km', { location: true })).toEqual(['tall.png']); expect(names('near:37.78,-122.41,10mi', { location: true })).toEqual(['tall.png']);
    expect(names('near:40.7,-74,25km', { location: true })).toEqual([]);
    expect(names('within:37,-123,38,-122', { location: true })).toEqual(['tall.png']);
    expect(compileFilter('near:37.78,-122.41,25km').structured).toBe(false); // off: text, which matches nothing here
    expect(names('-has:location', { location: true })).toEqual(['big-wide.jpg', 'square.gif', 'clip.mp4', 'notes.txt', 'sub']);
  });
  it('plain words all match, unknown qualifiers degrade to text, and a plain query stays unstructured', () => {
    expect(compileFilter('wide').structured).toBe(false); expect(compileFilter('name:wide').structured).toBe(false);
    expect(names('type:image wide')).toEqual(['big-wide.jpg']); expect(names('type:image -wide')).toEqual(['tall.png', 'square.gif']);
    expect(names('size:>1mb bogus:thing')).toEqual([]); // "bogus:thing" is a word nothing contains
  });
  it('offers examples only for what the listing can match', () => {
    const ex = filterExamples(E);
    expect(ex).toContain('type:image'); expect(ex).toContain('size:>1mb'); expect(ex).toContain('width:>2000'); expect(ex).toContain('is:animated'); expect(ex).toContain('-type:image');
    expect(ex.some((x) => x.startsWith('created:'))).toBe(true); expect(ex.some((x) => x.startsWith('near:'))).toBe(false);
    expect(filterExamples(E, { location: true })).toContain('has:location');
    const plain = filterExamples([file('a.txt'), file('b.txt')]);
    expect(plain.some((x) => x.startsWith('width:') || x.startsWith('created:') || x.startsWith('-type:'))).toBe(false);
  });
});
