# Eureka demo site

The pages behind the plan's "demo site": the reference server from
`@mrktps/eureka-server` serving generated sample media, with one page per
way of using Eureka 3.

```bash
npm install
npm run build          # packages (tsc, esbuild bundles) and the React demo bundle
npm run demo           # http://127.0.0.1:3100/
```

Or from this directory: `npm run build && npm start [-- --port 3100]`.

| Page | What it shows |
|---|---|
| `/` | Landing page: the three levels, install snippets |
| `/browser/` | Server-rendered Level 0 form wrapped in `<eureka-browser>` and enhanced by the bundle. Works with JavaScript disabled (`?path=photos` navigates; the form posts back). |
| `/client.html` | An empty `<eureka-browser api="/browser/">` that fetches everything itself |
| `/react.html` | `@mrktps/eureka-react`: `<EurekaBrowser>` with a side panel driven by `useEurekaState`, the element's methods, and prop changes that restart the instance |
| `/embed.html` | The editor pattern: the browser inside a host `<dialog>`, inserting what was chosen |

The REST API is at `/browser/media/` (two sources: `library`, the
generated media, and `uploads`, empty at first). Files are served under
`/sources/{name}/`.

## Sample media

`scripts/seed-media.mjs` writes `apps/demo/media/` (gitignored) on first
start: SVG "photos" in several aspect ratios, logos, a Markdown file, a
JSON file, a small PDF and a short WAV clip. It is deterministic. Use
`npm run seed -- --force` to regenerate after experimenting.

## Files

- `server.mjs` the site: static pages, the handler, the page renderer for `/browser/`
- `build.mjs` esbuild for `src/react-demo.tsx` → `public/assets/js/react-demo.js` (gitignored), with the workspace packages aliased to their sources
- `public/` the pages and `assets/demo.css`
