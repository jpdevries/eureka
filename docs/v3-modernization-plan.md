# Eureka v3: Modernization Assessment and Plan

Status: direction agreed 2026-11-01 (element-first, same repo on branch `v3`,
PHP templates deferred, no JS masonry). Phase 1 (spec seed) is in progress
under `spec/`.
Date: 2026-11-01. Baseline: `release-2.0` at v0.0.129 (last commit August 2017).

## 1. What v2 actually is

Eureka 2.0 is a React 15 / Redux 3 component (`client/src`) plus an Express
reference server (`server.js`) that does two jobs: serve the REST API against
a filesystem media source, and server-render the component so the page works
with no JavaScript. The build is Create React App plus Grunt (Sass, SVG
sprite, Modernizr, Webpack UMD bundles) plus Bower. Node 6 is pinned.

Eureka 1.x (2015, TypeScript, pre-React) is also in git history and is where
the Web Worker pattern lived: three dedicated workers (`listsources`,
`listsource`, `listdirectory`) did the XHR and `JSON.parse` off the main
thread and posted parsed data back. 2.0 dropped them and never replaced them.

### 1.1 The design that must survive

These are the things you spent the time on. They are the real asset and they
are all framework-independent.

**HTML-first, one DOM for every mode.** The whole media listing is one
semantic `<table>`: `thead` with sortable `th`s carrying `aria-sort`, `tbody`
of focusable `tr`s, each row holding media, filename, a context-actions cell,
dimensions, file size and edited-on. All five layout modes (table, thumb,
grid, list, masonry) are the same DOM re-flowed by CSS. Rows are
`display: grid` with named `grid-template-areas`; the mode class on the root
(`eureka__view-mode__*`) swaps the areas and column tracks; thumb/grid/masonry
hide the non-media cells and let rows flow as flex items. Mobile collapses
each row to media / name / actions stacked. Server-side rendering adds a
radio column and reorders areas (`radio media name ...`). This is in
`client/src/scss/layout/_layout.scss` and is worth porting almost
line-for-line into modern CSS.

**The no-JavaScript protocol.** Without script the component is a single
`<form method="POST" enctype="multipart/form-data">` posted to `basePath`.
Field names are the contract: `eureka__uploadFiles` (multiple file input),
`eureka__chosen_item` (radio per row), `eureka__media-browser_{uid}__browsing`
(a `<select>` of `source||directory` pairs), `eureka__upload-dir`,
`eureka__mediaSourceId`. Browse, upload and choose work this way. Everything
else is enhancement.

