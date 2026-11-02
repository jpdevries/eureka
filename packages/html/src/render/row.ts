// One listing row (02 HTML-62..69).
import { extname, iconForExtension, isCroppable, mediaKind, selectIsChecked, selectRecord, type FileEntry } from '@eureka/core';
import { attr, classes, html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';

const IMAGE_SIZES: Record<string, string> = { table: '(min-width: 40em) 40cqi, 100cqi', list: '10vh', thumb: '(min-width: 40em) 16cqi, 42cqi', grid: '(min-width: 40em) 25cqi, 100cqi', masonry: '(min-width: 40em) 20cqi, 100cqi' };

/** Break long filenames every 8 characters with <wbr> (HTML-67). */
export function breakableName(name: string): Raw {
  const parts: string[] = [];
  for (let i = 0; i < name.length; i += 8) parts.push(name.slice(i, i + 8));
  return raw(parts.map((p) => html`${p}`.value).join('<wbr>'));
}

export function media(ctx: Ctx, item: FileEntry, { controls = true, width, height }: { controls?: boolean; width?: number; height?: number } = {}): Raw {
  const { t, state } = ctx;
  const kind = mediaKind(item.filename);
  const src = item.absolutePreviewURL || item.absoluteURL;
  const alt = item.alt ?? '';
  const dims = item.dimensions ? attr('width', item.dimensions[0]).value + attr('height', item.dimensions[1]).value : '';
  switch (kind) {
    case 'image': {
      const rends = item.renditions ?? [];
      const img = html`<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${raw(dims)}${rends.length ? attr('sizes', IMAGE_SIZES[state.view.mode] ?? '100cqi') : ''}${rends.length ? attr('srcset', rends.filter((r) => !r.type || r.type === rends[0]!.type).map((r) => `${r.url} ${r.width}w`).join(', ')) : ''}>`;
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

export function actions(ctx: Ctx, item: FileEntry, idPrefix = ''): Raw {
  const { t, state: { config }, ids } = ctx;
  const n = item.filename;
  const btn = (kind: string, label: string, hiddenText: string, extra = '', cls = '') => html`<button type="button" class="${classes('eureka__action', cls)}" id="${ids.item(idPrefix + kind, item.filename)}" data-action="${kind}" data-path="${item.path}"${raw(extra)}>${label}${hidden(' ' + hiddenText)}</button>`;
  return html`<div class="eureka__button-bar eureka__context-buttons" role="toolbar" aria-label="${t('actions.for', { filename: n })}" data-row-actions>
    <a class="button eureka__action" id="${ids.item(idPrefix + 'expand', item.filename)}" href="${item.absoluteURL}" target="_blank" rel="noopener" data-action="expand">${t('expand')}${hidden(' ' + n)}</a>
    ${config.allowChoose ? btn('choose', t('choose'), n) : ''}
    ${config.allowCrop && isCroppable(n) ? btn('crop', t('crop'), n, '', 'eureka__crop-btn') : ''}
    ${config.allowRename ? btn('rename', t('rename'), n) : ''}
    ${config.allowDelete ? btn('delete', t('delete'), n, '', 'dangerous') : ''}
    ${config.allowDownload ? html`<a class="button eureka__action" id="${ids.item(idPrefix + 'download', item.filename)}" href="${item.absoluteURL}" download="${n}" data-action="download">${t('download')}${hidden(' ' + n)}</a>` : ''}
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
  return html`<tr id="${rowId}" class="${classes('eureka__row', { 'eureka__focused-media-item': focused })}" aria-label="${description}" data-path="${item.path}" data-kind="${mediaKind(item.filename)}"${raw(tabindex)}${attr('aria-selected', multiple ? String(checked) : null)}>
    ${multiple ? html`<td class="eureka__choose"><input type="checkbox" id="${checkboxId}" name="eureka__chosen_items" value="${item.filename}" aria-label="${t('choose.item', { filename: item.filename })}"${attr('checked', checked)} data-path="${item.path}"></td>` : ''}
    ${level === 0 ? html`<td class="eureka__select"><input type="radio" id="${radioId}" name="eureka__chosen_item" value="${item.filename}" aria-describedby="${mediaId}"></td>` : ''}
    <td class="eureka__td-media" id="${mediaId}">${mediaCell}</td>
    <td class="eureka__td-filename" id="${nameId}">${level === 0 ? html`<label for="${radioId}">${breakableName(item.filename)}</label>` : breakableName(item.filename)}</td>
    ${level > 0 ? html`<td class="eureka__context-row"${attr('hidden', !focused)}>${actions(ctx, item)}</td>` : ''}
    <td class="eureka__dimensions">${rec?.dimensionsText ?? ''}</td>
    <td class="eureka__file-size">${rec?.sizeText ?? ''}</td>
    <td class="eureka__edited-on"><time datetime="${datetime}"${attr('title', dateTitle)}>${rec?.dateShort ?? ''}</time></td>
  </tr>`;
}
