# 11. Media sources

Status: draft. The contract a storage backend satisfies to appear as a
media source (01 §1), the two drivers the reference server ships, and the
considerations for the ones it does not yet.

The REST API (`api/openapi.yaml`) and the Level 0 protocol (03) say what
the client sees. This document says what a backend must do to produce it,
so that a browser pointed at a directory, a bucket or a cloud drive
behaves the same way. In MODX terms these are media sources; in the
reference server they are implementations of `MediaSource`
(`packages/server-node/src/fs-source.ts`).

## 1. The common contract

A source is named (`Source`: `id`, `name`) and owns a tree of
directories and files addressed by source-relative paths (01 CON-01..03).
Everything below holds for every driver.

- **MS-01** A source MUST confine every operation to its root. A path
  that normalises to contain a `.` or `..` segment, or that would leave
  the root, is refused with status 400 before anything is read. Keys,
  ids or filesystem paths outside the root are never reachable through a
  source, whatever the request encodes.
- **MS-02** `listDirectory(dir)` returns the folders and files directly
  inside `dir` as `Entry` objects (schema `entry.json`), sorted by
  `filename`/`foldername` in code-point order; names beginning with `.`
  are hidden by default. A `dir` that does not exist is status 404; the
  root always exists.
- **MS-03** Every file entry carries `fileSize`, `editedOn` and an
  `absoluteURL` the client can fetch without credentials: either a public
  URL the backend hands out, or the server's own proxy route
  `/sources/{name}/{path}`, which MUST honour `Range` (206/416) because
  text thumbnails and media players read heads and seek (02 HTML-66c).
  Provider tokens never reach the client.
- **MS-04** A file entry SHOULD carry `dimensions` and `animated` (02
  HTML-66b) when the backend can know them for the cost of the listing or
  a bounded read; a driver documents what that read costs and lets the
  host turn it off. Text-like files (`isTextLike`) SHOULD set
  `absolutePreviewURL` to the thumbnail route `/sources/{name}/__thumb/{path}`
  unless the host supplies a preview URL (02 HTML-66c).
- **MS-05** `listTree()` returns the nested folders of the whole source
  (`tree-node.json`). A driver whose backend cannot enumerate folders
  cheaply MAY cache the tree for a short, documented time and MUST drop
  that cache after its own mutations.
- **MS-06** Mutations: `upload(dir, files)` writes each file under its
  sanitised basename and returns the fresh listing of `dir`;
  `createDirectory(dir)` is idempotent; `rename(path, name)` keeps the
  item in its directory, refuses an occupied target with 409 and returns
  the parent's listing; `remove(path)` deletes a file or a folder with
  everything in it and refuses the root with 400; `removeMany(dir, names)`
  deletes what exists, ignores what does not, and returns the listing.
- **MS-07** `zip(dir, names)` streams a zip of the named files (folders
  and missing names skipped) without buffering whole files in memory.
- **MS-08** Backend failures surface as errors with an HTTP `status`
  (400s for the client's mistakes, 502 for a provider that misbehaved,
  403 for refused credentials) and a message that does not include the
  provider's response body; the handler turns them into `{ error }` JSON.

## 2. Filesystem (`createFilesystemSource`)

- **MS-10** The root is a directory; paths resolve with `path.resolve`
  and are checked against the root after resolution (symlinks inside the
  root are followed, which the host accepts by placing them).
- **MS-11** `editedOn` is the mtime in ms; `dimensions` comes from the
  image header (`image-size`); `animated` from the first 4 MB (SVG SMIL or
  CSS animation, more than one GIF graphic control extension, APNG `acTL`,
  WebP `ANIM`).
- **MS-12** Text thumbnails render from the first 8 KB and are cached by
  path, size and mtime with a strong ETag.

## 3. S3-compatible object storage (`createS3Source`)

The second driver speaks the S3 protocol and nothing provider-specific,
so one implementation serves AWS S3, Cloudflare R2, MinIO, Backblaze B2,
DigitalOcean Spaces, Wasabi, Tigris, Garage, Ceph RGW, Supabase Storage,
Hetzner Object Storage and Google Cloud Storage in interoperability mode.
Object stores have no directories; the driver imposes the convention the
AWS console and every S3 file manager use.

- **MS-20 Folder model.** A directory is a key prefix ending in `/`. A
  folder that holds no objects exists only as a zero-byte marker object
  whose key is the prefix itself (`photos/2026/`), which
  `createDirectory` writes and listings never show as a file. The source
  MAY be confined to a prefix of the bucket (`prefix` option); paths are
  relative to it and keys outside it are unreachable (MS-01).
- **MS-21 Listing.** `listDirectory` is one ListObjectsV2 request per
  1 000 keys with `prefix` = the directory and `delimiter` = `/`: common
  prefixes are the folders, contents are the files, the marker is
  skipped. A directory other than the root that yields neither is 404.