**Accessibility text and structure.** Every control has visible or
visually-hidden text that names its object ("Choose schildpad.jpg", "upload
some files to /assets/img"). Rows get a generated description when the API
supplies no alt text ("displays at 336x125, weighs 37 KB, and was edited on
..."). Folder tree uses native `<details>/<summary>`. Live regions announce
fetch, empty and no-results states. Three accessible themes (default, black
on white, white on black) are pure CSS custom property overrides, and the
same overrides were wired to `-ms-high-contrast`.

**Keyboard map.** Twenty-odd shortcuts (sidebar toggle, view modes 1-5,
sources alt+0-9, sort by column, choose single/multiple, invert, deselect,
upload, new directory, rename, delete, filter). Listed in the README. This is
data, not code.

**Theming surface.** 25 CSS custom properties, 14 of them documented
(`--active`, `--border-*`, `--button-*`, `--color`, `--dangerous`,
`--light-bg`, `--link-color`, `--panel-border-color`, `--subtle`,
`--very-subtle`, `--very-subtle-icon-opacity`) plus undocumented ones
(`--notification-*`, `--tree-line-height`, `--media-cell-background`,
`--bg-color`, `--active-darker`, `--border-shadow-color`).

**REST API.** Documented on the wiki and implemented in `server.js`:

| Verb | Path | Purpose |
|---|---|---|
| GET | `media/sources/` | list media sources |
| GET | `media/sources/:id` | directory tree of a source |
| GET | `media/sources/:id?path=` | listing of one directory (files + folders) |
| POST | `media/sources/:id?path=` | upload files (multipart) |
| PUT | `media/sources/:id?path=` | create directory |
| PUT | `media/sources/:id?path=&name=` | rename file or directory |
| DELETE | `media/sources/:id?path=` | delete one item |
| DELETE | `media/sources/:id` (multipart `delete_file[]`, `cd`) | delete many |
| POST | `media/attachments/:id` (multipart `zip_file[]`, `cd`, `cs`) | zip download |

Item shape: `filename, directory, path, absoluteURL, absolutePreviewURL?,
dimensions?, fileSize, editedOn, alt?`. Folder shape: `name, cd, children?`.
Mutations return the refreshed directory listing.

**Feature matrix.** The README's support table (what works with no JS, what
needs script) is already a spec in prose. It transfers directly.

**Persistence.** `localStorage` under `storagePrefix` for current directory,
view mode, sort, open tree nodes, cached listing, so the UI paints instantly
on return before the network answers.

**i18n.** ~120 ICU messages in `client/i18n/locales/en.json`, Crowdin
project, locale loaded at runtime.

### 1.2 What does not transfer

The implementation. React 15 lifecycle methods, `react-addons-update`,
`react-tap-event-plugin`, Mousetrap bound globally per row, `document.*`
queries from inside components (tagged `#janky` in the source), Node `path`
in the browser, Grunt, Bower, CRA, Babel 6, Masonry-in-a-tbody, the polyfill
set, and the HTML5 `<menu type="context">` API (removed from browsers). None
of it is worth upgrading in place; the gap from React 15 to 19 is a rewrite
regardless. Tests are shallow snapshot tests and also do not transfer.

A few v2 behaviors are worth fixing in the rewrite rather than preserving:
`role="grid"` on a table that does not implement grid keyboard navigation,
`aria-live` on the `tbody` itself, duplicate `role` attributes, every row
binding Backspace/Enter globally on mount, `aria-hidden` instead of `inert`
behind modals, and `eval`-style `javascript:` hrefs in the demo.

## 2. Frameworks: what to support

**Recommendation: ship a framework-agnostic core and a vanilla custom element
as the one required target. Treat React as a thin adapter. Add Vue/Svelte
adapters only on demand, generated from the same contract.**

Reasons:

- The HTML-first design already is framework-agnostic. The server renders a
  form; script enhances it. A custom element (`<eureka-browser>`) is the
  modern equivalent of the v2 UMD bundle and hydrates that existing markup
  in place. Light DOM, not shadow DOM, so the global stylesheet, theming
  custom properties, forms and `#fragment` links keep working.
- React 19 supports custom elements fully (properties, events), as do Vue
  and Svelte. A typed React wrapper is ~100 lines and exists for
  ergonomics, not function.
- It keeps the bundle honest. v2 was 76 kB gzipped mostly because React and
  Redux were inside it. The core (state, API client, sort/filter/format,
  keyboard map) has no DOM dependency and is a few kB.
- It makes the spec enforceable: one conformance suite runs against every
  adapter because they all produce the same DOM.

Not recommended: React-first again. It re-couples the design to one
framework's lifecycle, which is exactly what aged v2 out.

Decision needed from you: agree with custom-element-first, or do you want
React to remain the primary published artifact for MODX / existing users?

## 3. Spec-driven development

Yes, this can be articulated as a framework-agnostic spec, and the spec
should be executable, not just prose. Proposed layout:

```
spec/
  README.md                 index, conformance levels, versioning
  01-concepts.md            source, directory, item, selection, view
  02-html-contract.md       the DOM: elements, classes, roles, ids, names
  03-no-js-protocol.md      form fields, POST semantics, server responses
  04-layout-modes.md        the five modes, grid areas, breakpoints, container queries
  05-keyboard.md            shortcut table + focus management rules
  06-accessibility.md       names, descriptions, live regions, themes, forced-colors
  07-state.md               state shape, events, transitions, persistence keys
  08-theming.md             custom property registry with defaults
  09-i18n.md                message ids, ICU, locale loading
  10-performance.md         worker contract, budgets (bundle, INP, first paint from cache)
  api/openapi.yaml          the REST API, formalized (OpenAPI 3.1)
  schema/*.json             item, folder, source, config, state, keymap, theme tokens
  fixtures/                 fakepi JSON, sample listings large and small, locales
  conformance/              Playwright + axe-core suite that drives ANY implementation by role/name
```

How it works in practice:

- **Prose specs use RFC 2119 language** (MUST / SHOULD / MAY) and each
  requirement has an id (`HTML-12`, `KEY-04`) that a conformance test
  references. The feature matrix from the README becomes the definition of
  conformance levels: Level 0 = no-JS form works; Level 1 = enhanced browse,
  choose, upload; Level 2 = full (crop, multi-select, zip, masonry).
- **Data files are the source of truth** where possible: the keymap, theme
  tokens, message catalog, API schemas and config options are JSON/YAML and
  are imported by the implementation and by the docs. No drift.
- **The conformance suite is the "driver".** It boots a reference server on
  the fixtures, loads a page that embeds an implementation, and asserts
  behavior through the accessibility tree (`getByRole('row', {name: ...})`),
  not CSS classes. Runs with JS disabled for Level 0, then enabled. axe-core
  runs on every state. Any adapter (vanilla element, React wrapper, a PHP
  render of the HTML layer) is conformant if it passes.
- **Server implementers get a contract too.** The OpenAPI document plus a
  Schemathesis-style API test lets a MODX/PHP or Python backend verify
  itself without touching the UI.

Suggested order: write `02-html-contract`, `03-no-js-protocol` and
`04-layout-modes` first, directly from v2's rendered output (we can run v2
and snapshot its DOM to seed them). Those three plus the OpenAPI file are
enough to start the core.

