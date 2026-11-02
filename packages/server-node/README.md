# @mrktps/eureka-server

Reference implementation of the Eureka REST API (`spec/api/openapi.yaml`)
over directories on disk, plus the Level 0 form protocol (`spec/03`) with a
pluggable page renderer. Plain `node:http`; no framework.

```bash
eureka-server --root ./media --name filesystem --port 3000 --base-path / --static ./public
```

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
- `createEurekaHandler` is a `(req, res) => Promise<boolean>` you can mount
  in any Node server. It owns `{basePath}/media/...`, `/sources/{name}/...`,
  and, when `renderPage` is given, `GET`/`POST {basePath}`.
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
