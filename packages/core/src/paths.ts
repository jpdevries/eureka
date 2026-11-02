// Path and identifier helpers (01 CON-01..03, 02 HTML-05, 03 NOJS-12).

/** Collapse repeated slashes, strip the trailing slash and any leading slash; the root is "/". */
export function normalizePath(p: string | null | undefined): string {
  let s = (p ?? '').replace(/\/{2,}/g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  return s === '' ? '/' : s;
}

export function joinPath(dir: string, name: string): string {
  const d = normalizePath(dir);
  return normalizePath(d === '/' ? name : `${d}/${name}`);
}

export function parentPath(p: string): string {
  const n = normalizePath(p);
  if (n === '/') return '/';
  const i = n.lastIndexOf('/');
  return i < 0 ? '/' : n.slice(0, i);
}

export function basename(p: string): string {
  const n = normalizePath(p);
  const i = n.lastIndexOf('/');
  return i < 0 ? n : n.slice(i + 1);
}

/** Lower-cased extension including the dot, or "" (query strings and fragments ignored). */
export function extname(nameOrUrl: string): string {
  const clean = nameOrUrl.split(/[?#]/)[0] ?? '';
  const base = basename(clean);
  const i = base.lastIndexOf('.');
  return i <= 0 ? '' : base.slice(i).toLowerCase();
}

/** True when `child` is `dir` or inside it. */
export function isWithin(dir: string, child: string): boolean {
  const d = normalizePath(dir), c = normalizePath(child);
  return d === '/' || c === d || c.startsWith(d + '/');
}

/**
 * The v2 id transform (02 HTML-05): lowercase ASCII letters and digits pass
 * through, space becomes "-", everything else becomes "__" + 4 hex digits.
 */
export function cssSafe(value: string): string {
  return value.replace(/[^a-z0-9]/g, (ch) => {
    const c = ch.charCodeAt(0);
    if (c === 32) return '-';
    if (c >= 65 && c <= 90) return ch.toLowerCase();
    return '__' + ('000' + c.toString(16)).slice(-4);
  });
}

/** Percent-encode each segment of a source-relative path for use in a URL. */
export function encodePathForURL(p: string): string {
  const n = normalizePath(p);
  return n === '/' ? '' : n.split('/').map(encodeURIComponent).join('/');
}

/** The no-JS directory selector value `{sourceId}||{directory}` (03 NOJS-12). */
export function combineSourcePath(sourceId: string | number, dir: string): string {
  return `${sourceId}||${normalizePath(dir)}`;
}
export function splitSourcePath(value: string, delimiter = '||'): { sourceId: string; path: string } {
  const i = value.indexOf(delimiter);
  if (i < 0) return { sourceId: value, path: '/' };
  return { sourceId: value.slice(0, i), path: normalizePath(value.slice(i + delimiter.length)) };
}
