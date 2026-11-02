# @mrktps/eureka-css

The stylesheet (`dist/eureka.css`) and icon sprite (`assets/icons.svg`).
Built by `node build.mjs`, which generates the token defaults block from
`spec/data/theme-tokens.json` and concatenates `src/*.css` in layer order.

Layers: `eureka.base` (resets, focus, visually-hidden), `eureka.layout`
(frame, row grids, the five modes, masonry tiers), `eureka.components`
(controls, panels, dialogs, notifications), `eureka.theme` (tokens, dark
scheme, accessible themes, forced colors). Host CSS outside any layer wins.

Layout is driven by container queries on `.eureka-root` (`container:
eureka / inline-size`) with one breakpoint at 40em (spec 04). The listing
is one table; modes reflow it through `grid-template-areas` keyed on
`[data-view]`, `[data-choose]` and `[data-level]` on the instance root.
Masonry is CSS only: native masonry where supported, otherwise a dense grid
with spans from `--eureka-aspect`.

Give `.eureka-root` a bounded block size (or add `eureka-root--fill`) to
make the listing body scroll inside the frame; without one the instance
grows with its content and the page scrolls.
