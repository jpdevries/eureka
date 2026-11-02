import { html, type Child, type Raw } from '../html.js';
import type { Ctx } from '../model.js';

/** Decorative inline SVG from the sprite (02 §9, 06 A11Y-04). */
export const icon = (ctx: Ctx, name: string, extraClass = ''): Raw =>
  html`<svg aria-hidden="true" focusable="false" class="icon icon-${name}${extraClass ? ' ' + extraClass : ''}"><use href="${ctx.iconSprite}#icon-${name}"></use></svg>`;

export const hidden = (text: Child): Raw => html`<span class="visually-hidden">${text}</span>`;
