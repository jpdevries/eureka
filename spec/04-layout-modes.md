# 04. Layout modes

Status: draft, ported from Eureka 2.0 `client/src/scss/layout/_layout.scss`
and the reference screenshots in `fixtures/snapshots/img/`.

The listing is one `<table>` (02 §6). The five modes are the same DOM
restyled. Nothing in this document changes markup; a mode switch is an
attribute change on the root (`data-view`) and nothing else.

## 1. Breakpoint and container

- **LAY-01** There is one breakpoint, at an inline size of **40em**
  (640px at 16px). Below it the component is "narrow"; at or above it,
  "wide". v2 measured the viewport (`max-width: 40em` /
  `min-width: 40.0625em`). v3 MUST measure the instance root with a
  container query (`container: eureka / inline-size` on the mount
  element) so an instance in a sidebar lays out as narrow while the
  viewport is wide. A viewport media query fallback MAY be kept for
  engines without container queries.
- **LAY-02** Wide: the instance fills its container's block size and does
  not scroll the page; the listing body (`tbody`) is the scroll
  container. Narrow: the page scrolls and the listing is not independently
  scrollable.

## 2. Frame

Wide (`≥ 40em`):

- **LAY-10** Root is a column flexbox. Order: notifications, browse
  content (flex 1), path bar, choose bar. Padding `.5rem`.
- **LAY-11** Browse content is a row flexbox: source panel fixed
  `14rem` wide (`flex: 0 0 14rem`, margin-inline-end `.5rem`), stage
  `flex: 1 1 100%` as a column: stage header (auto height), toolbar, table
  wrapper (flex 1, min-height 0).
- **LAY-12** Inside the table wrapper the table is a column flexbox:
  `thead` is a block of fixed height, `tbody` is `display: block`,
  `overflow-y: auto`, `flex: 1 1 0`. The header therefore stays visible
  while rows scroll. v2 added `padding-right: 16px` to the header when
  the body scrolled; v3 uses `scrollbar-gutter: stable` on both.
- **LAY-13** The source panel is a column flexbox: source selector, tree
  (flex 1, scrolls), drop area (square-ish, grows), tree bar (icon row).

Narrow (`< 40em`):

- **LAY-14** Everything stacks in DOM order at full width. The source
  panel, when open, precedes the stage. Form controls in the toolbar
  stack as label-over-control at full width; the view chooser is a
  single row of icon radios.
- **LAY-15** Notifications become a sticky bar at the top of the instance
  (`position: sticky; top: 0`).

## 3. Rows as grids

Every `<tr>` in `thead` and `tbody` is `display: grid` with named areas.
Cells map to areas by class (02 §9): `choose`, `radio` (Level 0 select
column), `media`, `name`, `actions`, `dimensions`, `file-size`,
`edited-on`. A cell with no area in the current template is
`display: none`.

### Table and list modes, wide

| State | `grid-template-columns` | `thead` areas | `tbody` areas |
|---|---|---|---|
| single choice | `40% 24% 12% 12% 12%` | `media name dimensions file-size edited-on` | same, then `actions ×5` |
| multiple choice | `2rem auto 24% 12% 12% 12%` | `choose media name dimensions file-size edited-on` | same, then `actions ×6` |
| Level 0 | `2rem 40% 24% auto auto auto` | `radio media name dimensions file-size edited-on` (radio header visually hidden) | same |

- **LAY-20** The table above is normative for `table` and `list`. Text
  aligns right in all cells except media (left). In `list` mode the first
  cell gets `.5rem` inline padding and rows get `.5rem` block margin.
- **LAY-21** The actions row (`actions` area) spans the full row width,
  sits last (`order: 10`), and is shown only for the row that has focus
  within (02 HTML-68). In `table` mode it has `.5rem` top margin.
- **LAY-22** `table` mode thumbnails are capped at `max-height: 20vh`;
  with `enlargeFocusedRows` the focused row's thumbnail may grow to
  `30vh`. `list` mode thumbnails are capped at `10vh` in both dimensions.

### Table and list modes, narrow

- **LAY-23** `thead` is visually hidden. Each row stacks:
  `table`: `media` / `name` / `actions`; `list`: `name` / `actions`
  (media hidden). Multiple choice prepends a `choose` row. Dimensions,
  file size and edited-on cells are hidden. Media is centred.

### Thumb, grid and masonry modes

- **LAY-30** `thead` is hidden. In each row only the `media` cell (and
  the `choose` cell in multiple mode) is displayed; the actions cell is
  hidden in all states and its controls are reached through the path
  bar (02 HTML-81).
- **LAY-31** `tbody` becomes a wrapping row flexbox, content centred.
  Each row is a flex item with `.5rem` end and bottom margin.

| Mode | Wide item basis | Narrow item basis |
|---|---|---|
| thumb | `16vw` | `42vw` (two across) |
| grid | `25vw` | `100%` (one across) |
| masonry | `max-width: 20%` per column, no margin, `.25rem` inline padding | as grid |

- **LAY-32** v3 SHOULD express these bases in container units (`cqi`)
  rather than `vw` so they follow the instance width.
- **LAY-33** Media in thumb/grid/masonry uses `object-fit: contain` and
  fills its item width.

### Masonry without script

- **LAY-34** Masonry MUST NOT require JavaScript layout. Two tiers,
  selected by `@supports`:
  1. Native masonry where the engine supports either
     `grid-template-rows: masonry` or `display: masonry`
     (`repeat(auto-fill, minmax(<item>, 1fr))` tracks). Items keep DOM
     order and are placed in the shortest track, so visual order follows
     sort order.
  2. Otherwise CSS multi-column layout: `tbody` is `display: block` with
     `columns: <item>` (two columns below the 40em container breakpoint),
     each row `display: block; break-inside: avoid`. Items keep their
     aspect ratio and pack down each column, then the next; DOM order
     (and therefore sort order and arrow-key order) runs down a column
     rather than across. Media is never cropped to fit.
  An earlier draft specified a dense grid with row spans computed from
  the item's aspect ratio; it needed per-row style data, cropped media to
  the guessed height, and depended on `round()` arithmetic that engines
  rejected. v2's Masonry.js (shortest-column placement) did not guarantee
  order either.
- **LAY-40** Focused rows, the actions toolbar and the search input
  show a 1px outline in `--active`. `tr:target` outlines the media with
  `#32AB9A` 3px (used by in-page links to an item).
- **LAY-41** Reduced motion: all transitions (notifications, mode
  changes, crop controls) MUST be disabled under
  `prefers-reduced-motion: reduce`. Mode switches MAY use a view
  transition when motion is allowed.
- **LAY-42** Fullscreen: `.eureka-root:fullscreen` is `100vw × 100vh`,
  scrolls, and uses `--bg-color`.

## 5. Long listings

- **LAY-50** Rows SHOULD set `content-visibility: auto` with
  `contain-intrinsic-block-size` equal to the row's typical height for
  the current mode, so off-screen rows cost no layout or paint. Images
  are `loading="lazy"` and `decoding="async"` (02 HTML-66). See 10 for
  budgets.

## 6. Reference images

Captured from the v2 baseline at 800×600 (wide) and 375×812 (narrow),
scaled 0.6: `fixtures/snapshots/img/v2-{desktop,mobile}-{table,thumb,grid,list}.jpg`,
plus `*-table-row-focused.jpg` (actions row visible) and
`v2-desktop-table-choose-multiple.jpg`. Masonry could not be captured
because the v2 build crashes on entering it (README, known defects); the
README screenshot in the v2 repository is the only reference.
