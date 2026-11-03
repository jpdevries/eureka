# 11. Media sources

Status: draft. The contract a storage backend satisfies to appear as a
media source (01 §1), the four drivers the reference server ships
(filesystem, S3-compatible storage, Google Drive, WebDAV), and the
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
  host turn it off. A large original the source has no preview for yet
  SHOULD still report `dimensions`, so the row reserves a box of the
  right shape (04 LAY-51) instead of an `<img>` the browser cannot
  decode (02 HTML-66e). Text-like files (`isTextLike`) SHOULD set
  `absolutePreviewURL` to the thumbnail route `/sources/{name}/__thumb/{path}`
  unless the host supplies a preview URL (02 HTML-66c).
- **MS-04a** A backend that can picture a file (a thumbnail service, a
  drive's own renderer) SHOULD serve that picture at
  `/sources/{name}/__preview/{path}?w={width}` through `preview(p,
  { width, ifNoneMatch })` with a strong ETag and 304s, point
  `absolutePreviewURL` at it, and offer the same picture at a few widths
  in `renditions` so the row renders `srcset` (02 HTML-66a). This is how
  a 200 MB TIFF becomes a 30 KB row: the browser never sees the
  original until Expand. Text files keep their SVG thumbnail (MS-04).
- **MS-04b** `createdOn` comes from the backend where it has one: the
  filesystem's birth time, Drive's `createdTime`, WebDAV's `creationdate`
  (requested in the PROPFIND). S3-compatible storage keeps no creation
  time, so its entries carry none and a `created:` filter never matches
  them: not a bug. `location` (01 CON-05) is read only when the source
  option `location` is set: Drive asks for `imageMediaMetadata.location`,
  the filesystem, S3 and WebDAV parse the EXIF GPS block of JPEG and TIFF
  heads inside the 64 KB probe with a dependency-free reader; the source
  then lists `capabilities.location`.
- **MS-05** `listTree(cd, depth)` returns the subfolders of `cd` (default
  the root) `depth` levels deep (`tree-node.json`); the handler's
  `treeDepth` (default 3) applies when the request names none. A node at
  the cut-off omits `children`; a node with no subfolders has
  `children: []`. A driver whose backend cannot enumerate folders cheaply
  MAY cache levels for a short, documented time and MUST drop that cache
  after its own mutations. `cd` that does not exist is 404.
- **MS-06** Mutations: `upload(dir, files)` writes each file under its
  sanitised basename and returns the fresh listing of `dir`;
  `createDirectory(dir)` is idempotent; `rename(path, name)` keeps the
  item in its directory, refuses an occupied target with 409 and returns
  the parent's listing; `remove(path)` deletes a file or a folder with
  everything in it and refuses the root with 400; `removeMany(dir, names)`
  deletes what exists, ignores what does not, and returns the listing.
- **MS-07** `zip(dir, names)` streams a zip of the named files (folders
  and missing names skipped) without buffering whole files in memory.
- **MS-09** A source carries `capabilities` (01 CON-04) when it cannot
  offer every mutation: declared by the host (`readOnly: true`, or the
  fields one by one) or learnt. A driver whose backend refuses a write
  with 403 MUST set every capability to `false` from then on, so the next
  source list, and with it the controls, reflect what the credentials can
  do; the handler refuses a declared-unavailable mutation with 403 and a
  message naming the source and the action, without asking the backend.
- **MS-08** Backend failures surface as errors with an HTTP `status`
  (400s for the client's mistakes, 502 for a provider that misbehaved,
  403 for refused credentials) and a message that does not include the
  provider's response body; the handler turns them into `{ error }` JSON.

## 2. Filesystem (`createFilesystemSource`)

- **MS-10** The root is a directory; paths resolve with `path.resolve`
  and are checked against the root after resolution (symlinks inside the
  root are followed, which the host accepts by placing them). The tree is
  a `readdir` walk cut at `depth`.
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
- **MS-22 Tree.** `listTree(cd, depth)` is one delimiter listing per
  folder, breadth first, four in flight, `depth` levels down; never a
  scan of every key. Levels are cached by `cd` and `depth` (`treeTtl`,
  default 30 s) and the cache is dropped by every mutation. Cost: one
  request per folder within reach of `depth` (plus continuation pages
  past 1 000 entries), independent of how many objects the bucket holds,
  which is what makes a million-object bucket browsable.
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
  a read-only key makes a read-only source: declare it with `readOnly`
  so the controls never appear, or let the first 403 flip the
  capabilities (MS-09). The demo's env files take `EUREKA_S3_READ_ONLY=1`.

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
- **MS-31a** Requests ask for `Accept-Encoding: identity`. A runtime's
  fetch otherwise negotiates gzip, inflates the body and drops
  `Content-Length`, so an object's size reads as 0 and a `Range` answer
  is no longer the stored bytes; seen on R2 with a JSON object.
- **MS-32** Addressing is virtual-hosted (`{bucket}.s3.{region}.amazonaws.com`)
  for AWS and path-style (`{endpoint}/{bucket}/{key}`) whenever an
  `endpoint` is given, because R2, MinIO and most compatibles expect it;
  `forcePathStyle` overrides either way.
- **MS-33** The fake S3 used by the tests (`test/fake-s3.ts`) re-derives
  the signature of every request from what it received, so an encoding
  difference between the signed canonical request and the bytes on the
  wire fails the suite instead of surfacing as a 403 from a real bucket.

### 3.2 Provider notes (informative)

Verified live: AWS S3 (region discovered from the redirect, probing,
Range, text thumbnails) and Cloudflare R2 (`pantry-host-videos`: tree,
58 root objects and 28 posters with probed dimensions, Range on video,
thumbnails, 404s, and a read-only token refusing `PutObject` with 403 as
MS-27 says). The other rows come from each provider's documentation.

| Provider | `endpoint` | `region` | Notes |
|---|---|---|---|
| AWS S3 (verified) | (none) | the bucket's, or blank: corrected from the redirect | virtual-hosted; `publicBaseUrl` for a public bucket or CloudFront |
| Cloudflare R2 (verified) | `https://{account}.r2.cloudflarestorage.com` | `auto` | no egress fees; `publicBaseUrl` = the `r2.dev` or custom domain; token scoped per bucket, Object Read only for a browse-only source |
| MinIO | `http://host:9000` | any | self-hosted; the local development target |
| Backblaze B2 | `https://s3.{region}.backblazeb2.com` | e.g. `us-west-004` | folder markers are supported |
| DigitalOcean Spaces | `https://{region}.digitaloceanspaces.com` | e.g. `nyc3` | CDN endpoint as `publicBaseUrl` |
| Wasabi | `https://s3.{region}.wasabisys.com` | e.g. `us-east-1` | |
| Tigris | `https://fly.storage.tigris.dev` | `auto` | |
| Supabase Storage | `https://{project}.supabase.co/storage/v1/s3` | `{project region}` | S3 access keys from the dashboard |
| Google Cloud Storage | `https://storage.googleapis.com` | `auto` | HMAC keys, XML API interoperability; `DeleteObjects` is not supported there, so folder deletes fall back to one request per key (follow-up) |

Azure Blob Storage is not S3-compatible and needs a driver of its own.

## 4. Google Drive (`createGoogleDriveSource`)

Drive is the first cloud drive driver. It addresses files by opaque id,
allows several items with one name in a folder, has documents with no
bytes of their own, and hands out expiring download links, so most of
the work is holding the path model together (MS-40..MS-44 below are the
general cloud-drive rules; MS-50..MS-55 are Drive's).

- **MS-40** A drive driver keeps its own path ↔ id map, populated by the
  listings it performs and dropped by its own mutations, and never
  exposes provider ids in `Entry.path`. Two items with the same display
  name in one folder are disambiguated deterministically: sorted by
  creation time then id, the second gets ` (2)` before its extension,
  the third ` (3)`, so the path model stays total and stable between
  listings.
- **MS-41** `absoluteURL` is always the proxy route (MS-03): every drive
  hands out expiring, credentialed download links. `open` forwards
  `Range`.
- **MS-42** Delete uses the provider's trash where one exists rather than
  permanent deletion (Drive: `trashed: true`); `permanentDelete: true`
  opts out. The API's `DELETE` remains `remove`.
- **MS-43** (built) the depth-limited tree, §1 MS-05.
- **MS-44** The driver takes `getToken(): Promise<string>` and never sees
  a refresh token or key file; the host builds the provider. The
  reference server ships two without a client library: a service
  account (RS256 JWT bearer grant signed with `node:crypto`, optional
  `subject` for domain-wide delegation) and a user's refresh token.
  Tokens are cached until a minute before they expire; a refused grant
  is a 403.
- **MS-50 Names.** A `/` in a Drive name shows as U+2215 DIVISION SLASH
  in paths and filenames; a rename containing `/` is refused (400). An
  upload with such a name is stored with the slash replaced.
- **MS-51 Listing.** One `files.list` per 1 000 children with
  `'{id}' in parents and trashed = false` (and the folder MIME type for
  the tree), `supportsAllDrives`, following `nextPageToken`. `fileSize`
  is `size`, `editedOn` is `modifiedTime`, `dimensions` is
  `imageMediaMetadata` (free; Drive computes neither it nor a thumbnail
  for images above about 50 MB, so such originals list without
  `dimensions` and render as the skeleton tile of 02 HTML-66e at 4:3
  unless a driver reads the header itself), `animated` is a 64 KB head probe of
  GIF/SVG/PNG/WebP only, cached by id and checksum. Listings are cached
  `cacheTtl` (30 s) and dropped by mutations.
- **MS-52 Native documents.** Docs, Sheets, Slides, Drawings, Forms, Jams,
  Sites and Apps Script files have no bytes. They list with `fileSize: 0`
  and the extension Drive for desktop uses (`.gdoc`, `.gsheet`,
  `.gslides`, `.gdraw`, `.gform`, `.gjam`, `.gsite`, `.gscript`), which
  never reaches Drive on rename. `open` exports them (PDF; PNG for a
  drawing; JSON for a script) whole, without `Range`, within Google's
  10 MB export limit. They have no text thumbnail.
- **MS-53 Shortcuts.** A shortcut lists as its target: a folder shortcut
  is a folder, a file shortcut shows the target's size, dimensions and
  bytes. Rename and delete act on the shortcut itself. A dangling
  shortcut is not shown.
- **MS-54 Mutations.** Upload is a multipart create into the folder; an
  upload whose name matches an existing ordinary file replaces that
  file's bytes (one id, no duplicate), as a filesystem would. Create
  directory is idempotent. Rename is a metadata patch and refuses an
  occupied name with 409. Delete trashes (MS-42). Shortcuts and native
  documents are never overwritten by an upload.
- **MS-56 Previews.** Drive renders a thumbnail for most images (TIFF,
  PSD and RAW included), videos, PDFs and its own documents, exposed as
  `hasThumbnail`, a short-lived signed `thumbnailLink` sized by its
  `=s{n}` suffix, and `thumbnailVersion`. The source serves it through
  the preview route (MS-04a) at 64–1600 px as JPEG (quality 80, Google's
  `-rj-l80` flags; Drive's default PNG is four times the size) or WebP
  (`?f=webp`) or PNG (`?f=png`), with `"p-{version}-{width}-{format}"`
  as the ETag, and lists JPEG renditions at 220, 440 and 880 px, never
  wider than the picture itself, for the row's `srcset` (02 HTML-66a).
  WebP is not offered as a rendition: Google renders it lossless, about
  four times the JPEG, so a `<picture>` would cost more than it saves. The link is on another host, so the bearer
  token is never sent with it; an expired link (403) is replaced once
  from fresh metadata. Files Drive has not pictured preview as
  themselves.
- **MS-55 Scope.** The root is `rootFolderId` (default `root`, the
  account's My Drive) or a shared drive (`driveId`, `corpora=drive`).
  A `drive.readonly` scope or a refused write turns the source read-only
  (MS-09); `readOnly: true` declares it up front. A service account sees
  only what is shared with it, which is the recommended way to expose
  one folder: share the folder with the service account's address.

### 4.1 Dropbox and Box (not yet built)

The same contract fits them; what differs is identity, authentication
and what a listing gives for free.

| | Dropbox | Box |
|---|---|---|
| Addressing | paths (`path_display`, case-insensitive `path_lower`) | ids; names unique per folder, case-insensitive |
| Path → item | direct | resolve by walking folder items, cache ids by path (MS-40) |
| Auth | OAuth 2.0 app with refresh token | OAuth 2.0, or JWT server authentication for an app user |
| Listing | `files/list_folder` + `/continue`, `include_media_info` for photo dimensions | `GET /folders/{id}/items` with `offset`/`marker`, `fields` |
| Dimensions | free for photos (`media_info`) | not in the listing: representations API or a probe (MS-23) |
| Bytes | `files/download`, `Range` honoured | `GET /files/{id}/content` (302 to an expiring URL), `Range` honoured |
| Rename | `files/move_v2` | `PUT /files/{id} { name }` |
| Delete | `files/delete_v2` (recoverable 30–180 days) | `DELETE /files/{id}` (trash) |
| Folder delete | one call | `DELETE /folders/{id}?recursive=true` |
| Rate limits | per-app, `Retry-After` | ~1 000 req/min per user, `Retry-After` |

Dropbox is the cheaper of the two (path-based, free dimensions, Range on
download); Box is Drive's model with unique names. Neither is scheduled.

## 5. WebDAV (`createWebDavSource`)

One driver for every server that speaks RFC 4918: Nextcloud and ownCloud,
Synology and QNAP, Fastmail Files, Apache `mod_dav`, nginx, SabreDAV,
Box's and Dropbox's legacy WebDAV bridges. The protocol already has
folders, so there is no model to impose; the work is tolerance.

- **MS-60 Addressing.** The source is confined to one collection URL;
  paths are relative to it and hrefs outside it in a multistatus are
  dropped (MS-01). Collections are requested with a trailing slash, as
  servers expect. Dotfiles are hidden.
- **MS-61 Listing and tree.** `PROPFIND` with `Depth: 1` asking for
  `resourcetype`, `getcontentlength`, `getlastmodified`, `getetag`,
  `getcontenttype` and `displayname` is the listing of a directory and
  one level of the tree; a `Depth: 0` request is a stat. The parser
  ignores namespace prefixes (`D:`, `d:`, a default namespace) and reads
  the `200` propstat. No server gives image dimensions, so the 64 KB
  head probe of MS-23 applies, cached by ETag. Tree levels are cached
  `treeTtl` (30 s) and dropped by mutations.
- **MS-62 Mutations.** Upload is `PUT` into an existing collection (404
  before any byte when it is missing); create directory is `MKCOL`, with
  the server's 405 for "exists" accepted (MS-06); rename is `MOVE` with
  `Overwrite: F`, so a 412 is the 409 conflict; delete is `DELETE`,
  which removes a collection and everything in it in one request.
- **MS-63 Auth.** Basic auth (a username and, on Nextcloud and friends,
  an app password rather than the account password) or a bearer token.
  A 401 or 403 on a mutation turns the source read-only (MS-09).
- **MS-64 Errors.** 405/409/412/423 map to 409, 507 stays 507 (quota),
  401/403 to 403, other 4xx to 400, 5xx to 502; the server's response
  body is reduced to one line of text in the message.
- **MS-65 Previews.** On a Nextcloud files URL
  (`/remote.php/dav/files/{user}/…`, detected, or `nextcloudPreviews`
  set) images, videos, PDFs, TIFF, PSD and HEIC preview through
  `index.php/core/preview` via the preview route (MS-04a), with JPEG
  renditions at 220/440/880 px; the ETag derives from the file's
  `getetag`. Other servers preview images as themselves.

## 6. Open items

- The tree's polling interval (`intervals.updateSourceTree`) re-fetches
  the root levels only; branches opened by hand are not refreshed.
- A browser/Worker build of the SigV4 signer (WebCrypto instead of
  `node:crypto`) so a host-supplied API client (07 STATE-51) can talk to
  a bucket directly with scoped, short-lived STS credentials; the
  `thumbnails: "client"` path already covers previews in that setup.
- Live verification of §5 against a Nextcloud or Synology instance, and of
  §3.2 against MinIO (R2 and AWS done). §4 was run
  against a real folder (service account, read-only share): listing,
  tree, previews, ranges, 403; Drive had not yet pictured four TIFFs over
  60 MB, so whether it ever does for files that size is open.
- Drive change notifications (`changes.list`) to refresh listings; today
  the 30 s cache and mutations are the only refresh.
- Google Cloud Storage lacks `DeleteObjects`: fall back per key when the
  provider answers 400/501.
