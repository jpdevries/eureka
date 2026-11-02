// Text thumbnails (02 HTML-66c): the first lines of a text file as a small SVG document with light syntax
// colouring. One renderer for every place it runs: the reference server, the worker (for sources that
// serve no previews), or a bucket pipeline ahead of time. No dependencies: the tokenizer below is a few
// regular expressions per language, which is all a thumbnail needs. Output is a few KB and theme-aware
// through media queries inside the SVG.
import { languageFor, type TextLanguage } from './kinds.js';
export { isTextLike, languageFor, looksBinary, type TextLanguage } from './kinds.js';

export type TokenClass = 'plain' | 'comment' | 'string' | 'number' | 'keyword' | 'tag' | 'attr' | 'property' | 'heading' | 'link' | 'punct';
export interface Token { cls: TokenClass; text: string }
const KW: Partial<Record<TextLanguage, string[]>> = {
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'this', 'null', 'undefined', 'true', 'false', 'yield', 'static', 'super', 'delete', 'void'],
  py: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'lambda', 'pass', 'break', 'continue', 'yield', 'None', 'True', 'False', 'self', 'async', 'await', 'global', 'nonlocal', 'del', 'is'],
  rb: ['def', 'end', 'class', 'module', 'if', 'elsif', 'else', 'unless', 'while', 'until', 'for', 'in', 'do', 'return', 'yield', 'begin', 'rescue', 'ensure', 'require', 'include', 'attr_accessor', 'self', 'nil', 'true', 'false', 'and', 'or', 'not', 'puts'],
  php: ['function', 'return', 'if', 'else', 'elseif', 'foreach', 'for', 'while', 'class', 'public', 'private', 'protected', 'static', 'new', 'echo', 'use', 'namespace', 'extends', 'implements', 'null', 'true', 'false', 'array', 'require', 'include', 'try', 'catch', 'throw'],
  c: ['int', 'char', 'void', 'float', 'double', 'long', 'short', 'unsigned', 'struct', 'typedef', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'static', 'const', 'public', 'private', 'protected', 'class', 'new', 'import', 'package', 'var', 'val', 'fun', 'let', 'func', 'bool', 'string', 'null', 'true', 'false', 'override', 'namespace', 'using'],
  go: ['func', 'package', 'import', 'return', 'if', 'else', 'for', 'range', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go', 'defer', 'select', 'switch', 'case', 'break', 'continue', 'nil', 'true', 'false', 'err', 'string', 'int', 'bool', 'error'],
  rs: ['fn', 'let', 'mut', 'pub', 'use', 'mod', 'struct', 'enum', 'impl', 'trait', 'for', 'in', 'if', 'else', 'match', 'return', 'while', 'loop', 'break', 'continue', 'const', 'static', 'where', 'as', 'self', 'Self', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'String', 'str', 'u32', 'i32', 'usize', 'bool', 'async', 'await', 'dyn', 'move', 'ref', 'crate', 'super'],
  sh: ['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'exit', 'export', 'local', 'echo', 'set', 'source', 'cd', 'npm', 'npx', 'node', 'git'],
  sql: ['select', 'from', 'where', 'insert', 'into', 'values', 'update', 'set', 'delete', 'create', 'table', 'alter', 'drop', 'join', 'left', 'right', 'inner', 'outer', 'on', 'group', 'by', 'order', 'having', 'limit', 'as', 'and', 'or', 'not', 'null', 'primary', 'key', 'index', 'distinct', 'count', 'sum', 'avg', 'min', 'max'],
  yaml: ['true', 'false', 'null', 'yes', 'no'], toml: ['true', 'false'], json: ['true', 'false', 'null'], css: ['important', 'media', 'supports', 'layer', 'container', 'keyframes', 'import', 'font-face', 'starting-style']
};
KW.ts = [...KW.js!, 'interface', 'type', 'enum', 'implements', 'readonly', 'public', 'private', 'protected', 'declare', 'namespace', 'keyof', 'as', 'is', 'never', 'unknown', 'any', 'string', 'number', 'boolean'];

interface Rule { cls: TokenClass; re: string }
const RULES: Record<TextLanguage, Rule[]> = (() => {
  const str: Rule = { cls: 'string', re: String.raw`"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|` + '`(?:[^`\\\\]|\\\\.)*`' };
  const dq: Rule = { cls: 'string', re: String.raw`"(?:[^"\\]|\\.)*"` };
  const num: Rule = { cls: 'number', re: String.raw`\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)(?:%|px|r?em|vh|vw|s|ms|deg|fr|cqi)?\b` };
  const slash: Rule = { cls: 'comment', re: String.raw`//.*$` };
  const hash: Rule = { cls: 'comment', re: String.raw`#.*$` };
  const kw = (l: TextLanguage): Rule => ({ cls: 'keyword', re: String.raw`\b(?:` + (KW[l] ?? []).map((k) => k.replace(/[-]/g, '\\-')).join('|') + String.raw`)\b` });
  const punct: Rule = { cls: 'punct', re: String.raw`[{}()[\];,.<>=+\-*/%!&|?:^~]+` };
  const code = (l: TextLanguage, comment: Rule): Rule[] => [comment, str, num, kw(l), punct];
  return {
    js: code('js', slash), ts: code('ts', slash), c: code('c', slash), go: code('go', slash), rs: code('rs', slash), php: [slash, hash, str, num, kw('php'), punct],
    py: code('py', hash), rb: code('rb', hash), sh: code('sh', hash),
    sql: [{ cls: 'comment', re: String.raw`--.*$` }, str, num, { cls: 'keyword', re: String.raw`\b(?:` + KW.sql!.join('|') + String.raw`)\b` }, punct],
    json: [{ cls: 'property', re: String.raw`"(?:[^"\\]|\\.)*"(?=\s*:)` }, dq, num, kw('json'), punct],
    css: [{ cls: 'keyword', re: String.raw`@[\w-]+` }, { cls: 'property', re: String.raw`(?<=^|[{;]\s*)[\w-]+(?=\s*:)` }, str, num, { cls: 'tag', re: String.raw`(?<=^|[,}]\s*)[.#]?[\w-]+(?=[^{};]*\{)` }, punct],
    html: [{ cls: 'comment', re: String.raw`<!--.*?(?:-->|$)` }, { cls: 'tag', re: String.raw`</?[A-Za-z][\w:-]*|/?>` }, { cls: 'attr', re: String.raw`\b[\w:-]+(?==)` }, str, punct],
    xml: [{ cls: 'comment', re: String.raw`<!--.*?(?:-->|$)` }, { cls: 'tag', re: String.raw`</?[A-Za-z][\w:-]*|/?>|<\?[\w-]+|\?>` }, { cls: 'attr', re: String.raw`\b[\w:-]+(?==)` }, str, punct],
    md: [{ cls: 'heading', re: String.raw`^#{1,6}\s.*$` }, { cls: 'link', re: String.raw`!?\[[^\]]*\]\([^)]*\)|<https?://[^>]+>` }, { cls: 'string', re: '`[^`]*`' }, { cls: 'keyword', re: String.raw`^\s*(?:[-*+]|\d+\.)\s|^>\s?` }, { cls: 'punct', re: String.raw`\*\*|__|\*|_|~~` }],
    yaml: [hash, { cls: 'property', re: String.raw`^\s*-?\s*[\w.-]+(?=\s*:)` }, str, num, kw('yaml'), { cls: 'punct', re: String.raw`^\s*-\s|[:\[\]{},|>&*!]` }],
    toml: [hash, { cls: 'heading', re: String.raw`^\s*\[[^\]]*\]` }, { cls: 'property', re: String.raw`^\s*[\w.-]+(?=\s*=)` }, str, num, kw('toml'), punct],
    ini: [{ cls: 'comment', re: String.raw`[#;].*$` }, { cls: 'heading', re: String.raw`^\s*\[[^\]]*\]` }, { cls: 'property', re: String.raw`^\s*[\w.-]+(?=\s*=)` }, str, num, punct],
    csv: [{ cls: 'punct', re: String.raw`[,;\t]` }, dq, num],
    txt: [{ cls: 'link', re: String.raw`https?://\S+` }, num]
  };
})();
const compiled = new Map<TextLanguage, RegExp>();
function matcher(lang: TextLanguage): RegExp {
  let re = compiled.get(lang);
  if (!re) { re = new RegExp(RULES[lang].map((r, i) => `(?<r${i}>${r.re})`).join('|'), 'gm'); compiled.set(lang, re); }
  return re;
}

/** Tokenize one line. `state.block` carries an open block comment across lines (`/* … *\/` in C-like languages, `<!-- … -->` in markup). */
export function tokenizeLine(line: string, lang: TextLanguage, state: { block: '' | '*/' | '-->' } = { block: '' }): Token[] {
  const out: Token[] = [];
  let i = 0;
  const closers = { '*/': lang === 'js' || lang === 'ts' || lang === 'css' || lang === 'c' || lang === 'go' || lang === 'rs' || lang === 'php' || lang === 'sql', '-->': lang === 'html' || lang === 'xml' || lang === 'md' };
  while (i < line.length) {
    if (state.block) {
      const end = line.indexOf(state.block, i);
      if (end === -1) { out.push({ cls: 'comment', text: line.slice(i) }); return out; }
      out.push({ cls: 'comment', text: line.slice(i, end + state.block.length) }); i = end + state.block.length; state.block = ''; continue;
    }
    const openC = closers['*/'] ? line.indexOf('/*', i) : -1;
    const openH = closers['-->'] ? line.indexOf('<!--', i) : -1;
    const opens = [openC, openH].filter((n) => n >= 0);
    const nextOpen = opens.length ? Math.min(...opens) : -1;
    const segment = nextOpen === -1 ? line.slice(i) : line.slice(i, nextOpen);
    if (segment) {
      const re = matcher(lang); re.lastIndex = 0;
      let last = 0;
      for (const m of segment.matchAll(re)) {
        const idx = m.index ?? 0;
        if (idx > last) out.push({ cls: 'plain', text: segment.slice(last, idx) });
        const ri = Object.entries(m.groups ?? {}).findIndex(([, v]) => v !== undefined);
        out.push({ cls: RULES[lang][ri]?.cls ?? 'plain', text: m[0] });
        last = idx + m[0].length;
      }
      if (last < segment.length) out.push({ cls: 'plain', text: segment.slice(last) });
    }
    if (nextOpen === -1) break;
    state.block = nextOpen === openC ? '*/' : '-->';
    i = nextOpen;
  }
  return out;
}

export interface TextThumbnailOptions {
  filename: string;
  /** Lines shown (default 24) and columns kept per line (default 80); longer lines end in an ellipsis. */
  lines?: number; cols?: number;
  /** Image size in CSS px (default 320 × 400, a 4:5 card) and type size (default 12). */
  width?: number; height?: number; fontSize?: number;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Render the first lines of `text` as an SVG document. Decorative when shown as a thumbnail (the row names the file); carries a <title> for direct viewing. */
export function renderTextThumbnail(text: string, { filename, lines = 24, cols = 80, width = 320, height = 400, fontSize = 12 }: TextThumbnailOptions): string {
  const lang = languageFor(filename);
  const lineHeight = Math.round(fontSize * 1.4);
  const pad = Math.round(fontSize);
  const maxLines = Math.min(lines, Math.floor((height - pad * 2) / lineHeight));
  const source = text.trim() ? text.replace(/\r\n?/g, '\n').replace(/\t/g, '  ').split('\n').slice(0, maxLines) : [];
  const state = { block: '' as '' | '*/' | '-->' };
  const rows = source.map((raw, i) => {
    const cut = raw.length > cols ? raw.slice(0, cols - 1) + '…' : raw;
    const tokens = tokenizeLine(cut, lang, state);
    const spans = tokens.map((tk) => (tk.cls === 'plain' ? esc(tk.text) : `<tspan class="${tk.cls}">${esc(tk.text)}</tspan>`)).join('');
    return `<text x="${pad}" y="${pad + lineHeight * (i + 1) - Math.round(fontSize * 0.3)}" xml:space="preserve">${spans || ' '}</text>`;
  });
  if (!rows.length) rows.push(`<text x="${pad}" y="${pad + lineHeight}" class="comment">(empty)</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace" font-size="${fontSize}">`
    + `<title>Preview of ${esc(filename)}</title>`
    + `<style>.bg{fill:#ffffff}text{fill:#24292f}.comment{fill:#6e7781;font-style:italic}.string{fill:#0a3069}.number{fill:#0550ae}.keyword{fill:#cf222e}.tag{fill:#116329}.attr{fill:#953800}.property{fill:#0550ae}.heading{fill:#0969da;font-weight:700}.link{fill:#0969da;text-decoration:underline}.punct{fill:#57606a}`
    + `@media (prefers-color-scheme: dark){.bg{fill:#0d1117}text{fill:#c9d1d9}.comment{fill:#8b949e}.string{fill:#a5d6ff}.number{fill:#79c0ff}.keyword{fill:#ff7b72}.tag{fill:#7ee787}.attr{fill:#ffa657}.property{fill:#79c0ff}.heading{fill:#58a6ff}.link{fill:#58a6ff}.punct{fill:#8b949e}}`
    + `@media (forced-colors: active){.bg{fill:Canvas}text,tspan{fill:CanvasText}.link{fill:LinkText}}</style>`
    + `<rect class="bg" width="${width}" height="${height}"/>${rows.join('')}</svg>`;
}
