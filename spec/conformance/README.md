# Eureka conformance suite

Playwright plus axe-core tests that drive an implementation through its
accessibility tree and assert the requirements in the numbered spec
documents. Each test title starts with the requirement ids it covers.

```bash
cd spec/conformance
npm install
npm run test:v2        # the Eureka 2.0 build in client/build (the baseline)
npm run report         # open the HTML report
```

`CONFORMANCE_TARGET` selects the implementation (`v2`, default; `v3` once
the element exists). The fixture server (`fixture-server.mjs`) is started
by Playwright and serves the page under test, the REST API over in-memory
fixtures, placeholder media, and `/nojs`, the Level 0 page.

## Projects

| Project | Tests | Browser |
|---|---|---|
| `level0` | `tests/level0/` against `/nojs` | Chromium, JavaScript disabled |
| `enhanced` | `tests/level1/`, `tests/level2/` | Chromium, 1280×720 |
| `enhanced-narrow` | `tests/level1/layout.spec.mjs` | Pixel 7 emulation (narrow layout) |

## How the baseline is handled

The suite must run green against the v2 build, so that the first v3
implementation is measured against the same bar. Three helpers keep that
honest without hiding anything:

- `v3only(reason)` skips a test for a requirement introduced in v3 (for
  example arrow-key row navigation). Skipped tests are listed in the
  report.
- `baselineDefect(reason)` marks a test as an **expected failure** on v2.
  The test still runs; if v2 ever passes it, the suite fails, so the list
  of documented defects stays accurate. For v3 these tests must pass.
- `axeCheck(page, label)` attaches axe results to every test that calls
  it. Violations fail the test for v3 and are only recorded for v2.

Two v2 naming defects are so pervasive that locating controls by role and
name is impossible on the baseline: every view-mode radio is named "View
Mode" and both choose-mode radios are named "Choose Items:" because
`aria-labelledby` points at the legend. For `v2` the helpers `viewRadio`
and `chooseModeRadio` fall back to value or id selectors; for `v3` they
use the accessible names the spec requires, and dedicated defect tests
assert those names.

## Adding tests

- Locate by role and accessible name (`getByRole`, `getByLabel`). The only
  attribute selectors allowed are form field names, which are part of the
  no-JS protocol, and the stable hooks listed in 02 §9 when a test is
  specifically about CSS layout.
- Use the keymap through `chord(action)` rather than typing key names, so
  v2 and v3 bindings both resolve from `data/keymap.json`.
- Every test gets fresh fixture data (`POST /__reset` runs before each).

## Baseline results (Eureka 2.0, v0.0.129, 2026-11-01)

`npm run test:v2`: 78 passed, 18 expected failures (the documented v2
defects), 7 skipped (v3-only requirements), 0 failures. About 4.5 minutes
on a laptop; most of it is the two 5,000-row loads.

axe-core on the baseline, reported but not failing:

| State | Violations |
|---|---|
| Level 0 form | critical aria-required-children ×1, serious aria-prohibited-attr ×6, serious label-content-name-mismatch ×1, minor aria-allowed-role ×8, minor presentation-role-conflict ×6, moderate region ×4 |
| Enhanced table | critical aria-required-children ×1, serious label-content-name-mismatch ×1, minor aria-allowed-role ×2, moderate region ×23 |
| Focused row | critical aria-required-children ×2, serious label-content-name-mismatch ×1, minor aria-allowed-role ×3, minor presentation-role-conflict ×1, moderate region ×23 |
| Grid mode | critical aria-required-children ×1, serious label-content-name-mismatch ×1, minor aria-allowed-role ×2, moderate region ×17 |
| Multiple choice, panel open | critical aria-required-children ×1, serious color-contrast ×1, serious target-size ×7, serious aria-prohibited-attr ×1, serious label-content-name-mismatch ×1, minor aria-allowed-role ×8, moderate region ×31 |
| Rename dialog | serious aria-dialog-name ×1, minor aria-allowed-role ×1, minor presentation-role-conflict ×1 |

The recurring ones map to spec requirements already written: the
`role="grid"`/`rowgroup` structure (HTML-60), `role` on `<label>`,
`<select>` and `<summary>` (HTML-32, HTML-46), the "Choose … media item"
button whose visible text differs from its name (HTML-90), the unnamed
dialog (HTML-91), and 24px target sizes for the icon radios (KEY-C1).
`region` is axe's landmark rule firing on the demo page shell, not the
component.

Timing: the 5,000-item fixture takes about 8.5 s to render in v2 on this
machine. Long-task counting needs a `PerformanceObserver` registered
before the load, which the v3 harness will add; the baseline number is
wall-clock only.
