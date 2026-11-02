# @eureka/core

The framework-free core of the Eureka media browser. No DOM, no framework;
the `<eureka-browser>` element and any adapter are built on it.

| Module | Spec | What it holds |
|---|---|---|
| `types`, `resolveConfig` | 01 | Entry, Source, TreeNode, Config with defaults |
| `paths` | 01, 02 | path normalisation, `cssSafe`, URL encoding, the `{id}\|\|{dir}` form value |
| `format` | 02, 09 | file sizes, Intl dates, media kind, icons, the per-item display record and description |
| `sort-filter` | 07, 09 | collation-aware sorting, filtering over display records, `visibleFiles` |
| `store` | 07 | state shape, events, pure `reduce`, selectors, `createStore` |
| `persistence` | 07 §5 | validated `localStorage` read/write of view preferences and location |
| `keymap` | 05 | bindings from `spec/data/keymap.json`, chord matching, host overrides, v2 legacy mode |
| `i18n` | 09 | ICU MessageFormat subset, per-message English fallback, locale resolution |
| `api/client` | api/openapi.yaml | `EurekaApi` interface and the fetch-based REST client |
| `worker/*` | 10 | the engine (fetch, normalise, cache, sort, filter, thumbnails, crop), its worker entry, and a bridge that falls back inline |

`src/data/*` is generated from the spec by `npm run sync:spec-data`; edit the
spec files, not the generated ones.

```ts
import { resolveConfig, initialState, createStore, createEngineClient, selectVisibleFiles } from '@eureka/core';

const config = resolveConfig({ basePath: '/assets/components/eureka/' });
const store = createStore(initialState({ config, locale: 'en-US' }));
const engine = createEngineClient({ locale: 'en-US', basePath: config.basePath, workerUrl: new URL('@eureka/core/worker', import.meta.url) });

const { result } = await engine.request({ type: 'listDirectory', source: 0, path: 'assets/img' });
store.dispatch({ type: 'listing/loaded', source: 0, path: 'assets/img', entries: result.entries, records: result.records });
selectVisibleFiles(store.getState());
```
