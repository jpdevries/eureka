# Migrating from Eureka 2.0 (`eureka-browser` 0.0.x)

Eureka 3 keeps what users saw and did in 2.0: the same REST API, the same
no-JavaScript form, the five layout modes, the keyboard-first interaction,
the themes and the `choose`/`close` contract with the host. What changes is
how it is delivered: a specification, a framework-free custom element,
and a thin React wrapper instead of a React 15 component with Redux.

## Packages

| 2.0 | 3.0 | Notes |
|---|---|---|
| `eureka-browser` (React component, UMD bundle) | `@eureka/element` | `<eureka-browser>` custom element, ES module bundle `eureka-browser.js` + `eureka-worker.js` |
| `EurekaMediaBrowser` React component | `@eureka/react` | `<EurekaBrowser>` wrapping the element; `useEurekaState` hook |
| `client/build/assets/css/eureka.*.css` | `@eureka/css` | `eureka.css` and `icons.svg` |
| the Express testing server | `@eureka/server-node` | reference REST implementation, filesystem source, Level 0 page renderer, `eureka-server` CLI |
| (none) | `@eureka/core`, `@eureka/html` | state, API client, worker engine; HTML rendering from state (for servers in other languages, the contract is in `spec/`) |

Bower and the UMD build are gone. Everything is an ES module and works
with any bundler or none.

## Mounting

2.0:

```jsx
import { EurekaMediaBrowser } from 'eureka-browser';
ReactDOM.render(<EurekaMediaBrowser basePath="/" mediaSource="0" />, document.getElementById('eureka-root'));
```

3.0, no framework:

```html
<link rel="stylesheet" href="/assets/css/eureka.css">
<div class="eureka-root">
  <eureka-browser api="/" source="0" assets="/assets/"></eureka-browser>
</div>
<script type="module" src="/assets/js/eureka-browser.js"></script>
```

3.0, React 19:

```tsx
import { EurekaBrowser } from '@eureka/react';
<EurekaBrowser api="/" source={0} assets="/assets/" onChoose={(items) => …} />
```

The wrapper element needs a height (`.eureka-root` is a flex column that
fills its parent). 2.0's `modal-section` body class and the iPad
absolute-positioning hack are no longer needed.

## Options

Every 2.0 prop exists as a configuration key with the same name and
default, reachable through the element's `config` property, a
`<script type="application/json" data-eureka-config>` child, or an
attribute for the common ones. Differences:

| 2.0 | 3.0 |
|---|---|
| `basePath` | `api` attribute / `endpoints.api` (the REST base; `media/` is appended). `basePath` still exists for the Level 0 form action. |
| `locale="en-US"` | `lang` attribute; message catalogs load from `endpoints.i18n` (`{i18n}/{locale}.json`) |
| `mediaSource`, `currentDirectory` | `source`, `path` attributes |
| `mode`, `sort` | `mode` attribute; `sort: { by, dir }` in config (`sort` was a string) |
| `storagePrefix` | `storage-prefix` attribute / `storagePrefix` |
| `allowDownload` default `false` | default `true` |
| `callbacks.choose(item \| items)` | same, plus the `eureka-choose` DOM event (`detail.items`, always an array) |
| `callbacks.close()` | same, plus `eureka-close` |
| `decoratedActions` (HOC) | Not available in 3.0.0-alpha: the element talks to the REST API from its worker. Spec 07 STATE-51 defines the client interface a host will be able to supply; until then, put a proxy in front of a non-REST backend. |
| `headers`, `intervals`, `uid`, `iconSVG`, `assetsBasePath`, `allow*`, `confirmBeforeDelete`, `treeHidden`, `useLocalStorage`, `enlargeFocusedRows`, `emphasisFocusedMediaItem`, `doDragNDrop` | unchanged |

New: `eureka-navigate`, `eureka-error` and `eureka-statechange` events;
`navigate()`, `setView()`, `refresh()`, `choose()` methods and a `state`
getter; keymap overrides (`config.keymap`); `handlers.createFile`;
`worker="inline"` to run without a Web Worker.

## Keyboard shortcuts

The Control chords collided with browser commands outside macOS. 3.0
defaults (spec 05, `spec/data/keymap.json`):

| Action | 2.0 | 3.0 |
|---|---|---|
| Filter | `ctrl+f` | `Alt+Shift+S`, or `/` outside text fields |
| New directory | `ctrl+n` | `Alt+Shift+N` |
| New file | `ctrl+shift+n` | `Alt+Shift+F` |
| Upload | `ctrl+u` | `Alt+Shift+U` |
| Rename | `ctrl+r` | `F2` |
| Toggle sidebar, view modes, sources, Enter, Backspace, Alt+Space | unchanged | unchanged |
| Move between items | (none) | ArrowUp/ArrowDown, Home/End; Space checks an item in multiple mode |

Hosts that want the 2.0 chords pass them back through `config.keymap`.
Shortcuts are bound on the instance, not on `document`.

## Markup and styling

The DOM is specified in `spec/02-html-contract.md`. Class names are
unchanged for the most part (`eureka`, `eureka__table`, `eureka__view-mode__*`,
`eureka__media-source-panel`…). Changes a stylesheet override or an
integration test may notice:

- The listing is always a `<table>`; grid, thumb, list and masonry are
  CSS, not different markup. Masonry no longer needs JavaScript.
- Dialogs are native `<dialog>` elements; the page behind them is `inert`.
- The source tree uses `<details>` disclosures plus buttons, not nested
  interactive elements.
- Custom properties are registered in `spec/data/theme-tokens.json`. All
  2.0 tokens (`--active`, `--light-bg`, `--link-color`…) still apply; some
  defaults changed to meet 4.5:1 contrast. The accessible themes are
  still `body.black-on-white` and `body.white-on-black`, and forced
  colors are honoured without a class.
- The 2.0 `-ms-high-contrast` rules are gone; `forced-colors` replaces them.

## Server side rendering

The no-JavaScript protocol is unchanged (field names `eureka__mediaSourceId`,
`eureka__upload-dir`, `eureka__media-browser_{uid}__browsing`,
`eureka__uploadFiles`, `eureka__chosen_item`; spec 03). What the server
renders comes from `@eureka/html`:

```js
import { renderLevel0 } from '@eureka/html';
const form = renderLevel0({ sources, source, path, entries, tree, lang, basePath: '/' });
```

Wrap it in `<eureka-browser api="/">` and load the bundle to enhance it.
`@eureka/server-node` does all of this (`eureka-server --root ./media
--render --enhance`). A server in another language renders the same
markup; the contract and the conformance suite in `spec/conformance`
check it.

## Browser support

Eureka 3's enhanced layer targets evergreen browsers (ES2022, custom
elements, `<dialog>`, container queries, `:has()`, cascade layers). Older
browsers get the Level 0 form, which is complete: browse, upload, choose,
every view mode. Internet Explorer is no longer enhanced.
