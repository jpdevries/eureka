// Google OAuth 2.0 access tokens without a client library: a service account (RS256 JWT bearer grant) or a
// user's refresh token. Both return a `getToken()` the Drive client calls before each request (11 MS-44);
// tokens are cached until a minute before they expire.
import { createSign } from 'node:crypto';

export type TokenProvider = () => Promise<string>;

export interface GoogleAuthOptions {
  /** Google's token endpoint; injected for tests. */
  tokenUrl?: string;
  fetch?: typeof fetch;
  now?: () => number;
}

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
export const DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export class GoogleAuthError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = 'GoogleAuthError'; }
}

const b64url = (data: Buffer | string) => Buffer.from(data).toString('base64url');

/** Caches a token until shortly before `expires_in` runs out. */
function cached(fetchToken: () => Promise<{ access_token: string; expires_in?: number }>, now: () => number): TokenProvider {
  let token: { value: string; until: number } | null = null;
  let inflight: Promise<string> | null = null;
  return async () => {
    if (token && token.until > now()) return token.value;
    inflight ??= fetchToken().then((t) => { token = { value: t.access_token, until: now() + Math.max(0, (t.expires_in ?? 3600) - 60) * 1000 }; return t.access_token; }).finally(() => { inflight = null; });
    return inflight;
  };
}

async function postForm(url: string, params: Record<string, string>, f: typeof fetch): Promise<{ access_token: string; expires_in?: number }> {
  const res = await f(url, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params).toString() });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: unknown; error_description?: string };
  if (!res.ok || !body.access_token) throw new GoogleAuthError(`Google token endpoint: ${res.status} ${typeof body.error === 'string' ? body.error : body.error ? JSON.stringify(body.error) : ''} ${body.error_description ?? ''}`.trim(), res.status === 400 || res.status === 401 ? 403 : 502);
  return { access_token: body.access_token, ...(body.expires_in !== undefined ? { expires_in: body.expires_in } : {}) };
}

export interface ServiceAccountOptions extends GoogleAuthOptions {
  clientEmail: string;
  /** PEM private key from the service account's JSON (`private_key`); `\n` escapes are accepted. */
  privateKey: string;
  scopes?: string[];
  /** A Workspace user to impersonate (domain-wide delegation). */
  subject?: string;
}

/** The JWT bearer grant (RFC 7523) Google accepts from service accounts. */
export function createServiceAccountToken(opts: ServiceAccountOptions): TokenProvider {
  const f = opts.fetch ?? fetch, now = opts.now ?? Date.now, url = opts.tokenUrl ?? TOKEN_URL;
  const key = opts.privateKey.replace(/\\n/g, '\n');
  const scope = (opts.scopes ?? [DRIVE_SCOPE]).join(' ');
  return cached(async () => {
    const iat = Math.floor(now() / 1000);
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = b64url(JSON.stringify({ iss: opts.clientEmail, scope, aud: url, iat, exp: iat + 3600, ...(opts.subject ? { sub: opts.subject } : {}) }));
    const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(key).toString('base64url');
    return postForm(url, { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${header}.${claims}.${signature}` }, f);
  }, now);
}

export interface RefreshTokenOptions extends GoogleAuthOptions { clientId: string; clientSecret: string; refreshToken: string }

/** A user's long-lived refresh token (from the OAuth consent flow the host ran once) exchanged for access tokens. */
export function createRefreshTokenProvider(opts: RefreshTokenOptions): TokenProvider {
  const f = opts.fetch ?? fetch, now = opts.now ?? Date.now, url = opts.tokenUrl ?? TOKEN_URL;
  return cached(() => postForm(url, { grant_type: 'refresh_token', client_id: opts.clientId, client_secret: opts.clientSecret, refresh_token: opts.refreshToken }, f), now);
}

/** A fixed token (tests, short scripts); expires when Google says so. */
export const staticToken = (token: string): TokenProvider => async () => token;
