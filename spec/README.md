# Eureka Media Browser Specification

Version: 3.0.0-draft.1 (2026-11-01). Status: seeded from Eureka 2.0 (v0.0.129).

This specification describes the Eureka media browser independently of any
UI framework. An implementation conforms if it produces the HTML described
here, speaks the REST API described here, and passes the conformance suite.
The reference implementation is the `<eureka-browser>` custom element; a
React wrapper, a server-rendered PHP page or anything else can conform too.

## How to read this

- The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be
  interpreted as in RFC 2119.
- Every normative requirement has an id such as `HTML-12` or `KEY-04`.
  Conformance tests reference these ids. Ids are never renumbered; a
  withdrawn requirement keeps its id and is marked withdrawn.
- Data files under `data/`, `schema/` and `api/` are normative where a
  prose document says so. Implementations SHOULD import them rather than
  copy their contents.
- `fixtures/` is informative: sample API payloads and DOM snapshots
  captured from Eureka 2.0, used to seed this spec and as test data.

## Documents

| # | Document | Covers |
|---|---|---|
| 01 | [concepts.md](01-concepts.md) | Source, directory, item, selection, view, instance |
| 02 | [html-contract.md](02-html-contract.md) | The DOM: regions, elements, names, roles, ids, classes |
| 03 | [no-js-protocol.md](03-no-js-protocol.md) | The synchronous form that works without script |
| 04 | [layout-modes.md](04-layout-modes.md) | Table, thumb, grid, list, masonry; breakpoints; grid areas |
| 05 | [keyboard.md](05-keyboard.md) | Shortcuts (normative data in `data/keymap.json`), focus rules |
| 06 | [accessibility.md](06-accessibility.md) | Names, descriptions, live regions, themes, forced colors |
| 07 | [state.md](07-state.md) | State shape, events, persistence keys |
| 08 | [theming.md](08-theming.md) | Custom property registry (normative data in `data/theme-tokens.json`) |
| 09 | [i18n.md](09-i18n.md) | Message catalog, ICU, locale loading |
| 10 | [performance.md](10-performance.md) | Worker contract, rendering budgets |
| — | [api/openapi.yaml](api/openapi.yaml) | The REST API |

Documents not yet written in this draft: 01, 06, 07, 09.

## Conformance levels

The levels are the Eureka 2.0 feature matrix made testable. Each level
includes the ones below it.

**Level 0: HTML.** The server-rendered form alone, with no CSS and no
script. A user can browse directories, upload files and choose one item.
Everything is keyboard operable because it is native form controls.

**Level 1: Enhanced.** Script is running. Asynchronous browse, upload,
choose; filter; sort; the five layout modes; the source panel with the
directory tree; rename, delete, create directory; single and multiple
selection; the keyboard shortcuts; persistence of view preferences; all
WCAG 2.2 AA criteria the conformance suite checks.

**Level 2: Full.** Drag and drop upload, paste to upload, crop, multiple
download as zip, fullscreen, masonry layout, notifications, the worker
performance budget.

An implementation states which level it meets. Level 0 MUST NOT depend on
anything above it: a Level 1 or 2 implementation is always a Level 0 page
first, enhanced in place.

## The conformance suite

`conformance/` holds a Playwright suite plus axe-core. It starts the
fixture server (`conformance/fixture-server.mjs`), loads a page that
embeds the implementation under test, and asserts through the
accessibility tree (`getByRole`, `getByLabel`), never through class names.
Level 0 runs with JavaScript disabled. Every state is checked with axe.
The suite is not yet written in this draft; the fixture server is.

### Running the Eureka 2.0 baseline

The v2 build in `client/build` is the baseline the first suite must pass
against. The `.claude/launch.json` entry `v2-baseline` runs:

```
node spec/conformance/fixture-server.mjs --port 3101 --static client/build --index <patched index.html>
```

The patched index is `client/build/index.html` with the dead
`cdn.polyfill.io` script tag removed. `POST /__snapshot?name=x` saves the
request body to `fixtures/snapshots/x.html`; that is how the
`v2-enhanced-*` snapshots were captured. The `v2-nojs-*` snapshots were
produced by rendering `client/dist/main.js` with React 15 on Node 22
(`renderToStaticMarkup`) against the same fixture server.

Known v2 baseline defects observed while capturing, which the suite must
not enshrine: masonry mode throws (React invariant 149, string ref in
react-masonry-component) and unmounts the whole component; the multiple
choice checkboxes remain rendered after switching back to single;
column sorting is a click handler on `<th>` with no keyboard path.

## Versioning

The spec follows semver. A new MAJOR changes the HTML contract, the no-JS
field names or the API in an incompatible way. MINOR adds optional
requirements or new MAY/SHOULD items. PATCH clarifies. Implementations
declare the spec version they target.
