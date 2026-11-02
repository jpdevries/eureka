// Message catalog and a small ICU MessageFormat subset (09): {arg}, {n, plural, ...},
// {x, select, ...}, {n, number}, {d, date, short|medium|long}. Enough for the catalog.
import en from './data/messages.en.js';
import type { Translate } from './format.js';

export type Catalog = Readonly<Record<string, string>>;
export const englishCatalog: Catalog = en;

type Node = string | { arg: string; kind: 'simple' } | { arg: string; kind: 'number' } | { arg: string; kind: 'date'; style: string } | { arg: string; kind: 'plural' | 'selectordinal' | 'select'; offset: number; options: Record<string, Node[]> };

const cache = new Map<string, Node[]>();

export function parseMessage(src: string): Node[] {
  const hit = cache.get(src); if (hit) return hit;
  const [nodes] = parseNodes(src, 0, false);
  cache.set(src, nodes); return nodes;
}

function parseNodes(src: string, i: number, inOption: boolean): [Node[], number] {
  const out: Node[] = []; let text = '';
  while (i < src.length) {
    const ch = src[i]!;
    if (ch === "'" && src[i + 1] === '{') { text += '{'; i += 2; continue; } // escaped brace
    if (ch === '}' && inOption) { if (text) out.push(text); return [out, i + 1]; }
    if (ch === '#' && inOption) { if (text) { out.push(text); text = ''; } out.push({ arg: '#', kind: 'number' }); i++; continue; }
    if (ch === '{') {
      if (text) { out.push(text); text = ''; }
      const close = findBalanced(src, i);
      const inner = src.slice(i + 1, close);
      out.push(parseArgument(inner)); i = close + 1; continue;
    }
    text += ch; i++;
  }
  if (text) out.push(text);
  return [out, i];
}
function findBalanced(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) { if (src[i] === '{') depth++; else if (src[i] === '}') { depth--; if (depth === 0) return i; } }
  return src.length;
}
function parseArgument(inner: string): Node {
  const m = /^\s*([^,\s]+)\s*(?:,\s*(\w+)\s*(?:,\s*([\s\S]*))?)?$/.exec(inner);
  if (!m) return { arg: inner.trim(), kind: 'simple' };
  const [, arg, type, rest] = m;
  if (!type) return { arg: arg!, kind: 'simple' };
  if (type === 'number') return { arg: arg!, kind: 'number' };
  if (type === 'date' || type === 'time') return { arg: arg!, kind: 'date', style: (rest ?? 'medium').trim() };
  if (type === 'plural' || type === 'selectordinal' || type === 'select') {
    const options: Record<string, Node[]> = {}; let offset = 0; let i = 0; const s = rest ?? '';
    const off = /^\s*offset:(\d+)/.exec(s); if (off) { offset = Number(off[1]); i = off[0].length; }
    while (i < s.length) {
      const km = /^\s*([^\s{]+)\s*\{/.exec(s.slice(i));
      if (!km) break;
      const key = km[1]!; const start = i + km[0].length;
      const [nodes, next] = parseNodes(s, start, true);
      options[key] = nodes; i = next;
    }
    return { arg: arg!, kind: type, offset, options };
  }
  return { arg: arg!, kind: 'simple' };
}

export interface FormatOptions { locale: string; timeZone?: string }

export function formatMessage(src: string, values: Record<string, unknown> = {}, { locale, timeZone }: FormatOptions): string {
  const pr = new Map<string, Intl.PluralRules>();
  const rules = (type: 'cardinal' | 'ordinal') => { let r = pr.get(type); if (!r) { r = new Intl.PluralRules(locale, { type }); pr.set(type, r); } return r; };
  const render = (nodes: Node[], hash?: number): string => nodes.map((n) => {
    if (typeof n === 'string') return n;
    if (n.kind === 'number') { const v = n.arg === '#' ? hash : values[n.arg]; return typeof v === 'number' ? new Intl.NumberFormat(locale).format(v) : String(v ?? ''); }
    if (n.kind === 'date') { const v = values[n.arg]; const d = v instanceof Date ? v : new Date(v as string | number); const style = (['short', 'medium', 'long', 'full'].includes(n.style) ? n.style : 'medium') as 'short' | 'medium' | 'long' | 'full'; return new Intl.DateTimeFormat(locale, { dateStyle: style, ...(timeZone ? { timeZone } : {}) }).format(d); }
    if (n.kind === 'simple') { const v = values[n.arg]; return v === undefined || v === null ? '' : String(v); }
    const v = values[n.arg];
    let key: string;
    if (n.kind === 'select') key = String(v);
    else { const num = Number(v) - n.offset; key = n.options[`=${Number(v)}`] ? `=${Number(v)}` : rules(n.kind === 'plural' ? 'cardinal' : 'ordinal').select(num); }
    const chosen = n.options[key] ?? n.options.other ?? [];
    return render(chosen, n.kind === 'select' ? hash : Number(v) - n.offset);
  }).join('');
  return render(parseMessage(src));
}

export interface Translator extends Translate { locale: string; has(id: string): boolean }

/** Build a translator for `locale` over `catalog`, falling back to English per message (I18N-03). */
export function createTranslator(locale: string, catalog: Catalog = {}, options: { fallback?: Catalog; timeZone?: string } = {}): Translator {
  const fallback = options.fallback ?? englishCatalog;
  const t = ((id: string, values?: Record<string, unknown>) => {
    const src = catalog[id] ?? fallback[id];
    if (src === undefined) return id;
    try { return formatMessage(src, values, { locale, timeZone: options.timeZone }); } catch { return src; }
  }) as Translator;
  t.locale = locale;
  t.has = (id) => id in catalog || id in fallback;
  return t;
}

/** Locale resolution (I18N-10): option → document lang → navigator → en. Returns a BCP 47 tag. */
export function resolveLocale(option?: string | null, documentLang?: string | null, navigatorLanguages?: readonly string[]): string {
  const candidates = [option, documentLang, ...(navigatorLanguages ?? [])].filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  for (const c of candidates) { try { return Intl.getCanonicalLocales(c.trim())[0] ?? 'en'; } catch { /* invalid tag, try the next */ } }
  return 'en';
}

/** Lookup order for catalog files: full tag, language only (I18N-10). */
export function catalogCandidates(tag: string): string[] {
  const lang = tag.toLowerCase().split('-')[0]!;
  return tag.toLowerCase() === lang ? [lang] : [tag, lang];
}
