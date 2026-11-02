# @eureka/html

> Client renders can pass `rowMemo` in the context: the listing then emits a
> keep-placeholder for every row whose markup is unchanged since the previous
> render, and `@eureka/element`'s morph leaves those rows untouched (10 PERF-11).

The HTML layer: pure functions from state to markup, used by the server for
the Level 0 form (spec 03) and by the element for the enhanced DOM (spec 02).
No DOM APIs; output is a string, so it runs in Node, in a worker, or in the
page.

```ts
import { renderLevel0, renderEnhanced, renderDocument } from '@eureka/html';

const body = renderLevel0({ sources, source, path: 'assets/img', entries, tree, lang: 'en-US', basePath: '/' });
const page = renderDocument({ lang: 'en-US', body, stylesheets: ['/assets/css/eureka.css'] });
```

- `html` is a tagged template that escapes every interpolation; `raw()`
  opts out, `attr()` renders boolean and valued attributes.
- `contextFromPage()` turns server inputs into a core `State` plus a
  translator and id helper; `instance(ctx)` renders the root for Level 0
  (`<form>`) or Level 1 (`<div>`), region by region: notifications, source
  panel, stage header, toolbar, listing, path bar, choose bar, dialogs.
- Ids follow 02 HTML-04/05 (`{p}row__{cssSafe(filename)}`); field names
  follow 03; every control is named by action and object (06 A11Y-01).
- `hydrationState()` is embedded as `<script type="application/json">` for
  the element to start from (03 NOJS-41).

`test/render.test.ts` asserts the contract on both renders.