- **MS-22 Tree.** `listTree` is one key scan of the whole prefix without
  a delimiter; every `/`-separated ancestor of every key is a folder. The
  result is cached (`treeTtl`, default 30 s) and dropped by every
  mutation. Cost: ⌈keys / 1000⌉ requests per cold tree, which is why the
  cache exists; a bucket of a million objects should either be confined
  by `prefix` or front the tree with the host's own index (future
  `tree=` query, see §5).
- **MS-23 Probing.** ListObjects reports neither dimensions nor
  animation, so by default the driver reads the first 64 KB of each
  image once (`GetObject` with `Range`), caches the result by key and
  ETag, four reads in flight at a time, and never fails a listing over a
  probe. `probe: false` turns this off for hosts that pre-compute or do
  not care; `animated` is then absent and the client treats the item as
  still.
- **MS-24 URLs.** With `publicBaseUrl` set (a public bucket, a CDN in
  front of it), `absoluteURL` is `{publicBaseUrl}/{key}` and the server
  moves no bytes. Otherwise `absoluteURL` is the proxy route and `open`
  forwards `Range` to `GetObject`, returning the provider's
  `Content-Range` so the handler answers 206 or 416 exactly as for a
  file. Presigned URLs are deliberately not used for `absoluteURL`: they
  expire inside a persisted listing and leak the signing identity's
  scope.
- **MS-25 Mutations.** Upload is `PutObject` with the multipart part's
  content type (or one from the extension). Rename is `CopyObject` then
  `DeleteObject`; renaming a folder copies every key under the old
  prefix to the new one and then deletes the old keys in one
  `DeleteObjects`, so a folder of n objects costs n + 1 requests and is
  not atomic: a failure midway leaves both prefixes, which the next
  listing shows rather than hides. Delete of a folder is a key scan plus
  `DeleteObjects` in batches of 1 000. Conflicts are checked with
  `HeadObject` (file) or a prefixed listing (folder) before copying.
- **MS-26 Thumbnails.** Text thumbnails read the first 8 KB with `Range`
  and are cached by key, ETag and size; the thumbnail ETag derives from
  the object's ETag so a replaced object invalidates it.
- **MS-27 Credentials.** The driver takes an access key pair and an
  optional session token; the CLI reads `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` and
  `AWS_ENDPOINT_URL_S3`. It does not read `~/.aws`, instance metadata or
  SSO; a host wanting those resolves them and passes the pair (rotating
  by constructing a new source). The pair needs `s3:ListBucket` on the
  bucket and `s3:GetObject`, `PutObject`, `DeleteObject` on the prefix;
  a read-only key makes a read-only source whose mutations fail with 403.

### 3.1 Transport and signing

- **MS-30** Requests are signed with Signature Version 4 (header
  authorization, `x-amz-content-sha256` of the buffered body, no chunked
  signing) by a signer of about forty lines over `node:crypto`; the
  known-answer tests reproduce the GET Object and GET Bucket examples of
  the S3 developer guide. No AWS SDK is involved anywhere in the
  packages.
- **MS-31** Keys are RFC 3986 encoded (`!'()*` included) once, in the
  path and in `x-amz-copy-source`; query strings are built the same way
  rather than with `URLSearchParams`, whose `+` for space S3 reads
  differently from what was signed.
- **MS-32** Addressing is virtual-hosted (`{bucket}.s3.{region}.amazonaws.com`)
  for AWS and path-style (`{endpoint}/{bucket}/{key}`) whenever an
  `endpoint` is given, because R2, MinIO and most compatibles expect it;
  `forcePathStyle` overrides either way.
- **MS-33** The fake S3 used by the tests (`test/fake-s3.ts`) re-derives
  the signature of every request from what it received, so an encoding
  difference between the signed canonical request and the bytes on the
  wire fails the suite instead of surfacing as a 403 from a real bucket.

### 3.2 Provider notes (informative)

Tested against the in-memory fake; the rows come from each provider's
documentation and have not yet been exercised against a live bucket.

| Provider | `endpoint` | `region` | Notes |
|---|---|---|---|
| AWS S3 | (none) | the bucket's | virtual-hosted; `publicBaseUrl` for a public bucket or CloudFront |
| Cloudflare R2 | `https://{account}.r2.cloudflarestorage.com` | `auto` | no egress fees; `publicBaseUrl` = the `r2.dev` or custom domain |
| MinIO | `http://host:9000` | any | self-hosted; the local development target |
| Backblaze B2 | `https://s3.{region}.backblazeb2.com` | e.g. `us-west-004` | folder markers are supported |
| DigitalOcean Spaces | `https://{region}.digitaloceanspaces.com` | e.g. `nyc3` | CDN endpoint as `publicBaseUrl` |
| Wasabi | `https://s3.{region}.wasabisys.com` | e.g. `us-east-1` | |
| Tigris | `https://fly.storage.tigris.dev` | `auto` | |
| Supabase Storage | `https://{project}.supabase.co/storage/v1/s3` | `{project region}` | S3 access keys from the dashboard |
| Google Cloud Storage | `https://storage.googleapis.com` | `auto` | HMAC keys, XML API interoperability; `DeleteObjects` is not supported there, so folder deletes fall back to one request per key (follow-up) |

