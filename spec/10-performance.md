# 10. Performance

Status: draft. Captures the decisions from the v3 kickoff.

## 1. Two problems, two tools

Large folders hurt in two unrelated ways. Parsing a big listing, deriving
display strings for every item, and sorting or filtering are CPU work
that blocks the main thread in one long task. Scrolling thousands of rows
with images is layout and paint work. A worker fixes the first and cannot
touch the second; CSS containment and lazy media fix the second and do
nothing for the first. Eureka 1.x had workers; Eureka 2.0 had neither.

## 2. The worker

- **PERF-01** Implementations at Level 2 MUST run the following off the
  main thread when `Worker` is available: fetching and parsing API
  responses; normalising entries (03 §Entry) into display records
  (human readable size, the four locale date strings, dimensions text,
  icon name, search haystack); sorting; filtering.
- **PERF-02** The worker keeps the current directory's normalised records
  and answers sort and filter requests from memory, returning an ordered
  array of record ids. The main thread never iterates the full list for
  these operations.
- **PERF-03** The same module MUST run on the main thread when workers
  are unavailable or blocked (CSP, old engines), behind one interface,
  so there is exactly one implementation of the logic. Levels 0 and 1
  MUST NOT depend on the worker.
- **PERF-04** Message protocol (normative shape in
  `schema/worker-messages.json`, to be written): request
  `{id, type, ...}` where `type` is one of `listSources`, `listTree`,
  `listDirectory`, `sort`, `filter`, `upload`, `delete`, `rename`,
  `createDirectory`, `decodeThumbnail`, `crop`; response `{id, ok,
  result}` or `{id, ok: false, error}`. Every request carries the locale
  and the instance headers so the worker needs no shared state with the
  page.
- **PERF-05** Listings and the tree SHOULD be cached in IndexedDB by the
  worker, keyed by source and path, so the UI can render the last known
  state immediately on load and reconcile when the network answers.
  This replaces the v2 `localStorage` JSON blobs.
- **PERF-06** Thumbnail decoding for grid modes MAY use
  `createImageBitmap` in the worker; crop export MUST use
  `OffscreenCanvas` in the worker when available so the dialog does not
  freeze on large images.
- **PERF-07** A `SharedWorker` MAY be used so several instances on one
  page share the cache and connection; it is not required.

## 3. Rendering

- **PERF-10** Rows SHOULD use `content-visibility: auto` with an
  intrinsic size hint (04 LAY-50). Images are `loading="lazy"` and
  `decoding="async"`.
- **PERF-11** Sorting reorders existing row elements; it MUST NOT rebuild
  them. Filtering toggles `hidden` on rows (or detaches them) without
  rebuilding.
- **PERF-12** If the budgets below are not met with containment alone at
  5,000 items, the implementation MAY window the listing (render only
  rows near the viewport). Windowing MUST keep the roving tabindex and
  the "{n} items" count announced to assistive technology.

## 4. Budgets

Measured in the conformance suite with the `large` fixture (5,000 files,
mixed types) on a throttled CPU (4× slowdown) in Chromium.

| Id | Metric | Budget |
|---|---|---|
| PERF-20 | Longest task on the main thread while loading a 5,000-item directory | ≤ 50 ms |
| PERF-21 | Interaction to next paint while typing in the filter | ≤ 200 ms |
| PERF-22 | Interaction to next paint on sort column change | ≤ 200 ms |
| PERF-23 | Time from script execution to first render from cache (warm load) | ≤ 100 ms |
| PERF-24 | Scroll frame time, grid mode, 5,000 items | no frame > 32 ms over a 5 s scroll |
| PERF-25 | Shipped size, gzip: core + element + worker | ≤ 30 kB |
| PERF-26 | Shipped size, gzip: stylesheet | ≤ 12 kB (v2: 7.8 kB) |
| PERF-27 | Shipped size, gzip: icon sprite | ≤ 10 kB (v2: 7.9 kB) |

The fixture server will grow a `?count=` option on the listing endpoint
to generate the `large` fixture on the fly.
