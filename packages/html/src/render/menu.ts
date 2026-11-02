// The row context menu (02 HTML-71, 05 KEY-29): one popover per instance, rendered for the row the
// element marks as its context target (Ctx.contextMenu), with the same actions, hints and
// data-action/data-path attributes as the row toolbar, so the element's click handling applies.
import { selectVisibleFiles } from '@mrktps/eureka-core';
import { attr, classes, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden } from './icon.js';
import { kbdHint, keyshortcuts } from './kbd.js';
import { rowActions } from './row.js';

export function contextMenu(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  const path = ctx.contextMenu?.path;
  if (level === 0 || !path) return html``;
  const item = selectVisibleFiles(state).find((f) => f.path === path);
  if (!item) return html``;
  const n = item.filename;
  const items = rowActions(ctx, item).map((a) => {
    const common = html`role="menuitem" tabindex="-1" class="${classes('eureka__menuitem', a.cls)}" data-action="${a.kind}" data-path="${item.path}"${a.action ? keyshortcuts(ctx, a.action) : ''}`;
    const body = html`<span class="eureka__menuitem-label">${a.label}${hidden(' ' + n)}</span>${a.action ? kbdHint(ctx, a.action) : ''}`;
    return a.href
      ? html`<a ${common} href="${a.href}"${attr('target', a.external ? '_blank' : null)}${attr('rel', a.external ? 'noopener' : null)}${attr('download', a.download ? n : null)}>${body}</a>`
      : html`<button type="button" ${common}>${body}</button>`;
  });
  return html`<div popover="manual" role="menu" id="${ids.id('context-menu')}" class="eureka__context-menu" aria-label="${t('actions.for', { filename: n })}" data-context-for="${item.path}">${items}</div>`;
}
