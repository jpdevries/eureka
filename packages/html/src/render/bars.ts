// Notifications, the path bar and the choose bar (02 §3, §7, §8).
import { selectChosen, selectFocused, type FileEntry } from '@mrktps/eureka-core';
import { attr, html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';
import { actions, media } from './row.js';

export function notifications(ctx: Ctx): Raw {
  const { state, t } = ctx;
  const info = state.notifications.filter((n) => n.kind === 'info');
  const danger = state.notifications.filter((n) => n.kind === 'danger');
  const item = (n: typeof info[number]) => html`<div class="eureka__notification${n.kind === 'danger' ? ' eureka__dangerous' : ''}" data-notification="${n.id}"><p>${icon(ctx, n.kind === 'danger' ? 'exclamation-triangle' : 'info-circle')} ${n.message}${n.learnMore ? html` <a href="${n.learnMore}" target="_blank" rel="noopener">${t('welcome.learnMore')}</a>` : ''}</p><button type="button" aria-label="${t('notification.dismiss')}" data-action="dismiss" data-id="${n.id}">${icon(ctx, 'times')}</button></div>`;
  return html`<div class="eureka__notification-wrapper${state.notifications.some((n) => n.sticky) ? ' eureka__sticky-bar' : ''}">
    <div role="status" aria-live="polite" class="eureka__notifications eureka__notifications--info">${info.map(item)}</div>
    <div role="alert" class="eureka__notifications eureka__notifications--danger">${danger.map(item)}</div>
  </div>`;
}

export function pathBar(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const focused = selectFocused(state);
  const chosen = state.view.chooseMode === 'multiple' ? selectChosen(state) : [];
  const item: FileEntry | null = focused ?? chosen[0] ?? null;
  const show = item !== null || chosen.length > 0;
  if (!show) return html`<div class="eureka__pathbar" id="${ids.id('selected_file_names')}" role="status" hidden></div>`;
  const rec = item ? state.listing.records[item.path] : undefined;
  const many = chosen.length > 1;
  const names = chosen.map((c) => c.filename);
  const list = many ? html`<textarea class="eureka__selected-list" readonly rows="${Math.min(10, Math.max(2, Math.ceil(names.join(', ').length / 60)))}" aria-label="${t('copyListofSelectedFiles')}" data-select-all>${names.join(', ')}</textarea>` : '';
  const listBlock = chosen.length > 12 ? html`<details open><summary>${t('selectedPaths')}</summary>${list}</details>` : list;
  const main = item && !many
    ? html`<a href="${item.absoluteURL}" target="_blank" rel="noopener">${icon(ctx, rec?.icon ?? 'file-o')} ${item.path}</a>`
    : html`${icon(ctx, 'folder-open')} ${state.listing.path} (${t('listing.count', { n: chosen.length })})`;
  return html`<div class="eureka__pathbar" id="${ids.id('selected_file_names')}" role="status">
    <div class="eureka__pathbar__main">${main}${listBlock}</div>
    ${item ? html`<details class="eureka__pathbar__details eureka__hide-for-mobile-up"><summary>${t('details')}</summary><div class="eureka__pathbar__preview">${media(ctx, item, { controls: false })}</div>${actions(ctx, item, 'pathbar-')}</details>` : ''}
  </div>`;
}

export function chooseBar(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  const config = state.config;
  if (level > 0 && !config.callbacks.choose && !config.callbacks.close) return html``;
  const chosen = level > 0 ? selectChosen(state) : [];
  const focused = selectFocused(state);
  const n = chosen.length;
  const many = state.view.chooseMode === 'multiple' && n > 1;
  const chooseLabel = many ? t('choose.nItems', { n }) : html`${t('choose')}${hidden(' ' + (focused?.filename ?? t('mediaItem')))}`;
  const bulkForm = (action: 'delete' | 'download', field: string, label: string, cls: string) => html`<form class="eureka__bulk-form" method="post" enctype="multipart/form-data" data-form="${action}-many"${attr('action', action === 'download' ? '#' : null)}>
      <input type="hidden" name="cd" value="${state.listing.path}"><input type="hidden" name="cs" value="${String(state.listing.source ?? '')}">
      ${chosen.map((c) => html`<input type="hidden" name="${field}" value="${c.filename}">`)}
      <button type="submit" class="${cls}">${label}</button></form>`;
  return html`<div class="eureka__button-bar eureka__choose-bar">
    ${level === 0 || config.callbacks.close ? html`<button type="${level === 0 ? 'reset' : 'button'}" class="dangerous" data-action="close">${t('cancel')}${hidden(': ' + t('close.mediaBrowser'))}</button>` : ''}
    ${many && config.allowDownloadMultiple ? bulkForm('download', 'zip_file[]', t('download.nItems', { n }), 'eureka__gratious') : ''}
    ${many && config.allowDelete ? bulkForm('delete', 'delete_file[]', t('delete.nItems', { n }), 'dangerous') : ''}
    ${config.allowChoose ? html`<button type="${level === 0 ? 'submit' : 'button'}" class="eureka__primary" id="${ids.id('choose-button')}" aria-describedby="${ids.id('selected_file_names')}"${attr('disabled', level > 0 && n === 0)} data-action="choose"${level === 0 ? raw(' name="eureka__action" value="choose"') : ''}>${chooseLabel}</button>` : ''}
  </div>`;
}
