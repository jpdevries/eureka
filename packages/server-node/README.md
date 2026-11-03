# @mrktps/eureka-server

Reference implementation of the Eureka REST API (`spec/api/openapi.yaml`)
over directories on disk, an S3-compatible bucket or a Google Drive
folder (spec 11, media sources), plus the Level 0 form protocol (`spec/03`) with a pluggable page
renderer. Plain `node:http`; no framework, no cloud SDK.

```bash
eureka-server --root ./media --name filesystem --port 3000 --base-path / --static ./public
```

An S3-compatible bucket (AWS S3, Cloudflare R2, MinIO, Backblaze B2,
DigitalOcean Spaces, Wasabi, Tigris, …) as a source, alone or beside
directories, with the credentials in the usual AWS variables:

```bash
AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… \
eureka-server --s3-bucket media --s3-region auto \
  --s3-endpoint https://ACCOUNT.r2.cloudflarestorage.com \
  --s3-prefix library --s3-public-url https://cdn.example.com --render --enhance
```

`--s3-endpoint` (or `AWS_ENDPOINT_URL_S3`) is what makes it talk to a
non-AWS provider; path-style addressing is the default there (`--s3-path-style`
forces it for AWS). `--s3-prefix` confines the source to a "folder" of the
bucket. `--s3-public-url` makes entries link to a public bucket or CDN so the
server never proxies bytes; without it the server streams objects at
`/sources/{name}/{path}`, honouring `Range`. `--s3-no-probe` skips the 64 KB
head read per image that provides `dimensions` and `animated`. `--s3-name`
names the source (default: the bucket).

Programmatic:

```ts
import { createFilesystemSource, startServer } from '@mrktps/eureka-server';

await startServer({
  sources: [createFilesystemSource({ id: 0, name: 'filesystem', root: './media' })],
  basePath: '/assets/components/eureka/',
  renderPage: async (ctx) => renderEurekaForm(ctx), // the HTML layer, Phase 3
  staticDir: './public',
  port: 3001
});
```

- `createFilesystemSource` implements `MediaSource`: tree, listing with image
  dimensions, upload, create, rename, delete, zip, and file serving. Paths
  are confined to the root; dotfiles are hidden; URLs are percent-encoded.
- `createS3Source({ bucket, region, endpoint, prefix, credentials, publicBaseUrl, probe })`
  implements the same interface over ListObjectsV2 / Get / Put / Copy /
  Delete with a built-in Signature Version 4 signer (`S3Client`, ~150 lines,
  `node:crypto` and `fetch`). Directories are key prefixes; an empty folder
  is a zero-byte `{path}/` marker object; rename is copy + delete; the folder
  tree comes from one key scan, cached for `treeTtl` (30 s) and dropped on
  every mutation; `dimensions` and `animated` come from the first 64 KB of
  each image, once per ETag. See `spec/11-media-sources.md` for the model
  and what it costs.
- `createGoogleDriveSource({ getToken, rootFolderId | driveId, readOnly, permanentDelete })`
  browses a Drive folder or shared drive through the Drive v3 REST API with
  `createServiceAccountToken` (RS256 JWT, `node:crypto`) or
  `createRefreshTokenProvider`; no Google client library. Drive's ids and
  duplicate names become a path model (later duplicates get ` (2)`, a `/`
  in a name shows as `∕`), Docs/Sheets/Slides appear as `.gdoc`/`.gsheet`/
  `.gslides` and export as PDF when opened, shortcuts show their target,
  rename is a metadata patch, delete goes to the trash, uploads over a
  same-named file replace its bytes. CLI: `--gdrive-folder <id|root>` or
  `--gdrive-drive <id>`, `--gdrive-name`, `--gdrive-read-only`, credentials
  from `GOOGLE_APPLICATION_CREDENTIALS` (service-account JSON),
  `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_PRIVATE_KEY`, or `GOOGLE_CLIENT_ID`
  + `GOOGLE_CLIENT_SECRET` + `GOOGLE_REFRESH_TOKEN`. Drive's own thumbnails
  (TIFF, video, PDF, documents) are served at
  `/sources/{name}/__preview/{path}?w=` with renditions at 220/440/880 px
  for `srcset`, so rows never load the original. Tested against
  `test/fake-gdrive.ts`, which verifies the JWT's signature.
- All three sources take `readOnly: true` (or `capabilities: { delete: false, … }`),
  listed with the source so clients drop the controls (spec 01 CON-04);
  the handler answers 403 to anything a source does not allow. The S3
  source also turns read-only by itself after the bucket's first 403.
- `createEurekaHandler` is a `(req, res) => Promise<boolean>` you can mount
  in any Node server. It owns `{basePath}/media/...`, `/sources/{name}/...`,
  and, when `renderPage` is given, `GET`/`POST {basePath}`. Trees are
  returned `treeDepth` levels at a time (default 3; `?depth=` and
  `?tree={cd}` fetch more, spec 11 MS-43) and the rendered page always
  carries the branch to the current directory.
- Errors are JSON `{ error }` with 4xx/5xx status codes.
- `createDefaultRenderer({ enhance })` renders the Level 0 page in the
  request locale (`?ln=` or `Accept-Language`) from the catalogs in
  `@mrktps/eureka-core/i18n`, embeds a non-English catalog for the element and
  sets `lang` on the element host (spec 09 I18N-12). `cssAssets()`,
  `elementAssets()` and `i18nAssets()` give the asset paths to serve
  (`/assets/css/eureka.css`, `/assets/js/eureka-browser.js`,
  `/assets/i18n/{lang}.json`); the CLI's `--render` and `--enhance` use them.

`test/server.test.ts` is the contract test: it validates every response
against the spec schemas and exercises the no-JS protocol.
`test/s3-source.test.ts` runs the same contract over `test/fake-s3.ts`, an
in-memory S3 that re-derives every request's SigV4 signature from what it
received, plus the signer's known-answer tests from the S3 developer guide.