Azure Blob Storage is not S3-compatible and needs a driver of its own.

## 4. Cloud drives: Google Drive, Dropbox, Box (not yet built)

The same `MediaSource` contract fits them; what differs is identity,
authentication and what a listing gives for free. These are the design
decisions a driver makes, recorded before any is written.

| | Google Drive | Dropbox | Box |
|---|---|---|---|
| Addressing | opaque file ids; names not unique in a folder | paths (`path_display`, case-insensitive `path_lower`) | ids; names unique per folder, case-insensitive |
| Path → item | resolve segment by segment with `'{parent}' in parents and name = …`, cache ids by path | direct | resolve by walking folder items, cache ids by path |
| Auth | OAuth 2.0 user consent, or a service account (domain-wide delegation for Workspace) | OAuth 2.0 app with refresh token | OAuth 2.0, or JWT server authentication for an app user |
| Listing | `files.list` with `q`, `pageToken`, `fields` incl. `imageMediaMetadata`, `size`, `modifiedTime` | `files/list_folder` + `/continue`, `include_media_info` for photo dimensions | `GET /folders/{id}/items` with `offset`/`marker`, `fields` |
| Dimensions | free (`imageMediaMetadata.width/height`) | free for photos (`media_info`) | not in the listing: representations API or a probe (MS-23) |
| Thumbnails | `thumbnailLink` (expires, needs auth) → proxy | `files/get_thumbnail_batch` → proxy | `GET /files/{id}/thumbnail.png` → proxy |
| Bytes | `files.get?alt=media`, `Range` honoured | `files/download`, `Range` honoured | `GET /files/{id}/content` (302 to an expiring URL), `Range` honoured |
| Rename | `files.update { name }` | `files/move_v2` | `PUT /files/{id} { name }` |
| Delete | `files.update { trashed: true }` (trash) | `files/delete_v2` (recoverable 30–180 days) | `DELETE /files/{id}` (trash) |
| Folder delete | one call (trash the folder) | one call | `DELETE /folders/{id}?recursive=true` |
| Rate limits | per-user and per-project quotas; batch endpoint | per-app, `Retry-After` | ~1 000 req/min per user, `Retry-After` |
| Native documents | Docs/Sheets/Slides have no bytes: `export` (PDF) or list as `document` kind without a URL | Paper docs similar | none |

What follows from the table, as proposed rules for those drivers:

- **MS-40** A drive driver keeps its own path ↔ id map, populated by the
  listings it performs and invalidated by its own mutations, and never
  exposes provider ids in `Entry.path`; two items with the same name in
  one Drive folder are disambiguated deterministically (the later one
  gets ` (2)` appended in the listing, the id map remembers which is
  which) so the path model stays total.
- **MS-41** `absoluteURL` is always the proxy route (MS-03): every drive
  hands out expiring, credentialed download links. `open` forwards
  `Range`.
- **MS-42** Delete uses the provider's trash where one exists (Drive,
  Box) rather than permanent deletion; the API's `DELETE` remains
  `remove`.
- **MS-43** The tree is built lazily: `listTree` returns the top-level
  folders with `children` absent, and a `tree={cd}` query on the source
  (API addition) returns one level. This is the one place the API needs
  to grow; the S3 driver's full scan (MS-22) is the reason the same
  addition helps buckets too.
- **MS-44** Tokens are refreshed by the driver and stored by the host
  (the driver takes `getToken(): Promise<string>`), never written by the
  reference server to disk.

Which to build first: Dropbox is the cheapest (path-based, free
dimensions, Range on download) and proves the OAuth plumbing; Google
Drive has the most users and the hardest identity model; Box is Drive's
model with unique names. None is scheduled.

## 5. Open items

- `tree={cd}` lazy tree query (MS-43) and the client's support for nodes
  without `children`.
- A browser/Worker build of the SigV4 signer (WebCrypto instead of
  `node:crypto`) so a host-supplied API client (07 STATE-51) can talk to
  a bucket directly with scoped, short-lived STS credentials; the
  `thumbnails: "client"` path already covers previews in that setup.
- Live verification of §3.2 against R2 and MinIO.
- Google Cloud Storage lacks `DeleteObjects`: fall back per key when the
  provider answers 400/501.
