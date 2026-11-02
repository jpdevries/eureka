# 08. Theming

Status: draft. The token registry is normative data in
[`data/theme-tokens.json`](data/theme-tokens.json).

Eureka is themed entirely through CSS custom properties read by its
stylesheet. A host sets them on the mount element or any ancestor; no
build step is involved. This is how v2 worked and it is kept unchanged.

- **THEME-01** The stylesheet MUST read every token in the registry with
  its registered default as the `var()` fallback, and MUST NOT introduce
  colour, border or spacing values for themable surfaces outside the
  registry. New tokens are added to the registry first.
- **THEME-02** Tokens are inherited custom properties; the stylesheet
  MUST NOT set them on `:root` or `body`. It MAY set them on the instance
  root to establish defaults, and MUST do so with lower specificity than
  a host rule on `.eureka-root` (the `@layer eureka.theme` layer is the
  intended mechanism).
- **THEME-03** The two accessible themes `black-on-white` and
  `white-on-black` MUST ship as classes applicable to the mount element
  or `body`, with the overrides listed in the registry. They are opt-in
  and never applied automatically.
- **THEME-04** Under `@media (forced-colors: active)` the stylesheet MUST
  map tokens to the system colours listed in the registry, keep borders
  on every control (since backgrounds are flattened), and ensure
  focus indicators use `Highlight`. This replaces the v2
  `-ms-high-contrast` rules.
- **THEME-05** Under `@media (prefers-color-scheme: dark)` the stylesheet
  SHOULD supply a dark default set (not the high contrast theme), using
  `light-dark()` where supported. Hosts override it the same way as the
  light set.
- **THEME-06** Layout tokens (`--border-width`, line heights) participate
  in theming because the high contrast themes thicken borders. Themes
  MUST NOT need to change any layout property beyond these.
- **THEME-07** Colour pairs produced by the default tokens MUST meet WCAG
  2.2 AA contrast: text 4.5:1, large text and UI component boundaries
  3:1. The conformance suite checks the default, both accessible themes,
  and forced colors with axe.
- **THEME-08** A documented v2 token MUST keep its name and meaning for
  the life of spec 3.x. Undocumented v2 tokens (marked in the registry)
  are now documented and equally stable.