## 4. Preserving the layout system

Port the mechanism, upgrade the primitives.

| v2 | v3 |
|---|---|
| Sass + Bourbon/Neat mixins | Native CSS nesting, `@layer eureka.base, eureka.layout, eureka.theme` so host pages can override cleanly |
| Viewport media queries (`$mobile` at 40em) | Container queries on the component root. The same instance can be a sidebar panel or full screen. Keep a viewport fallback. |
| `@supports (display: grid)` guards and flex fallback | Grid everywhere; drop the fallback |
| `grid-template-areas` per mode class | Same, kept as the layout spec. Mode classes become `data-view="table|thumb|grid|list|masonry"` |
| Hidden context-row revealed on `:focus` | `:focus-within` and `:has()` only, no class juggling from JS |
| react-masonry-component in a `tbody` | Native masonry where supported (`@supports (grid-template-rows: masonry)` or `display: masonry`; the two syntaxes are still split across engines) with a CSS `columns` fallback. No JS layout. |
| `-ms-high-contrast` | `@media (forced-colors: active)` with system colors; the black-on-white / white-on-black themes stay as opt-in classes and also map to `prefers-color-scheme` via `light-dark()` |
| Hand-rolled transitions | `prefers-reduced-motion` respected; View Transitions for mode switches |
| Full table re-render on sort | `content-visibility: auto` on rows; sort reorders DOM nodes, does not rebuild them |

The five modes, their breakpoints and their grid areas get written down as
`spec/04-layout-modes.md` before the CSS is touched, so the CSS can be
checked against it visually (Playwright screenshots per mode per width).

## 5. Web Workers

Bring back the 1.x idea with today's APIs, and put more than the fetch
behind it.

One module worker (`type: "module"`), lazily started, with a small typed
message protocol. Responsibilities:

- **Fetch + parse + normalize listings.** The worker calls the REST API,
  parses JSON, and precomputes the derived fields v2 computed on the main
  thread in the reducer (`fileSizeHumanReadable`, four `toLocaleString`
  variants per item via `Intl`, dimensions string, icon by extension). For a
  directory with a few thousand items this is the expensive part today.
- **Sort and filter over a cached listing.** The worker keeps the current
  directory's items; sort and search-as-you-type send a tiny message and get
  back an ordered list of ids. The main thread never iterates the list.
- **Cache for instant first paint.** Listings and tree go to IndexedDB from
  the worker (replacing the `localStorage` JSON blobs), so the UI renders
  the last known state immediately and reconciles when the network answers.
- **Image work.** Thumbnail decode with `createImageBitmap` for grid modes;
  crop export with `OffscreenCanvas` so the crop modal never blocks.
- **Zip download client-side** as an optional enhancement over the server
  `attachments` endpoint.

Progressive enhancement rules: the same module runs on the main thread when
`Worker` is unavailable or blocked by CSP, behind one interface, so there is
exactly one code path for the logic. Nothing in Level 0 or Level 1
conformance may depend on the worker; it is a performance tier, measured
(INP under 200 ms while filtering a 5,000-item listing is a reasonable
budget to write into `spec/10-performance.md`).

Optional later: a `SharedWorker` so several browser instances on one page
share the cache and the API connection.

## 6. Proposed repository shape

Same repo, new branch (`v3`), pnpm workspace. `release-2.0` stays as-is for
the published `eureka-browser` package.

