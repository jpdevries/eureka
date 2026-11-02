# @eureka/element

`<eureka-browser>`: the Eureka media browser as a framework-free custom
element in light DOM. It is the reference implementation of the spec at
Levels 1 and 2, built on [`@eureka/core`](../core) (state, API client,
worker engine) and [`@eureka/html`](../html) (markup from state).

## How it works

- **Enhances the server's form.** Wrap the Level 0 `<form>` that
  `@eureka/html` or the reference server rendered in `<eureka-browser>`
  and load the bundle. On connect the element reads the embedded state
  (`<script type="application/json" id="{p}state">`), builds the store and
  replaces the form with the enhanced markup. Without JavaScript the form
  keeps working (spec 03).
- **Or renders from the API.** An empty `<eureka-browser api="/">` fetches
  sources, tree and listing itself (07 STATE-40).
- **Renders from state.** Every change re-renders the instance markup
  through a keyed DOM morph, so the focused row, scroll position, typed
  filter text and playing media survive updates. Dialogs are native
  `<dialog>`s opened with `showModal()`.
- **Works off the main thread.** Fetching, normalising, sorting and
  filtering run in the worker bundle (`eureka-worker.js`, found next to the
  element bundle) and inline when workers are unavailable (10 PERF-03).

## Use

```html
<link rel="stylesheet" href="/assets/css/eureka.css">
<div class="eureka-root">
  <eureka-browser api="/assets/components/eureka/" assets="/assets/"></eureka-browser>
</div>
<script type="module" src="/assets/js/eureka-browser.js"></script>
```

Attributes (all optional): `api` (base URL of the REST API, `media/` is
appended), `assets` (base of the stylesheet's icon sprite), `lang`,
`source`, `path`, `mode`, `storage-prefix` (storage and id prefix), `uid`,
`worker` (`inline` to force the main-thread engine, or a worker URL),
`i18n` (base URL for message catalogs), `tree-open`, and the switches
`no-storage`, `no-uploads`, `no-dnd`, `no-rename`, `no-delete`,
`no-download`, `no-crop`, `no-masonry`, `no-fullscreen`, `no-welcome`,
`no-choose`, `no-choose-multiple`, `confirm-delete`, `always-welcome`.

Anything else, including functions, goes through the `config` property
(the `PartialConfig` of `@eureka/core`) or a
`<script type="application/json" data-eureka-config>` child:

```js
const el = document.querySelector('eureka-browser');
el.config = { callbacks: { choose: (items) => insert(items), close: () => modal.close() } };
```

Press `?` anywhere in the browser (outside text fields), or use the
toolbar's "Keyboard shortcuts" button, for the shortcuts reference; it is
generated from `spec/data/keymap.json` plus any `config.keymap` overrides.

Events (07 STATE-50): `eureka-choose` (`detail.items`), `eureka-close`,
`eureka-navigate` (`detail.{source, path}`), `eureka-error`
(`detail.{message, cause}`), `eureka-statechange` (`detail.state`, once
per render). Methods (STATE-52): `navigate(source, path)`,
`setView(mode)`, `refresh()`, `choose()`; `state` and `store` getters.

## Files

- `src/element.ts` the element: lifecycle, hydration, rendering, DOM
  events, keyboard (05), drag and drop and paste, fullscreen, the async
  flows through the engine
- `src/morph.ts` the keyed DOM morph
- `src/config.ts` attribute, JSON and property configuration
- `src/define.ts` the browser entry that registers the element
- `build.mjs` esbuild bundles → `dist/eureka-browser.js`,
  `dist/eureka-worker.js` (ES modules, minified, with source maps)
- `demo/index.html` a client-only demo page; the fixture server
  (`spec/conformance/fixture-server.mjs --render v3`) serves it at
  `/index.html` and the server-rendered, enhanced page at `/`

## Status

Passes the whole conformance suite at `CONFORMANCE_TARGET=v3` (Level 0,
enhanced, enhanced-narrow) with axe clean in every checked state. Known
gaps, tracked in the plan: the crop dialog crops by numeric bounds only
(no pointer-driven marquee yet); the engine's sort/filter results are
not yet used by the renderer, which still sorts on the main thread; the
listing is not windowed, so a 5,000-item directory renders every row
(see 10 PERF-12).
