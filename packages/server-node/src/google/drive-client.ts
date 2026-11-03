// The slice of the Google Drive v3 REST API a media source needs, over fetch, with a token provider (11 §4).
import type { TokenProvider } from './auth.js';

export const FOLDER = 'application/vnd.google-apps.folder';
export const SHORTCUT = 'application/vnd.google-apps.shortcut';
/** Drive-native documents have no bytes of their own; they export (MS-52). Extension as Drive for desktop names them. */
export const NATIVE: Record<string, { ext: string; exportAs: string }> = {
  'application/vnd.google-apps.document': { ext: '.gdoc', exportAs: 'application/pdf' },
  'application/vnd.google-apps.spreadsheet': { ext: '.gsheet', exportAs: 'application/pdf' },
  'application/vnd.google-apps.presentation': { ext: '.gslides', exportAs: 'application/pdf' },
  'application/vnd.google-apps.drawing': { ext: '.gdraw', exportAs: 'image/png' },
  'application/vnd.google-apps.form': { ext: '.gform', exportAs: 'application/pdf' },
  'application/vnd.google-apps.jam': { ext: '.gjam', exportAs: 'application/pdf' },
  'application/vnd.google-apps.site': { ext: '.gsite', exportAs: 'application/pdf' },
  'application/vnd.google-apps.script': { ext: '.gscript', exportAs: 'application/json' }
};

export interface DriveFile {
  id: string; name: string; mimeType: string;
  size?: string; modifiedTime?: string; createdTime?: string; md5Checksum?: string;
  imageMediaMetadata?: { width?: number; height?: number };
  shortcutDetails?: { targetId: string; targetMimeType: string };
  trashed?: boolean;
  /** Drive renders a thumbnail for most images (TIFF included), videos, PDFs and its own documents; the link is short-lived and sized by its `=s{n}` suffix. */
  hasThumbnail?: boolean;
  thumbnailLink?: string;
  thumbnailVersion?: string;
}
const FIELDS = 'id,name,mimeType,size,modifiedTime,createdTime,md5Checksum,imageMediaMetadata(width,height),shortcutDetails(targetId,targetMimeType),hasThumbnail,thumbnailLink,thumbnailVersion';

export type PreviewFormat = 'jpeg' | 'webp' | 'png';
/** Google image-serving flags: `rj` JPEG, `rw` WebP, `rp` PNG, `l{q}` quality. Drive's own default is PNG, four times the JPEG. */
const FORMAT_FLAGS: Record<PreviewFormat, string> = { jpeg: '-rj-l80', webp: '-rw-l80', png: '-rp' };
/** A thumbnail link resized to `width` pixels on its long edge (the `=s220` Drive appends) in the asked format. */
export function sizedThumbnailLink(link: string, width: number, format: PreviewFormat = 'jpeg'): string {
  const w = Math.max(16, Math.min(1600, Math.round(width)));
  const opts = `=s${w}${FORMAT_FLAGS[format]}`;
  return /=s\d+(-[a-z0-9-]+)?$/.test(link) ? link.replace(/=s\d+(-[a-z0-9-]+)?$/, opts) : `${link}${link.includes('?') ? '&' : '?'}sz${opts}`;
}

export interface DriveClientOptions {
  getToken: TokenProvider;
  /** A shared drive to work in (`corpora=drive`); otherwise My Drive and anything shared with the account. */
  driveId?: string;
  /** API base, injected for tests. */
  apiBase?: string;
  uploadBase?: string;
  fetch?: typeof fetch;
}

export class DriveError extends Error {
  constructor(message: string, public readonly status: number, public readonly reason?: string) { super(message); this.name = 'DriveError'; }
}

export class DriveClient {
  private readonly api: string;
  private readonly upload: string;
  private readonly f: typeof fetch;
  constructor(private readonly opts: DriveClientOptions) {
    this.api = (opts.apiBase ?? 'https://www.googleapis.com/drive/v3').replace(/\/$/, '');
    this.upload = (opts.uploadBase ?? 'https://www.googleapis.com/upload/drive/v3').replace(/\/$/, '');
    this.f = opts.fetch ?? fetch;
  }

  private common(params: Record<string, string> = {}): URLSearchParams {
    const p = new URLSearchParams({ supportsAllDrives: 'true', ...params });
    return p;
  }

  async request(method: string, url: string, init: { headers?: Record<string, string>; body?: BodyInit; raw?: boolean } = {}): Promise<Response> {
    const token = await this.opts.getToken();
    const res = await this.f(url, { method, headers: { authorization: `Bearer ${token}`, 'accept-encoding': 'identity', ...init.headers }, ...(init.body !== undefined ? { body: init.body } : {}) });
    if (res.ok || res.status === 206 || res.status === 304 || res.status === 416) return res;
    const text = await res.text().catch(() => '');
    let reason: string | undefined, message = '';
    try { const j = JSON.parse(text) as { error?: { message?: string; errors?: Array<{ reason?: string }>; status?: string } }; reason = j.error?.errors?.[0]?.reason ?? j.error?.status; message = j.error?.message ?? ''; } catch { /* not JSON */ }
    const status = res.status === 404 ? 404 : res.status === 401 || res.status === 403 ? 403 : res.status === 429 ? 503 : res.status >= 500 ? 502 : res.status === 400 ? 400 : 502;
    throw new DriveError(`Google Drive ${method} ${new URL(url).pathname}: ${res.status} ${reason ?? ''} ${message}`.trim(), status, reason);
  }

