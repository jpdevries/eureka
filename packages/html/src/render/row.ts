// One listing row (02 HTML-62..69).
import { extname, iconForExtension, isCroppable, mediaKind, selectIsChecked, selectRecord, type FileEntry } from '@mrktps/eureka-core';
import { attr, classes, html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';
import { kbdHint, keyshortcuts } from './kbd.js';

const IMAGE_SIZES: Record<string, string> = { table: '(min-width: 40em) 40cqi, 100cqi', list: '10vh', thumb: '(min-width: 40em) 16cqi, 42cqi', grid: '(min-width: 40em) 25cqi, 100cqi', masonry: '(min-width: 40em) 20cqi, 100cqi' };

/** Break long filenames every 8 characters with <wbr> (HTML-67). */
export function breakableName(name: string): Raw {
  const parts: string[] = [];
  for (let i = 0; i < name.length; i += 8) parts.push(name.slice(i, i + 8));
  return raw(parts.map((p) => html`${p}`.value).join('<wbr>'));
}

/** Is this animated item playing? Either asked for by the user or because every preview animates (view.animate). */
export function isPlaying(ctx: Ctx, item: FileEntry): boolean { return !!item.animated && ctx.level > 0 && (ctx.state.view.animate || !!ctx.playing?.has(item.path)); }

export function media(ctx: Ctx, item: FileEntry, { controls = true, width, height }: { controls?: boolean; width?: number; height?: number } = {}): Raw {
  const { t, state, level } = ctx;
  const kind = mediaKind(item.filename);
  const src = item.absolutePreviewURL || item.absoluteURL;
  const alt = item.alt ?? '';
  const dims = item.dimensions ? attr('width', item.dimensions[0]).value + attr('height', item.dimensions[1]).value : '';
  switch (kind) {
    case 'image': {
      const rends = item.renditions ?? [];
      const img = html`<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${raw(dims)}${rends.length ? attr('sizes', IMAGE_SIZES[state.view.mode] ?? '100cqi') : ''}${rends.length ? attr('srcset', rends.filter((r) => !r.type || r.type === rends[0]!.type).map((r) => `${r.url} ${r.width}w`).join(', ')) : ''}>`;
      if (item.animated && level > 0) { // still until played (02 HTML-66b); the element pauses or plays what the markup declares
        const playing = isPlaying(ctx, item);
        const ratio = item.dimensions ? ` style="aspect-ratio: ${item.dimensions[0]} / ${item.dimensions[1]}"` : '';
        if (extname(item.filename) === '.svg') return html`<object class="eureka__media-object" data="${src}" type="image/svg+xml" aria-hidden="true" tabindex="-1" data-animated data-playing="${String(playing)}"${raw(dims)}${raw(ratio)}>${img}</object>`;
        return html`<span class="eureka__media-animated" data-playing="${String(playing)}"${raw(ratio)}>${img}${playing ? '' : html`<canvas class="eureka__media-still" aria-hidden="true"${raw(dims)}></canvas>`}</span>`;
      }
      if (!rends.length) return img;
      const byType = new Map<string, typeof rends>();
      for (const r of rends) { const k = r.type ?? 'fallback'; byType.set(k, [...(byType.get(k) ?? []), r]); }
      const sources = [...byType.entries()].filter(([type]) => type.startsWith('image/') && (type === 'image/avif' || type === 'image/webp'))
        .map(([type, rs]) => html`<source type="${type}" sizes="${IMAGE_SIZES[state.view.mode] ?? '100cqi'}" srcset="${rs.map((r) => `${r.url} ${r.width}w`).join(', ')}">`);
      return html`<picture>${sources}${img}</picture>`;
    }
    case 'video': return html`<video${attr('width', width ?? 320)}${attr('height', height ?? 240)}${attr('controls', controls)} preload="metadata"><source src="${src}">${t('support.noVideo')}</video>`;
    case 'audio': return html`<audio${attr('controls', controls)} preload="none"><source src="${src}">${t('support.noAudio')}</audio>`;
    case 'pdf': return html`<object data="${src}" type="application/pdf"${attr('width', width ?? 320)}${attr('height', height ?? 240)}>${icon(ctx, 'file-pdf-o')} ${item.filename}</object>`;
    default: return html`<p class="eureka__file-placeholder">${icon(ctx, iconForExtension(extname(item.filename)))} <span>${item.filename}</span></p>`;
  }
}

/** One action a row offers (HTML-68): the toolbar and the context menu (HTML-71) render the same list. */
export interface RowAction { kind: string; label: string; action?: string; cls?: string; href?: string; target?: string; download?: boolean }

/** The row's named browsing context for Expand (HTML-68): its id, which is a valid name because it never starts with "_". */
export function rowTargetName(ctx: Ctx, item: FileEntry): string { const id = ctx.ids.item('row', item.filename); return id.startsWith('_') ? `e${id}` : id; }

export function rowActions(ctx: Ctx, item: FileEntry): RowAction[] {
  const { t, state: { config } } = ctx;
  const n = item.filename;
  const list: RowAction[] = [{ kind: 'expand', label: t('expand'), action: 'expandItem', href: item.absoluteURL, target: rowTargetName(ctx, item) }];
  if (item.animated && ctx.level > 0) list.push({ kind: 'play', label: t(isPlaying(ctx, item) ? 'animation.pause' : 'animation.play'), action: 'toggleAnimation', cls: 'eureka__play-btn' });
  if (config.allowChoose) list.push({ kind: 'choose', label: t('choose'), action: 'chooseItem' });
  if (config.allowCrop && isCroppable(n)) list.push({ kind: 'crop', label: t('crop'), cls: 'eureka__crop-btn' });
  if (config.allowRename) list.push({ kind: 'rename', label: t('rename'), action: 'renameItem' });
  if (config.allowDelete) list.push({ kind: 'delete', label: t('delete'), action: 'deleteItem', cls: 'dangerous' });
  if (config.allowDownload) list.push({ kind: 'download', label: t('download'), action: 'downloadItem', href: item.absoluteURL, download: true });
  return list;
}

export function actions(ctx: Ctx, item: FileEntry, idPrefix = ''): Raw {
  const { t, ids, level } = ctx;
  const n = item.filename;
  // One tab stop per toolbar (05 KEY-B2): the first control is tabbable, the rest are reached with the arrow keys.
  const roving = (i: number) => (level > 0 ? ` tabindex="${i === 0 ? 0 : -1}"` : '');
  const controls = rowActions(ctx, item).map((a, i) => {
    const keys = a.action ? keyshortcuts(ctx, a.action) : '';
    const body = html`${a.label}${hidden(' ' + n)}${a.action ? kbdHint(ctx, a.action) : ''}`;
    if (a.href) return html`<a class="button eureka__action" id="${ids.item(idPrefix + a.kind, item.filename)}" href="${a.href}"${attr('target', a.target ?? null)}${attr('download', a.download ? n : null)} data-action="${a.kind}"${raw(roving(i))}${keys}>${body}</a>`;
    return html`<button type="button" class="${classes('eureka__action', a.cls)}" id="${ids.item(idPrefix + a.kind, item.filename)}" data-action="${a.kind}" data-path="${item.path}"${raw(roving(i))}${keys}>${body}</button>`;
  });
  return html`<div class="eureka__button-bar eureka__context-buttons" role="toolbar" aria-label="${t('actions.for', { filename: n })}" data-row-actions>
    ${controls}
  </div>`;
}

export function row(ctx: Ctx, item: FileEntry, index: number): Raw {
  const { state, t, ids, level } = ctx;
  const rec = selectRecord(state, item.path);
  const description = rec?.description ?? item.filename;
  const multiple = level > 0 && state.view.chooseMode === 'multiple';
  const focused = state.selection.focused === item.path;
  const checked = multiple && selectIsChecked(state, item.path);
  const rowId = ids.item('row', item.filename);
  const mediaId = ids.item('media', item.filename);
  const nameId = ids.item('filename', item.filename);
  const radioId = ids.item('radio', item.filename);
  const checkboxId = ids.item('check', item.filename);
  const tabindex = level === 0 ? '' : attr('tabindex', focused || (index === 0 && !state.selection.focused) ? 0 : -1).value;
  const mediaCell = level === 0 && mediaKind(item.filename) === 'image'
    ? html`<a href="${item.absoluteURL}" target="_blank" rel="noopener" aria-label="${t('file.openInNewTab', { filename: item.filename })}">${media(ctx, item)}</a>`
    : media(ctx, item);
  const dateTitle = rec?.dateLong ?? '';
  const datetime = new Date(item.editedOn).toISOString();
  return html`<tr id="${rowId}" class="${classes('eureka__row', { 'eureka__focused-media-item': focused, 'eureka__context-anchor': ctx.contextMenu?.path === item.path })}" aria-label="${description}" data-path="${item.path}" data-kind="${mediaKind(item.filename)}"${raw(tabindex)}${attr('aria-selected', multiple ? String(checked) : null)}>
    ${multiple ? html`<td class="eureka__choose"><input type="checkbox" id="${checkboxId}" name="eureka__chosen_items" value="${item.filename}" aria-label="${t('choose.item', { filename: item.filename })}"${attr('checked', checked)} data-path="${item.path}"></td>` : ''}
    ${level === 0 ? html`<td class="eureka__select"><input type="radio" id="${radioId}" name="eureka__chosen_item" value="${item.filename}" aria-describedby="${mediaId}"></td>` : ''}
    <td class="eureka__td-media" id="${mediaId}">${mediaCell}${item.animated ? (level > 0
      ? html`<button type="button" class="eureka__badge eureka__badge--animated" data-action="play" data-path="${item.path}" tabindex="-1" aria-pressed="${String(isPlaying(ctx, item))}" aria-label="${t(isPlaying(ctx, item) ? 'animation.pause' : 'animation.play')} ${item.filename}">${icon(ctx, isPlaying(ctx, item) ? 'pause' : 'caret-right')}</button>`
      : html`<span class="eureka__badge eureka__badge--animated">${icon(ctx, 'caret-right')}${hidden(t('media.animated'))}</span>`) : ''}</td>
    <td class="eureka__td-filename" id="${nameId}">${level === 0 ? html`<label for="${radioId}">${breakableName(item.filename)}</label>` : breakableName(item.filename)}</td>
    ${level > 0 ? html`<td class="eureka__context-row"${attr('hidden', !focused)}>${actions(ctx, item)}</td>` : ''}
    <td class="eureka__dimensions">${rec?.dimensionsText ?? ''}</td>
    <td class="eureka__file-size">${rec?.sizeText ?? ''}</td>
    <td class="eureka__edited-on"><time datetime="${datetime}"${attr('title', dateTitle)}>${rec?.dateShort ?? ''}</time></td>
  </tr>`;
}
