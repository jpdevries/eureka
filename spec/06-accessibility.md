# 06. Accessibility

Status: draft. Eureka targets WCAG 2.2 AA throughout, with a few AAA
items (contrast themes, no timing) where the design already had them.
This document collects the rules that cut across 02, 04, 05 and 08 and
maps the axe findings on the v2 baseline to requirements.

## 1. Names and descriptions

- **A11Y-01** Every interactive control has an accessible name that
  states its action and its object: "Choose schildpad.jpg", "Create a new
  Directory in assets/img", "Upload files to assets/img". Visible text may
  be the verb alone; the object is added as visually-hidden text in the
  same element so the name and the visible label still start the same
  way (WCAG 2.5.3 Label in Name).
- **A11Y-02** Controls MUST NOT override a visible label with
  `aria-labelledby` pointing at a group legend. v2 did this for the view
  radios and the choose-mode radios, naming every radio after the legend.
  Use `<fieldset>`/`<legend>` for the group and the control's own
  `<label>` for the control.
- **A11Y-03** Each listing row exposes the item description (02 HTML-64):
  filename, dimensions when known, human readable size, and the long
  date. When the API supplies `alt`, the image carries it and the
  description still names the file. When it does not, the image has
  `alt=""` and the description is the item's only text alternative. The
  description MUST be available on the row (via `aria-describedby`) so
  that navigating by row announces it once, and MUST NOT be repeated on
  every cell.
- **A11Y-04** Icons are decorative (`aria-hidden="true"`) and never the
  sole carrier of meaning; every icon control has text (A11Y-01).
- **A11Y-05** The "Choose" button's visible text and accessible name
  begin identically ("Choose"), and the visually-hidden object is
  appended, not prepended (axe `label-content-name-mismatch` on v2).

## 2. Structure and roles

- **A11Y-10** Use native elements with their implicit roles: `<table>`,
  `<button>`, `<a href>`, `<select>`, `<details>`, `<dialog>`,
  `<fieldset>`. ARIA roles are added only to supply a role the element
  lacks (`role="toolbar"`, `role="status"`) or to name the keyboard
  pattern an element implements: the Level 1+ listing is a `<table
  role="grid">` because its rows are one tab stop navigated with the
  arrow keys (02 HTML-60), and that role is what makes screen readers
  hand those keys to the page. v2's `role="navigation"` on a `<select>`,
  `role="menuitem"` on a `<label>`, `role="tree"`/`treeitem` on
  `<nav>`/`<summary>`, and `role="listbox"`/`option` on button groups
  are all withdrawn (axe
  `aria-allowed-role`, `aria-required-children`, `aria-prohibited-attr`,
  `presentation-role-conflict` on v2).
- **A11Y-11** Landmarks: the source panel is `complementary`, the filter
  is `search`, the listing controls are a `toolbar`, the whole instance
  is a `region` named "Media Browser" when it is not the page's `main`.
- **A11Y-12** Headings: one `<h2>` "Browse Media Content" for the stage
  and one `<h2>` "Choose a Media Source" in the panel; dialogs have an
  `<h2>` title referenced by `aria-labelledby` (axe `aria-dialog-name`).
- **A11Y-13** Tables keep `<th scope="col">` headers so cell navigation
  announces column names; the `Actions` header is visually hidden but
  present.

## 3. Live regions and announcements

- **A11Y-20** Exactly these things are announced, each from a dedicated
  live region, never from the listing itself:
  - directory change: "Contents of {cd}, {n} items" (polite);
  - fetching: "Hold tight while we fetch {cd}" (polite, once);
  - empty / no results notices (polite, `role="status"`);
  - item mutations: "Deleted {filename}", "Renamed {old} to {new}",
    "Uploaded {n} files to {cd}" (polite);
  - errors: `role="alert"`;
  - the count of chosen items when it changes in multiple mode
    (polite, debounced).
- **A11Y-21** The `tbody`, rows and the filter `datalist` MUST NOT be
  live regions (v2 marked `tbody aria-live="polite"`, which re-announces
  on every render).
