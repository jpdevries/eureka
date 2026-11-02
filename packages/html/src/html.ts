// A tiny HTML templating layer: tagged template with automatic escaping.
// Interpolations are escaped unless wrapped with raw(); arrays are joined;
// null/undefined/false render nothing.

export class Raw { constructor(public readonly value: string) {} toString() { return this.value; } }
export const raw = (s: string): Raw => new Raw(s);

export function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export type Child = string | number | boolean | null | undefined | Raw | Child[];

function render(v: Child): string {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (v instanceof Raw) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return escapeHtml(v);
}

export function html(strings: TemplateStringsArray, ...values: Child[]): Raw {
  let out = '';
  for (let i = 0; i < strings.length; i++) { out += strings[i]; if (i < values.length) out += render(values[i]); }
  return new Raw(out);
}

/** Boolean/valued attribute helper: attr('hidden', true) → ' hidden', attr('title', x) → ' title="x"', falsy → ''. */
export function attr(name: string, value: unknown): Raw {
  if (value === true) return new Raw(` ${name}`);
  if (value === false || value === null || value === undefined || value === '') return new Raw('');
  return new Raw(` ${name}="${escapeHtml(value)}"`);
}

export function classes(...names: Array<string | false | null | undefined | Record<string, boolean>>): string {
  const out: string[] = [];
  for (const n of names) {
    if (!n) continue;
    if (typeof n === 'string') out.push(n);
    else for (const [k, v] of Object.entries(n)) if (v) out.push(k);
  }
  return out.join(' ');
}

/** Serialize JSON for a <script type="application/json"> block (closes no tags). */
export function jsonForScript(value: unknown): Raw {
  return new Raw(JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'));
}
