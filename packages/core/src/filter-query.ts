// The filter bar's query syntax (07 STATE-10a): GitHub/Gmail-style qualifiers beside plain words. Nothing invented:
// Shipped as its own chunk (eureka-filter.js) that the element registers through filter-registry.ts when the filter is focused
// (10 PERF-29); the examples the placeholder shows live in filter-examples.ts so they need no chunk.
// `key:value` restricts one field, `>` `>=` `<` `<=` `=` and `a..b` compare or range, a leading `-` negates, quotes
// group a value with spaces, and an unknown or unavailable qualifier degrades to plain text, never an error.
import { extname } from './paths.js';
import { mediaKind } from './format.js';
import { toDate } from './format.js';
import { isFile, isFolder, type DisplayRecord, type Entry } from './types.js';
import type { FilterContext } from './filter-examples.js';
export type { FilterContext } from './filter-examples.js';

export type Op = '>' | '>=' | '<' | '<=' | '=' | 'range' | 'eq';
export type QueryToken =
  | { kind: 'text'; value: string; negate: boolean }
  | { kind: 'qualifier'; key: string; op: Op; value: string; to?: string; negate: boolean; raw: string };

export const QUALIFIERS = ['type', 'ext', 'is', 'has', 'size', 'modified', 'created', 'width', 'height', 'px', 'min', 'orientation', 'ratio', 'near', 'within'] as const;
const LOCATION_QUALIFIERS = new Set(['near', 'within']);

