// The REST client interface (07 STATE-51) and its default implementation over
// fetch (api/openapi.yaml). Hosts may supply their own `EurekaApi`.
import { encodePathForURL, normalizePath } from '../paths.js';
import type { Entry, Source, SourceId, TreeNode } from '../types.js';

export interface RequestOptions { signal?: AbortSignal }
export interface TreeOptions extends RequestOptions { cd?: string; depth?: number }

export interface EurekaApi {
  listSources(opts?: RequestOptions): Promise<Source[]>;
  /** Subfolders of `cd` (default the root), `depth` levels deep; a node at the cut-off has no `children` (11 MS-43). */
  listTree(source: SourceId, opts?: TreeOptions): Promise<TreeNode[]>;
  listDirectory(source: SourceId, path: string, opts?: RequestOptions): Promise<Entry[]>;
  upload(source: SourceId, path: string, files: Iterable<File> | FormData, opts?: RequestOptions): Promise<Entry[]>;
  createDirectory(source: SourceId, path: string, opts?: RequestOptions): Promise<Entry[] | true>;
  rename(source: SourceId, path: string, name: string, opts?: RequestOptions): Promise<Entry[]>;
  remove(source: SourceId, path: string, opts?: RequestOptions): Promise<Entry[] | true>;
  removeMany(source: SourceId, cd: string, filenames: string[], opts?: RequestOptions): Promise<Entry[]>;
  /** URL and form fields for the bulk zip download; the UI submits it as a form so the browser handles the download. */
  zipRequest(source: SourceId, cd: string, filenames: string[]): { url: string; fields: Array<[string, string]> };
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly url: string, public readonly body?: unknown) { super(message); this.name = 'ApiError'; }
}

export interface RestApiOptions {
  basePath?: string;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  /** Path under basePath; the v2 default is `media`. */
  mediaPath?: string;
}

export function createRestApi({ basePath = '/', headers = {}, fetch: f = globalThis.fetch, mediaPath = 'media' }: RestApiOptions = {}): EurekaApi {
  const root = basePath.replace(/\/+$/, '') + '/' + mediaPath.replace(/^\/+|\/+$/g, '');
  const url = (p: string, params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return `${root}/${p}${qs ? `?${qs}` : ''}`;
  };
  const dirParam = (path: string) => ({ path: normalizePath(path) });

  async function call<T>(method: string, u: string, { body, signal }: { body?: BodyInit; signal?: AbortSignal } = {}): Promise<T> {
    const res = await f(u, { method, headers: { Accept: 'application/json', ...headers }, body, signal, credentials: 'same-origin' });
    const text = await res.text();
    let data: unknown = undefined;
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (!res.ok) throw new ApiError(`${method} ${u} failed with ${res.status}`, res.status, u, data);
    if (data && typeof data === 'object' && !Array.isArray(data) && 'error' in (data as Record<string, unknown>)) {
      throw new ApiError(String((data as { error: unknown }).error), res.status, u, data); // v2 servers returned 200 + {error}
    }
    return data as T;
  }
  const asEntries = (x: unknown): Entry[] => (Array.isArray(x) ? (x as Entry[]) : []);
  const toFormData = (files: Iterable<File> | FormData): FormData => {
    if (files instanceof FormData) return files;
    const fd = new FormData();
    for (const file of files) fd.append('eureka__uploadFiles', file, file.name);
    return fd;
  };

  return {
    listSources: (o) => call<Source[]>('GET', url('sources/'), o).then((x) => (Array.isArray(x) ? x : [])),
    listTree: (source, o = {}) => {
      const cd = normalizePath(o.cd);
      const params: Record<string, string> = { ...(cd !== '/' ? { tree: cd } : {}), ...(o.depth ? { depth: String(o.depth) } : {}) };
      return call<TreeNode[]>('GET', url(`sources/${encodeURIComponent(String(source))}`, params), o).then((x) => (Array.isArray(x) ? x : []));
    },
    listDirectory: (source, path, o) => call<unknown>('GET', url(`sources/${encodeURIComponent(String(source))}`, dirParam(path)), o).then(asEntries),
    upload: (source, path, files, o) => call<unknown>('POST', url(`sources/${encodeURIComponent(String(source))}`, dirParam(path)), { body: toFormData(files), ...o }).then(asEntries),
    createDirectory: (source, path, o) => call<Entry[] | true>('PUT', url(`sources/${encodeURIComponent(String(source))}`, dirParam(path)), o).then((x) => (Array.isArray(x) ? x : true)),
    rename: (source, path, name, o) => call<unknown>('PUT', url(`sources/${encodeURIComponent(String(source))}`, { ...dirParam(path), name }), o).then(asEntries),
    remove: (source, path, o) => call<Entry[] | true>('DELETE', url(`sources/${encodeURIComponent(String(source))}`, dirParam(path)), o).then((x) => (Array.isArray(x) ? x : true)),
    removeMany(source, cd, filenames, o) {
      const fd = new FormData();
      fd.append('cd', normalizePath(cd)); fd.append('cs', String(source));
      for (const n of filenames) fd.append('delete_file[]', n);
      return call<unknown>('DELETE', url(`sources/${encodeURIComponent(String(source))}`), { body: fd, ...o }).then(asEntries);
    },
    zipRequest: (source, cd, filenames) => ({ url: url(`attachments/${encodeURIComponent(String(source))}`), fields: [['cd', normalizePath(cd)], ['cs', String(source)], ...filenames.map((n): [string, string] => ['zip_file[]', n])] })
  };
}

/** Build the `absoluteURL` of an entry from a source-relative path when a server omits it. */
export const urlForPath = (mediaRoot: string, path: string): string => `${mediaRoot.replace(/\/+$/, '')}/${encodePathForURL(path)}`;
