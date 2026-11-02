// Stage header (heading, choose mode, filter) and the listing toolbar (02 §5).
import { combineSourcePath, selectFiles, VIEW_MODES, type ViewMode } from '@eureka/core';
import { attr, classes, html, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';

const MODE_LABEL: Record<ViewMode, string> = { table: 'layout.table', thumb: 'layout.thumb', grid: 'layout.grid', list: 'layout.list', masonry: 'layout.masonry' };
const MODE_TITLE: Record<ViewMode, string> = { table: 'layout.tabular', thumb: 'layout.thumbnail', grid: 'layout.grid', list: 'layout.list', masonry: 'layout.masonry' };
const MODE_ICON: Record<ViewMode, string> = { table: 'th-list', thumb: 'th-large', grid: 'square', list: 'list', masonry: 'masonry' };

export function stageHeader(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  const cd = state.listing.path;
  const multiple = state.view.chooseMode === 'multiple';
  const chooseRadios = level > 0 && state.config.allowChooseMultiple && state.config.allowChoose ? html`<fieldset class="eureka__choose-radio"><legend>${t('chooseItems')}</legend>
      <input type="radio" id="${ids.id('choose-single')}" name="${ids.id('choose-mode')}" value="single"${attr('checked', !multiple)}><label for="${ids.id('choose-single')}">${t('choose.single')}</label>
      <input type="radio" id="${ids.id('choose-multiple')}" name="${ids.id('choose-mode')}" value="multiple"${attr('checked', multiple)}><label for="${ids.id('choose-multiple')}">${t('choose.multiple')}</label>
      ${multiple && state.config.allowInvertSelection ? html`<input type="checkbox" id="${ids.id('invert')}" name="${ids.id('invert')}"${attr('checked', state.selection.inverted)}><label for="${ids.id('invert')}">${t('invert')}${hidden(' ' + t('selection'))}</label>` : ''}
    </fieldset>` : '';
  const filter = level > 0 ? html`<search><form class="eureka__search-bar" role="search" data-form="filter">
      <label for="${ids.id('filter')}">${t('filter')}${hidden(' ' + t('contents.ofby', { cd }))}:</label>
      <input type="search" id="${ids.id('filter')}" name="eureka__filter" list="${ids.id('datalist')}" autocomplete="off" value="${state.view.filter}"${attr('placeholder', placeholder(ctx))}>
      <datalist id="${ids.id('datalist')}">${selectFiles(state).map((f) => html`<option value="${f.filename}"></option>`)}</datalist>
    </form></search>` : '';
  return html`<header class="eureka__stage__filter-view">
    <h2 id="${ids.id('heading')}">${hidden(t('media.browse') + ' ')}${t('media.contents')}</h2>
    ${chooseRadios}
    ${filter}
  </header>`;
}

function placeholder(ctx: Ctx): string {
  const files = selectFiles(ctx.state);
  const f = files[Math.floor(files.length / 2)];
  if (!f) return '';
  const rec = ctx.state.listing.records[f.path];
  return rec?.dimensionsText || rec?.sizeText || f.filename;
}

export function directorySelector(ctx: Ctx): Raw {
  const { state, t, ids } = ctx;
  const uid = state.config.uid;
  const current = combineSourcePath(String(state.listing.source ?? ''), state.listing.path);
  const groups = state.sources.all.map((src) => {
    const nodes = state.tree.bySource[String(src.id)] ?? [];
    const flat: string[] = [];
    const walk = (ns: typeof nodes) => { for (const n of ns) { flat.push(n.cd); if (n.children) walk(n.children); } };
    walk(nodes);
    return html`<optgroup label="${src.name}" data-source="${src.id}">
      <option value="${combineSourcePath(String(src.id), '/')}"${attr('selected', combineSourcePath(String(src.id), '/') === current)}>./</option>
      ${flat.sort().map((cd) => html`<option value="${combineSourcePath(String(src.id), cd)}"${attr('selected', combineSourcePath(String(src.id), cd) === current)}>${cd}</option>`)}
    </optgroup>`;
  });
  const selectEl = html`<select id="${ids.id('browsing')}" name="eureka__media-browser_${uid}__browsing" data-control="browsing">${groups}</select>`;
  const inner = html`<label for="${ids.id('browsing')}">${t('directory.browse')}:</label> ${selectEl} ${ctx.level === 0 ? html`<button type="submit" name="eureka__action" value="navigate">${t('directory.set')}</button>` : ''}`;
  return html`<div class="eureka__media-directory-selector">${ctx.level === 0 ? inner : html`<form action="#" data-form="browsing">${inner}</form>`}</div>`;
}

export function uploadControl(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  if (!state.config.allowUploads) return html``;
  const cd = state.listing.path;
  const uploading = state.pending.uploading;
  const input = html`<input type="file" id="${ids.id('upload')}" name="eureka__uploadFiles" multiple${attr('disabled', uploading)}>`;
  const label = html`<label for="${ids.id('upload')}">${uploading ? html`<span class="spinner">${icon(ctx, 'circle-o-notch')}</span>${t('upload.dragFilesUploading')}` : t('upload.files')}${hidden(' ' + t('grammar.to') + ' ' + cd)}${level === 0 ? ':' : ''}</label>`;
  if (level === 0) return html`<div class="eureka__upload-form"><div>${label} ${input} <button type="submit" name="eureka__action" value="upload">${t('upload.files')}</button></div></div>`;
  return html`<div class="eureka__upload-form"><form enctype="multipart/form-data" method="post" data-form="upload">${input}${label}</form></div>`;
}

export function toolbar(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  if (level === 0) return html`<div class="eureka__tree-toggle eureka__toolbar">${directorySelector(ctx)}${uploadControl(ctx)}</div>`;
  const open = state.view.panelOpen;
  const toggle = html`<div><button type="button" id="${ids.id('tree-toggle')}" class="eureka__panel-toggle" aria-controls="${ids.id('pathbrowser')}" aria-expanded="${String(open)}" data-action="toggle-panel">${t('panel.toggle')}</button></div>`;
  const sort = html`<form class="eureka__sort-select" data-form="sort">
      <label for="${ids.id('sort-by')}">${t('sortBy')}:</label>
      <select id="${ids.id('sort-by')}" name="eureka__sort-by" data-control="sort-by">${(['filename', 'dimensions', 'fileSize', 'editedOn'] as const).map((k) => html`<option value="${k}"${attr('selected', state.view.sort.by === k)}>${t({ filename: 'name', dimensions: 'dimensions', fileSize: 'fileSize', editedOn: 'editedOn' }[k])}</option>`)}</select>
      <label for="${ids.id('sort-dir')}">${t('sort.direction')}:</label>
      <select id="${ids.id('sort-dir')}" name="eureka__sort-direction" data-control="sort-dir">${(['ascending', 'descending'] as const).map((d) => html`<option value="${d}"${attr('selected', state.view.sort.dir === d)}>${t(d === 'ascending' ? 'sort.ascending' : 'sort.descending')}</option>`)}</select>
    </form>`;
  const modes = VIEW_MODES.filter((m) => m !== 'masonry' || state.config.allowMasonry);
  const chooser = html`<form class="eureka__layout-chooser" data-form="view"><fieldset><legend class="visually-hidden">${t('layout.viewMode')}</legend><div class="eureka__icon-radio-btns">
      ${modes.map((m) => html`<div><input type="radio" id="${ids.id('view-' + m)}" name="eureka__view" value="${m}"${attr('checked', state.view.mode === m)}><label for="${ids.id('view-' + m)}" title="${t(MODE_TITLE[m])}">${icon(ctx, MODE_ICON[m])}${hidden(t(MODE_LABEL[m]))}</label></div>`)}
      ${state.config.allowFullscreen ? html`<div><input type="checkbox" id="${ids.id('fullscreen')}" name="eureka__fullscreen"${attr('checked', state.view.fullscreen)}><label for="${ids.id('fullscreen')}" class="${classes({ 'eureka__checked-active': state.view.fullscreen })}">${hidden(t('layout.fullscreenMode'))}${icon(ctx, state.view.fullscreen ? 'compress' : 'expand')}</label></div>` : ''}
      <div><button type="button" class="eureka__help-button" id="${ids.id('shortcuts')}" data-action="shortcuts" aria-haspopup="dialog">${hidden(t('shortcuts'))}<kbd aria-hidden="true">?</kbd></button></div>
    </div></fieldset></form>`;
  return html`<div class="eureka__tree-toggle eureka__toolbar" role="toolbar" aria-label="${t('toolbar.listingControls')}">
    ${toggle}
    ${open ? '' : directorySelector(ctx)}
    ${sort}
    ${open ? '' : uploadControl(ctx)}
    ${chooser}
  </div>`;
}