- **A11Y-22** The path bar is `role="status"` and reflects the focused
  item; it is the announcement channel for focus changes in thumb, grid
  and masonry modes where the row's own cells are hidden.

## 4. Keyboard and focus

Covered by 05. In addition:

- **A11Y-30** Nothing requires a pointer: double-click choose has Enter;
  drag and drop upload has the file input; the context menu has the
  actions toolbar; hover titles duplicate information available in text.
- **A11Y-31** Focus is never lost: deleting, renaming, navigating and
  closing dialogs move focus deliberately (05 KEY-B3..B5).
- **A11Y-32** The actions toolbar of a row is reachable by keyboard even
  though it is visually hidden until the row has focus: it is rendered,
  not `display: none`, as soon as the row receives focus and stays until
  focus leaves the row (02 HTML-68).

## 5. Pointer and touch

- **A11Y-40** Targets are at least 24×24 CSS px (WCAG 2.5.8), and at least
  44×44 under `(pointer: coarse)`. The v2 icon radios and tree bar
  buttons fail this (axe `target-size`); the `--tree-course-line-height`
  token exists for exactly this and v3 applies it under the media query
  rather than on touch detection. Tree rows, their disclosure `<summary>`
  and their link are all at least `--tree-row-size`, which the stylesheet
  derives as `max(24px, --tree-line-height × 1em)` (`max(44px, …)` under
  coarse pointers), so no host value of `--tree-line-height` can shrink
  the target below the floor. Inside that row the tree takes the rhythm
  of native Mac file browsers (Transmit, Finder): text at 12/13 of the
  instance font, 16px folder icons, about 7px from icon to name. Their
  20px row pitch is not followed, since it sits below the floor.
- **A11Y-41** Double-tap to choose on touch is an enhancement only; a
  single tap focuses the row and reveals the actions, which include
  Choose.

## 6. Visual

- **A11Y-50** Contrast: default tokens meet 4.5:1 for text and 3:1 for UI
  boundaries and focus indicators (08 THEME-07). The one v2 failure (axe
  `color-contrast`, the "Invert" label on the panel background) is fixed
  by the `--subtle` default.
- **A11Y-51** Reflow: the narrow layout (04) serves 320 CSS px wide
  viewports with no horizontal scrolling and no loss of function.
- **A11Y-52** Text spacing and 200% zoom: no fixed heights clip text;
  rows grow with content.
- **A11Y-53** Motion: respects `prefers-reduced-motion` (04 LAY-41). No
  content flashes. Animated media never autoplays (02 HTML-66b): it is
  still until the user plays that item, which satisfies WCAG 2.2.2 (Pause, Stop, Hide) without a timer, and keeps a
  5,000-item listing from moving. The browser's own transitions live
  under `@media (prefers-reduced-motion: no-preference)` or are switched
  off under `reduce`; demo and fixture SVGs are authored the same way, so
  a reduced-motion user sees the still frame even where the file is shown
  by an `<img>` the browser cannot pause.
- **A11Y-54** Forced colors and high contrast themes: 08 THEME-03/04.
  State (checked, focused, current directory) is conveyed by borders,
  outlines or text, never by background colour alone.
- **A11Y-56** The focused item and the chosen items are indicated in
  every layout mode and for pointer as well as keyboard focus (WCAG
  2.4.7, 2.4.11, 1.4.11). Focus: table and list mark the focused row's
  leading edge with `--active`, thumb, grid and masonry ring the media
  cell. Selection: the row's native control, a 1.5 rem radio in single
  mode and checkbox in multiple, drawn by the browser with
  `accent-color: var(--active)`, on a small translucent backing in the
  thumbnail modes so it reads on any image; except that single mode's
  thumbnail modes at Level 1+ keep the artwork clear: the radio is
  visually hidden (clipped, still in the tree) and the selected tile
  carries a 3 px `--active` ring inside its edge; the focus ring (a 2 px
  gap and 2 px of `--active` outside the tile) surrounds it when the item
  is both. Tiles keep 0.25 rem of padding so the outer rings are not
  clipped by the rows' paint containment (`content-visibility: auto`
  implies it); forced colors, which drop box shadows, draw the same
  states as Highlight outlines. Level 0 keeps the radio there, being the
  only way to select without script. Row backgrounds are never tinted for selection. The controls keep their native look under
  `forced-colors`; transitions obey `prefers-reduced-motion`.