  private async json<T>(method: string, url: string, init?: { headers?: Record<string, string>; body?: BodyInit }): Promise<T> {
    const res = await this.request(method, url, init);
    return (await res.json()) as T;
  }

  /** Children of a folder (one `files.list` per page), folders only when asked. Shortcuts come back as they are. */
  async list(parentId: string, { foldersOnly = false, name }: { foldersOnly?: boolean; name?: string } = {}): Promise<DriveFile[]> {
    const q = [`'${parentId.replace(/'/g, "\\'")}' in parents`, 'trashed = false', ...(foldersOnly ? [`mimeType = '${FOLDER}'`] : []), ...(name !== undefined ? [`name = '${name.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`] : [])].join(' and ');
    const out: DriveFile[] = [];
    let pageToken: string | undefined;
    do {
      const params = this.common({ q, fields: `nextPageToken,files(${FIELDS})`, pageSize: '1000', orderBy: 'folder,name,createdTime', includeItemsFromAllDrives: 'true', ...(this.opts.driveId ? { corpora: 'drive', driveId: this.opts.driveId } : {}), ...(pageToken ? { pageToken } : {}) });
      const page = await this.json<{ files?: DriveFile[]; nextPageToken?: string }>('GET', `${this.api}/files?${params}`);
      out.push(...(page.files ?? []));
      pageToken = page.nextPageToken;
    } while (pageToken);
    return out;
  }

  async get(id: string): Promise<DriveFile | null> {
    try { return await this.json<DriveFile>('GET', `${this.api}/files/${encodeURIComponent(id)}?${this.common({ fields: FIELDS })}`); }
    catch (err) { if (err instanceof DriveError && err.status === 404) return null; throw err; }
  }

  /** The bytes of a file (`alt=media`), optionally a byte range; null when gone. */
  async media(id: string, range?: { start: number; end?: number }): Promise<Response | null> {
    try { return await this.request('GET', `${this.api}/files/${encodeURIComponent(id)}?${this.common({ alt: 'media' })}`, range ? { headers: { range: `bytes=${range.start}-${range.end ?? ''}` } } : {}); }
    catch (err) { if (err instanceof DriveError && err.status === 404) return null; throw err; }
  }

  /** A Drive-native document rendered as `mimeType` (10 MB limit on Google's side). */
  async export(id: string, mimeType: string): Promise<Response | null> {
    try { return await this.request('GET', `${this.api}/files/${encodeURIComponent(id)}/export?${new URLSearchParams({ mimeType })}`); }
    catch (err) { if (err instanceof DriveError && err.status === 404) return null; throw err; }
  }

  /** Multipart upload of a new file into `parentId`. */
  async create(parentId: string, name: string, data: Buffer, contentType: string): Promise<DriveFile> {
    const boundary = `eureka${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    const meta = JSON.stringify({ name, parents: [parentId] });
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\ncontent-type: ${contentType}\r\n\r\n`), data, Buffer.from(`\r\n--${boundary}--`)
    ]);
    return this.json<DriveFile>('POST', `${this.upload}/files?${this.common({ uploadType: 'multipart', fields: FIELDS })}`, { headers: { 'content-type': `multipart/related; boundary=${boundary}` }, body: new Uint8Array(body) });
  }

  /** Replace the bytes of an existing file (an upload over a file of the same name, like a filesystem would). */
  async replaceContent(id: string, data: Buffer, contentType: string): Promise<DriveFile> {
    return this.json<DriveFile>('PATCH', `${this.upload}/files/${encodeURIComponent(id)}?${this.common({ uploadType: 'media', fields: FIELDS })}`, { headers: { 'content-type': contentType }, body: new Uint8Array(data) });
  }

  async createFolder(parentId: string, name: string): Promise<DriveFile> {
    return this.json<DriveFile>('POST', `${this.api}/files?${this.common({ fields: FIELDS })}`, { headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, mimeType: FOLDER, parents: [parentId] }) });
  }

  async patch(id: string, metadata: Record<string, unknown>): Promise<DriveFile> {
    return this.json<DriveFile>('PATCH', `${this.api}/files/${encodeURIComponent(id)}?${this.common({ fields: FIELDS })}`, { headers: { 'content-type': 'application/json' }, body: JSON.stringify(metadata) });
  }

  /**
   * Fetch a thumbnail by its link. The link is a signed URL on another host, so the bearer token is deliberately not
   * sent; null when Google says it has expired or gone (the caller refreshes the file's metadata and tries once more).
   */
  async thumbnail(link: string): Promise<Response | null> {
    const res = await this.f(link, { headers: { 'accept-encoding': 'identity' } });
    if (res.status === 404 || res.status === 403 || res.status === 410) { await res.body?.cancel(); return null; }
    if (!res.ok) { const text = await res.text().catch(() => ''); throw new DriveError(`Google Drive thumbnail: ${res.status} ${text.slice(0, 80)}`.trim(), res.status >= 500 ? 502 : 502); }
    return res;
  }

  /** Trash (default, MS-42) or permanently delete. */
  async remove(id: string, { permanent = false } = {}): Promise<void> {
    if (permanent) { const res = await this.request('DELETE', `${this.api}/files/${encodeURIComponent(id)}?${this.common()}`); await res.body?.cancel(); return; }
    await this.patch(id, { trashed: true });
  }
}
