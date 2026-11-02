// A minimal S3 client: Signature Version 4 over the platform fetch, the handful of operations a media source needs.
// No SDK: the point of an S3-compatible driver is that it talks to anything that speaks the protocol
// (AWS S3, Cloudflare R2, MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, Tigris, Garage, Ceph RGW).
import { createHash, createHmac } from 'node:crypto';

export interface S3Credentials { accessKeyId: string; secretAccessKey: string; sessionToken?: string }

export interface S3ClientOptions {
  bucket: string;
  /** Signing region (default `us-east-1`; R2 and most compatibles accept `auto` or `us-east-1`). On AWS a wrong region is corrected from the bucket's redirect. */
  region?: string;
  /** Service endpoint (default `https://s3.{region}.amazonaws.com`). Required for anything that is not AWS. */
  endpoint?: string;
  /** `https://{endpoint}/{bucket}/{key}` instead of `https://{bucket}.{endpoint}/{key}`. Default: true for a custom endpoint, false for AWS. */
  forcePathStyle?: boolean;
  credentials: S3Credentials;
  /** Injected for tests. */
  fetch?: typeof fetch;
  now?: () => Date;
}

export interface S3Object { key: string; size: number; lastModified: number; etag: string }
export interface S3Listing { objects: S3Object[]; prefixes: string[] }
export interface S3Head { size: number; lastModified: number; etag: string; contentType: string }

export class S3Error extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) { super(message); this.name = 'S3Error'; }
}

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const sha256 = (data: Buffer | string) => createHash('sha256').update(data).digest('hex');
const hmac = (key: Buffer | string, data: string) => createHmac('sha256', key).update(data, 'utf8').digest();

/** RFC 3986 percent-encoding as SigV4 wants it (`encodeURIComponent` leaves `!'()*` alone). */
export function uriEncode(s: string, keepSlash = false): string {
  const enc = encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  return keepSlash ? enc.replace(/%2F/g, '/') : enc;
}

export interface SignInput {
  method: string;
  url: URL;
  headers: Record<string, string>;
  /** Hex SHA-256 of the body, or `UNSIGNED-PAYLOAD`. */
  payloadHash: string;
  region: string;
  credentials: S3Credentials;
  date: Date;
}