/** Split on whitespace outside quotes; `key:"a b"` stays one token. Quotes are removed from values. */
export function tokenize(text: string): string[] {
  const out: string[] = []; let cur = ''; let quote: string | null = null;
  for (const ch of text.trim()) {
    if (quote) { if (ch === quote) quote = null; else cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (/\s/.test(ch)) { if (cur) out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

export function parseFilter(text: string): QueryToken[] {
  return tokenize(text).map((raw): QueryToken => {
    const negate = raw.startsWith('-') && raw.length > 1;
    const body = negate ? raw.slice(1) : raw;
    const m = /^([a-z]+):(.*)$/i.exec(body);
    if (!m || !m[2]) return { kind: 'text', value: body, negate };
    const key = m[1]!.toLowerCase(); let value = m[2]!;
    let op: Op = 'eq';
    const cmp = /^(>=|<=|>|<|=)(.+)$/.exec(value);
    if (cmp) { op = cmp[1] as Op; value = cmp[2]!; }
    else { const range = /^([^.]+)\.\.([^.]+)$/.exec(value); if (range) return { kind: 'qualifier', key, op: 'range', value: range[1]!, to: range[2]!, negate, raw }; }
    return { kind: 'qualifier', key, op, value, negate, raw };
  });
}

// ---- value parsers --------------------------------------------------------------------------------------------------
const SIZE_UNITS: Record<string, number> = { b: 1, k: 1024, kb: 1024, m: 1024 ** 2, mb: 1024 ** 2, g: 1024 ** 3, gb: 1024 ** 3, t: 1024 ** 4, tb: 1024 ** 4 };
/** `10mb`, `500 kb`, `1.5GB`, `800b`, `2048`: binary multiples like the size column. */
export function parseSize(v: string): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*([a-z]*)$/i.exec(v.trim()); if (!m) return null;
  const unit = (m[2] || 'b').toLowerCase(); if (!(unit in SIZE_UNITS)) return null;
  return Number(m[1]) * SIZE_UNITS[unit]!;
}
/** An ISO date at year, month or day precision as a half-open interval [start, end) in ms, UTC. */
export function parseDatePeriod(v: string): { start: number; end: number } | null {
  const m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/.exec(v.trim()); if (!m) return null;
  const y = Number(m[1]), mo = m[2] ? Number(m[2]) : null, d = m[3] ? Number(m[3]) : null;
  if (mo !== null && (mo < 1 || mo > 12)) return null;
  if (d !== null && (d < 1 || d > 31)) return null;
  const start = Date.UTC(y, (mo ?? 1) - 1, d ?? 1);
  const end = d !== null ? Date.UTC(y, mo! - 1, d + 1) : mo !== null ? Date.UTC(y, mo, 1) : Date.UTC(y + 1, 0, 1);
  if (Number.isNaN(start)) return null;
  return { start, end };
}
const PX_NAMES: Record<string, number> = { '4k': 3840, '1080p': 1920, '720p': 1280 };
/** `3840`, `4k`, `1080p`, `720p` → a long-edge pixel count; any other `k` or `p` suffix is refused. */
export function parsePixels(v: string): number | null {
  const s = v.trim().toLowerCase();
  if (s in PX_NAMES) return PX_NAMES[s]!;
  return /^\d+$/.test(s) ? Number(s) : null;
}
/** `16:9`, `3:2`, `1.78`. */
export function parseRatio(v: string): number | null {
  const m = /^(\d+(?:\.\d+)?)(?::(\d+(?:\.\d+)?))?$/.exec(v.trim()); if (!m) return null;
  const r = m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
  return Number.isFinite(r) && r > 0 ? r : null;
}

/** Compare a number against the token's operator; `eq` is equality (with `tolerance`, relative). */
function compareNumber(n: number, op: Op, a: number, b?: number, tolerance = 0): boolean {
  switch (op) {
    case '>': return n > a; case '>=': return n >= a; case '<': return n < a; case '<=': return n <= a;
    case 'range': return n >= a && n <= (b ?? a);
    default: return tolerance ? Math.abs(n - a) <= Math.abs(a) * tolerance : n === a;
  }
}
/** A time against a period: `>` means after the period, `<` before it, `eq` within it, ranges span both periods. */
function compareDate(t: number, op: Op, a: { start: number; end: number }, b?: { start: number; end: number }): boolean {
  switch (op) {
    case '>': return t >= a.end; case '>=': return t >= a.start; case '<': return t < a.start; case '<=': return t < a.end;
    case 'range': return t >= a.start && t < (b ?? a).end;
    default: return t >= a.start && t < a.end;
  }
}
const EARTH_KM = 6371.0088;
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(a));
}

type Predicate = (e: Entry, record?: DisplayRecord) => boolean;
const dims = (e: Entry) => (e.dimensions && e.dimensions[0] > 0 && e.dimensions[1] > 0 ? e.dimensions : null);

/** The predicate for one qualifier token, or null when the qualifier is unknown or unavailable here (→ plain text). */
export function qualifierPredicate(t: Extract<QueryToken, { kind: 'qualifier' }>, ctx: FilterContext = {}): Predicate | null {
  const v = t.value.toLowerCase();
  switch (t.key) {
    case 'type': return ['image', 'video', 'audio', 'pdf', 'text', 'other'].includes(v) ? (e) => isFile(e) && mediaKind(e.filename) === v : null;
    case 'ext': return (e) => isFile(e) && extname(e.filename).slice(1) === v.replace(/^\./, '');
    case 'is':
      if (v === 'animated') return (e) => !!e.animated;
      if (v === 'folder') return (e) => isFolder(e);
      if (v === 'chosen') return (e) => !!ctx.chosen?.has(e.path);
      return null;
    case 'has': return v === 'location' && ctx.location ? (e) => !!e.location : null;
    case 'size': { const a = parseSize(t.value); if (a === null) return null; const b = t.to ? parseSize(t.to) : null; if (t.op === 'range' && b === null) return null; return (e) => isFile(e) && compareNumber(e.fileSize, t.op, a, b ?? undefined); }
    case 'modified': case 'created': {
      const a = parseDatePeriod(t.value); if (!a) return null; const b = t.to ? parseDatePeriod(t.to) : null; if (t.op === 'range' && !b) return null;
      const field = t.key === 'modified' ? 'editedOn' : 'createdOn';
      return (e) => { const raw = e[field]; if (raw === undefined || raw === null || raw === '') return false; const time = toDate(raw).getTime(); return Number.isFinite(time) && time > 0 && compareDate(time, t.op, a, b ?? undefined); };
    }
    case 'width': case 'height': { const a = parsePixels(t.value); if (a === null) return null; const b = t.to ? parsePixels(t.to) : null; if (t.op === 'range' && b === null) return null; const i = t.key === 'width' ? 0 : 1; return (e) => { const d = dims(e); return !!d && compareNumber(d[i]!, t.op, a, b ?? undefined); }; }
    case 'px': {
      const pair = (s: string) => { const m = /^(\d+)x(\d+)$/i.exec(s.trim()); return m ? [Number(m[1]), Number(m[2])] as const : null; };
      const a = pair(t.value); if (!a) return null; const b = t.to ? pair(t.to) : null; if (t.op === 'range' && !b) return null;
      return (e) => { const d = dims(e); return !!d && compareNumber(d[0], t.op, a[0], b?.[0]) && compareNumber(d[1], t.op, a[1], b?.[1]); };
    }
    case 'min': { const a = parsePixels(t.value); if (a === null || t.op !== 'eq') return null; return (e) => { const d = dims(e); return !!d && Math.max(d[0], d[1]) >= a; }; }
    case 'orientation': {
      if (!['landscape', 'portrait', 'square'].includes(v)) return null;
      return (e) => { const d = dims(e); if (!d) return false; const r = d[0] / d[1]; const square = Math.abs(r - 1) <= 0.02; return v === 'square' ? square : v === 'landscape' ? !square && r > 1 : !square && r < 1; };
    }
    case 'ratio': { const a = parseRatio(t.value); if (a === null) return null; const b = t.to ? parseRatio(t.to) : null; if (t.op === 'range' && b === null) return null; return (e) => { const d = dims(e); return !!d && compareNumber(d[0] / d[1], t.op, a, b ?? undefined, 0.02); }; }
    case 'near': {
      if (!ctx.location) return null;
      const m = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(km|mi)?$/i.exec(t.value); if (!m) return null;
      const lat = Number(m[1]), lng = Number(m[2]), km = Number(m[3]) * ((m[4] ?? 'km').toLowerCase() === 'mi' ? 1.609344 : 1);
      return (e) => !!e.location && haversineKm(lat, lng, e.location.lat, e.location.lng) <= km;
    }
    case 'within': {
      if (!ctx.location) return null;
      const n = t.value.split(',').map(Number); if (n.length !== 4 || n.some((x) => !Number.isFinite(x))) return null;
      const [south, west, north, east] = n as [number, number, number, number];
      return (e) => !!e.location && e.location.lat >= south && e.location.lat <= north && (west <= east ? e.location.lng >= west && e.location.lng <= east : e.location.lng >= west || e.location.lng <= east);
    }
    default: return null;
  }
}

/** Plain-word match against the haystack (what `matchesFilter` does for the whole string). */
export function textMatches(entry: Entry, word: string, record?: DisplayRecord): boolean {
  const q = word.toLowerCase();
  const hay = record?.haystack ?? (entry.filename ?? entry.foldername ?? '').toLowerCase();
  return hay.includes(q);
}

export type { CompiledFilter } from './filter-registry.js';
import type { CompiledFilter } from './filter-registry.js';

/** Compile a filter string. Plain text (no live qualifier) returns `structured: false` so callers keep the substring match. */
export function compileFilter(text: string, ctx: FilterContext = {}): CompiledFilter {
  const tokens = parseFilter(text);
  const parts: Array<{ negate: boolean; test: Predicate }> = [];
  let structured = false;
  for (const t of tokens) {
    if (t.kind === 'qualifier') {
      const p = qualifierPredicate(t, ctx);
      if (p) { structured = true; parts.push({ negate: t.negate, test: p }); continue; }
      parts.push({ negate: t.negate, test: (e, r) => textMatches(e, t.raw.replace(/^-/, ''), r) }); // unknown qualifier: plain text
    } else parts.push({ negate: t.negate, test: (e, r) => textMatches(e, t.value, r) });
  }
  return { structured, test: (e, r) => parts.every((p) => p.test(e, r) !== p.negate) };
}