```
packages/
  spec/           the spec, schemas, fixtures and conformance suite (section 3)
  core/           TypeScript, no DOM: state + events, API client, worker + main-thread twin,
                  sort/filter/format, keymap, i18n runtime, persistence
  html/           pure render functions: state -> HTML string. Used by the server for the
                  no-JS layer and by the element for updates. Also emitted as static reference
                  templates for non-Node servers (PHP/MODX).
  element/        <eureka-browser> custom element: hydrates html/ output, wires core, light DOM
  css/            the stylesheet: layers, layout modes, themes, forced-colors
  react/          typed wrapper over element/ (later: vue/, svelte/ if asked for)
  server-node/    reference REST implementation + SSR demo (Hono or Express 5), the fakepi fixtures
apps/
  demo/           the eureka.markup.tips site, served by server-node
```

Toolchain: TypeScript, Vite for dev and library builds, Vitest for unit,
Playwright for conformance, Changesets for versioning, GitHub Actions
replacing Travis. Node 22+. Drop Bower, Grunt, Sass, Modernizr, polyfill.io.

Templating choice inside `html/`: plain tagged-template functions returning
strings, with a small DOM morph on the client for updates, keeps zero
dependencies and one renderer for server and client. Lit (with its SSR
package) is the fallback if hand-rolled templating gets painful. This can be
decided after the spec exists; the spec does not care.

## 7. Phases

1. **Spec seed.** Run v2 locally, snapshot the rendered DOM for each mode and
   for the no-JS form. Write the HTML contract, no-JS protocol, layout modes,
   keymap, theme token registry and OpenAPI from those snapshots and the
   README. Port fixtures. Stand up the conformance suite skeleton and make it
   pass against v2 as the baseline. Done when: the suite runs green on v2.
2. **Core + server.** `core/` state, API client, worker. `server-node/`
   implementing OpenAPI with API tests. Done when: API tests and core unit
   tests pass; no UI yet.
3. **HTML layer + CSS.** `html/` render functions producing the no-JS form;
   `css/` port of the layout system. Done when: Level 0 conformance passes
   on server-rendered output in all five modes at mobile and desktop widths.
4. **Element.** `<eureka-browser>` hydrating that output. Done when: Level 1
   then Level 2 conformance passes, axe clean, performance budget met with
   the 5,000-item fixture.
5. **Adapters and release.** React wrapper, demo site, migration notes for
   `eureka-browser` 0.0.x users, publish under a new major.

## 8. Decisions

Taken on 2026-11-01:

1. **Custom-element-first with a React adapter.** Agreed.
2. **Same repo, branch `v3`.** Taken by default.
3. **PHP/MODX reference templates** are deferred past 3.0. The HTML layer
   is still specified so they can be produced later.
4. **No JavaScript masonry.** Native masonry where supported, otherwise a
   dense CSS grid with row spans computed from the item's aspect ratio
   (the API supplies dimensions), see `spec/04-layout-modes.md` LAY-34.
5. **No Redux, and no React Context in its place.** State lives in the
   framework-free core as a plain store (state object, pure update
   functions, `EventTarget`). The React adapter reads it with
   `useSyncExternalStore`.
6. **Worker plus containment, not one or the other.** Modern React does
   not move work off the main thread; the worker handles parse, normalise,
   sort and filter, and CSS containment plus lazy media handles scroll
   cost. Windowing only if the 5,000-item budget is missed. See
   `spec/10-performance.md`.

### Phase 1 progress

- `spec/conformance/fixture-server.mjs`: zero-dependency REST fixture
  server, used to run the v2 build (`.claude/launch.json` → `v2-baseline`).
- `spec/fixtures/snapshots/`: v2 no-JS render for all five modes
  (identical except the mode class), v2 enhanced DOM for table, thumb,
  grid, list, focused row and multiple choice, plus reference screenshots
  at wide and narrow widths. Masonry crashes the v2 build (React
  invariant 149) and could not be captured.
- Written: `spec/README.md`, `02-html-contract.md`, `03-no-js-protocol.md`,
  `04-layout-modes.md`, `05-keyboard.md` + `data/keymap.json`,
  `08-theming.md` + `data/theme-tokens.json`, `10-performance.md`,
  `api/openapi.yaml`.
- `spec/conformance/`: Playwright + axe conformance suite, ~100 tests over
  three projects (Level 0 with JavaScript disabled, enhanced desktop,
  enhanced narrow). Runs green against the v2 build with known v2 defects
  recorded as expected failures (`spec/README.md`, "Known v2 baseline
  defects") and v3-only requirements skipped.
- Not yet written: `01-concepts.md`, `06-accessibility.md`, `07-state.md`,
  `09-i18n.md`, JSON schemas.