/** Add `x-amz-date`, `x-amz-content-sha256` (and the session token) and return the `Authorization` header value. Exposed for the known-answer test. */
export function signV4(input: SignInput): string {
  const { method, url, headers, payloadHash, region, credentials, date } = input;
  const amzDate = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const shortDate = amzDate.slice(0, 8);
  headers['host'] = url.host;
  headers['x-amz-date'] = amzDate;
  headers['x-amz-content-sha256'] = payloadHash;
  if (credentials.sessionToken) headers['x-amz-security-token'] = credentials.sessionToken;
  const names = Object.keys(headers).map((h) => h.toLowerCase()).sort();
  const canonicalHeaders = names.map((h) => `${h}:${String(headers[Object.keys(headers).find((k) => k.toLowerCase() === h)!]).trim().replace(/\s+/g, ' ')}\n`).join('');
  const signedHeaders = names.join(';');
  const query = url.search.slice(1).split('&').filter(Boolean).map((pair) => pair.split('=') as [string, string?]).map(([k, v]) => [uriEncode(decodeURIComponent(k)), uriEncode(decodeURIComponent(v ?? ''))] as const).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
  const canonicalRequest = [method, url.pathname, query, canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const scope = `${shortDate}/${region}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
  const kSigning = hmac(hmac(hmac(hmac('AWS4' + credentials.secretAccessKey, shortDate), region), 's3'), 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');
  return `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

const decodeXml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
const encodeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** The text of every `<tag>…</tag>` in a flat S3 response (no attributes, no nesting of the same tag). */
function xmlAll(xml: string, tag: string): string[] { return [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => decodeXml(m[1]!)); }
const xmlOne = (xml: string, tag: string) => xmlAll(xml, tag)[0];

export class S3Client {
  readonly bucket: string;
  region: string;
  private base: URL;
  private readonly aws: boolean;
  private readonly pathStyle: boolean;
  private readonly creds: S3Credentials;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => Date;

  constructor(opts: S3ClientOptions) {
    this.bucket = opts.bucket;
    this.region = opts.region ?? 'us-east-1';
    const custom = !!opts.endpoint;
    this.aws = !custom;
    this.base = new URL(opts.endpoint ?? `https://s3.${this.region}.amazonaws.com`);
    this.pathStyle = opts.forcePathStyle ?? custom;
    this.creds = opts.credentials;
    this.fetchImpl = opts.fetch ?? fetch;
    this.now = opts.now ?? (() => new Date());
  }

  /** The URL of an object (unsigned): where `publicBaseUrl` is not configured the handler proxies instead. */
  objectUrl(key: string, query?: Record<string, string>): URL {
    const url = new URL(this.base.toString());
    const encodedKey = key === '' ? '' : uriEncode(key, true);
    if (this.pathStyle) url.pathname = `${url.pathname.replace(/\/$/, '')}/${this.bucket}${encodedKey ? '/' + encodedKey : ''}`;
    else { url.host = `${this.bucket}.${url.host}`; url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodedKey}`; }
    // RFC 3986 encoding in the query too (URLSearchParams would send `+` for spaces, which S3 decodes differently)
    if (query) url.search = Object.entries(query).map(([k, v]) => `${uriEncode(k)}=${uriEncode(v)}`).join('&');
    return url;
  }

  async request(method: string, key: string, init: { query?: Record<string, string>; headers?: Record<string, string>; body?: Buffer } = {}): Promise<Response> {
    const url = this.objectUrl(key, init.query);
    const headers: Record<string, string> = { ...init.headers };
    const payloadHash = init.body ? sha256(init.body) : EMPTY_SHA256;
    if (init.body) headers['content-length'] = String(init.body.length);
    headers['authorization'] = signV4({ method, url, headers, payloadHash, region: this.region, credentials: this.creds, date: this.now() });
    // Unsigned, after signing: without it Node's fetch asks for gzip, inflates the body and drops Content-Length, so a
    // JSON object from R2 came back with size 0 and a Range answer would not be the bytes the client asked for.
    headers['accept-encoding'] = 'identity';
    const res = await this.fetchImpl(url, { method, headers, ...(init.body ? { body: new Uint8Array(init.body) } : {}), redirect: 'manual' });
    // AWS answers a request signed for the wrong region with 301/400 and the right one in x-amz-bucket-region: move there once
    const hint = res.headers.get('x-amz-bucket-region');
    if (this.aws && hint && hint !== this.region && (res.status === 301 || res.status === 400 || res.status === 403)) {
      await res.body?.cancel();
      this.region = hint; this.base = new URL(`https://s3.${hint}.amazonaws.com`);
      return this.request(method, key, init);
    }
    if (!res.ok && res.status !== 206 && res.status !== 304 && res.status !== 404 && res.status !== 416) {
      const text = await res.text().catch(() => '');
      throw new S3Error(`S3 ${method} ${key || '/'}: ${res.status} ${xmlOne(text, 'Code') ?? ''} ${xmlOne(text, 'Message') ?? ''}`.trim(), res.status >= 500 ? 502 : res.status === 403 ? 403 : 502, xmlOne(text, 'Code'));
    }
    return res;
  }

  /** One page of ListObjectsV2; `prefixes` are the common prefixes when `delimiter` is given. */
  async listPage(prefix: string, delimiter: string | undefined, token: string | undefined): Promise<S3Listing & { next?: string }> {
    const query: Record<string, string> = { 'list-type': '2', prefix, 'max-keys': '1000' };
    if (delimiter) query.delimiter = delimiter;
    if (token) query['continuation-token'] = token;
    const res = await this.request('GET', '', { query });
    if (res.status === 404) throw new S3Error(`bucket ${this.bucket} not found`, 502, 'NoSuchBucket');
    const xml = await res.text();
    const objects = [...xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)].map((m) => ({
      key: xmlOne(m[1]!, 'Key') ?? '', size: Number(xmlOne(m[1]!, 'Size') ?? 0), lastModified: Date.parse(xmlOne(m[1]!, 'LastModified') ?? '') || 0, etag: xmlOne(m[1]!, 'ETag') ?? ''
    }));
    const prefixes = [...xml.matchAll(/<CommonPrefixes>([\s\S]*?)<\/CommonPrefixes>/g)].map((m) => xmlOne(m[1]!, 'Prefix') ?? '');
    const truncated = xmlOne(xml, 'IsTruncated') === 'true';
    const next = truncated ? xmlOne(xml, 'NextContinuationToken') : undefined;
    return { objects, prefixes, ...(next ? { next } : {}) };
  }

  /** Every object and common prefix under `prefix`, following continuation tokens. */
  async list(prefix: string, delimiter?: string): Promise<S3Listing> {
    const out: S3Listing = { objects: [], prefixes: [] };
    let token: string | undefined;
    do {
      const page = await this.listPage(prefix, delimiter, token);
      out.objects.push(...page.objects); out.prefixes.push(...page.prefixes);
      token = page.next;
    } while (token);
    return out;
  }

  async head(key: string): Promise<S3Head | null> {
    const res = await this.request('HEAD', key);
    if (res.status === 404) return null;
    return { size: Number(res.headers.get('content-length') ?? 0), lastModified: Date.parse(res.headers.get('last-modified') ?? '') || 0, etag: res.headers.get('etag') ?? '', contentType: res.headers.get('content-type') ?? 'application/octet-stream' };
  }

  /** GetObject, optionally a byte range. Null when the key does not exist. */
  async get(key: string, range?: { start: number; end?: number }): Promise<Response | null> {
    const headers: Record<string, string> = {};
    if (range) headers['range'] = `bytes=${range.start}-${range.end ?? ''}`;
    const res = await this.request('GET', key, { headers });
    if (res.status === 404) { await res.body?.cancel(); return null; }
    return res;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    const res = await this.request('PUT', key, { body, headers: { 'content-type': contentType } });
    await res.body?.cancel();
  }

  async copy(from: string, to: string): Promise<void> {
    const res = await this.request('PUT', to, { headers: { 'x-amz-copy-source': `/${uriEncode(this.bucket)}/${uriEncode(from, true)}`, 'x-amz-metadata-directive': 'COPY' } });
    if (res.status === 404) throw new S3Error(`${from} not found`, 404, 'NoSuchKey');
    await res.text(); // a CopyObject error can hide in a 200 body; consumed, nothing to do with it here
  }

  async delete(key: string): Promise<void> { const res = await this.request('DELETE', key); await res.body?.cancel(); }

  /** DeleteObjects in batches of 1000 (the protocol's limit), quietly. */
  async deleteMany(keys: string[]): Promise<void> {
    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);
      const body = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><Delete xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Quiet>true</Quiet>${batch.map((k) => `<Object><Key>${encodeXml(k)}</Key></Object>`).join('')}</Delete>`);
      const res = await this.request('POST', '', { query: { delete: '' }, body, headers: { 'content-type': 'application/xml', 'content-md5': createHash('md5').update(body).digest('base64') } });
      const xml = await res.text();
      const errors = xmlAll(xml, 'Error');
      if (errors.length) throw new S3Error(`S3 DeleteObjects: ${xmlOne(errors[0]!, 'Code') ?? 'error'} ${xmlOne(errors[0]!, 'Key') ?? ''}`.trim(), 502);
    }
  }
}