- **A11Y-55** Keyboard hints rest at reduced opacity and return to full
  opacity on focus, while the shortcuts dialog is open, and as
  soon as the instance sees keyboard navigation (Tab, arrows, Home/End,
  Enter, Space, Escape or `?`): the element sets `data-keyboard="true"`
  on the root and clears it on the next pointer use. One resting level,
  the `--hint-opacity` token, for both kinds of hint: the Keyboard
  Shortcuts icon (HTML-95) MUST keep 3:1 against the button (WCAG 2.2
  1.4.11) and the `<kbd>` labels (HTML-96), being text, MUST keep 4.5:1
  (1.4.3) with the text blended over its own control, which is how axe
  measures it; the token rests as low as the stricter of the two allows:
  the default 0.65 measures 3.3:1 and 5.6:1, the dark scheme's 0.55
  measures 3.9:1 and 4.7:1 (0.535 is the text's floor there). Both come
  to full opacity on hover and visible focus of their control, while the
  shortcuts dialog is open, and under `data-keyboard`. The `<kbd>` labels
  use the body text colour on the panel background (`--color` on
  `--light-bg`) rather than inheriting the control's, so a muted label
  cannot pull them under the floor. A hint always occupies its space and
  is always faintly there: nothing is gated on focus elsewhere in the
  instance, so a pointer click on a select beside a hint changes nothing
  (a hint that appeared only then once widened its control, slid the
  select from under the pointer and closed its open list). The high
  contrast themes and forced colors show hints at full opacity; the
  transition honours `prefers-reduced-motion`.

## 7. Timing

- **A11Y-60** Nothing times out. Non-sticky notifications auto-dismiss no
  sooner than 5 s and pause while hovered or focused; the welcome
  notification is sticky. Polling intervals are off by default.

## 8. Dialogs and modality

- **A11Y-70** Dialogs are `<dialog>` opened modally, labelled by their
  heading, closeable with Escape and a Cancel button, and the background
  is `inert`. Focus starts on the first field and returns to the opener.
- **A11Y-71** Destructive confirmations (`confirmBeforeDelete`) use the
  same dialog pattern, not `window.confirm`, so they are styled, keyboard
  consistent and announced.
- **A11Y-72** The crop dialog (Level 2) exposes every cropper operation
  as a labelled control: drag mode radios (Move, Crop), guides toggle,
  zoom in/out, move left/right/up/down, rotate (range with value text),
  scale, aspect ratio select, bounding box number inputs, Reset, Crop /
  Crop as (Save as name), Download. Pointer-only cropper gestures are
  mirrored by these controls.

- **A11Y-75** The row context menu (02 HTML-71) is a `popover="manual"`
  in the top layer, not a dialog: the page stays interactive and nothing
  is made `inert`. Light dismiss is off, so the element itself closes it
  on pointer down outside, Escape, Tab, item activation and navigation.
  Focus moves into the menu on open and back to the row on close.

## 9. Screen reader walkthrough (informative)

Tabbing into an instance: "Media Browser, region" → "Browse Media
Content, heading level 2" → "Choose Items, group: Single, radio, selected"
→ "Filter contents of assets/img by filename, filesize, dimensions or even
modification date, combobox" → toolbar: "Toggle Source Panel, button,
collapsed" … "View Mode, group: Table Layout, radio, selected" → "Contents
of assets/img, table, 11 rows" → first row: "Wide Banner (final).jpg
displays at 2400x400, weighs 96 KB, and was edited on Friday, March 24,
2017 at Pacific Daylight Time" → Tab: "Actions for Wide Banner (final).jpg,
toolbar: Expand Wide Banner (final).jpg, link" → … → "Choose Wide Banner
(final).jpg, button".
