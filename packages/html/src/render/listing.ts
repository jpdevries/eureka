// The listing table (02 §6) with its header and empty states.
import { selectVisibleFiles, type FileEntry, type SortBy } from '@eureka/core';
import { attr, classes, html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';
import { hidden, icon } from './icon.js';
import { row } from './row.js';

const COLUMNS: Array<{ key: string; sort?: SortBy; label: string; cls: string }> = [
  { key: 'media', label: 'media', cls: 'eureka__th-media' },
  { key: 'name', sort: 'filename', label: 'name', cls: 'eureka__th-filename' },
  { key: 'actions', label: 'actions', cls: 'eureka__th-actions visually-hidden' },
  { key: 'dimensions', sort: 'dimensions', label: 'dimensions', cls: 'eureka__th-dimensions' },
  { key: 'fileSize', sort: 'fileSize', label: 'fileSize', cls: 'eureka__th-file-size' },
  { key: 'editedOn', sort: 'editedOn', label: 'editedOn', cls: 'eureka__th-edited-on' }
];

function header(ctx: Ctx): Raw {
  const { state, t, level } = ctx;
  const multiple = level > 0 && state.view.chooseMode === 'multiple';
  const cells = COLUMNS.filter((c) => !(level === 0 && c.key === 'actions')).map((c) => {
    const sorted = c.sort && state.view.sort.by === c.sort;
    const content = c.sort && level > 0
      ? html`<button type="button" class="eureka__sort-button" data-sort-by="${c.sort}" aria-pressed="${String(!!sorted)}">${t(c.label)} ${icon(ctx, sorted ? (state.view.sort.dir === 'ascending' ? 'sort-asc' : 'sort-desc') : 'sort')}${hidden(sorted ? ` (${t(state.view.sort.dir === 'ascending' ? 'sort.ascending' : 'sort.descending')})` : '')}</button>`
      : html`${t(c.label)}`;
    return html`<th scope="col" class="${c.cls}"${attr('aria-sort', sorted ? state.view.sort.dir : null)}>${content}</th>`;
  });
  return html`<thead><tr>${multiple ? html`<th scope="col" class="eureka__choose">${hidden(t('choose'))}</th>` : ''}${level === 0 ? html`<th scope="col" class="eureka__select">${hidden(t('select'))}</th>` : ''}${cells}</tr></thead>`;
}

function emptyState(ctx: Ctx, colSpan: number): Raw {
  const { state, t, ids } = ctx;
  const cd = state.listing.path;
  let body: Raw;
  if (state.listing.status === 'loading') body = html`<span class="spinner">${icon(ctx, 'circle-o-notch')}</span><br>${t('contents.fetchingContents', { cd })}`;
  else if (state.listing.status === 'error') body = html`${state.listing.error ?? 'Error'}`;
  else if (state.view.filter) body = html`${t('search.noResults', { filter: state.view.filter })}. <a href="#${ids.id('filter')}" data-action="focus-filter">${t('search.tryAnother')}</a> ${t('grammar.or')} <a href="#${ids.id('filter')}" data-action="clear-filter">${t('search.clearFilter')}</a>.`;
  else body = html`${t('directory.appearsToBeEmpty', { cd })}${ctx.level > 0 && state.config.allowUploads ? html`<br>${t('perhapsYouWouldLikeTo')} <a href="#${ids.id('upload')}" data-action="upload">${t('upload.someFiles')}${hidden(' ' + t('grammar.to') + ' ' + cd)}</a>?` : ''}`;
  return html`<tr class="eureka__empty-row"><td colspan="${colSpan}" class="comfortable"><p class="alert-info eureka__notice" role="status">${body}</p></td></tr>`;
}

/** A row, or a keep-placeholder when its markup is unchanged since the previous render (Ctx.rowMemo). */
function memoRow(ctx: Ctx, f: FileEntry, i: number): Raw {
  const memo = ctx.rowMemo;
  if (!memo) return row(ctx, f, i);
  const markup = row(ctx, f, i).value;
  memo.next.set(f.path, markup);
  if (memo.previous.get(f.path) === markup) return html`<tr id="${ctx.ids.item('row', f.filename)}" data-eureka-keep></tr>`;
  return raw(markup);
}

export function listing(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  const files = selectVisibleFiles(state);
  const multiple = level > 0 && state.view.chooseMode === 'multiple';
  const colSpan = COLUMNS.length - (level === 0 ? 1 : 0) + (multiple ? 1 : 0) + (level === 0 ? 1 : 0);
  // Level 1+: the rows are a keyboard widget (arrow keys, one tab stop), which ARIA calls a grid (02 HTML-60). Screen readers
  // switch to focus mode on a grid, so the arrow keys reach the browser instead of the virtual cursor.
  const grid = level > 0 ? raw(` role="grid" aria-describedby="${ids.id('listing-help')}"${multiple ? ' aria-multiselectable="true"' : ''}`) : '';
  const help = level > 0 ? html`<p class="visually-hidden" id="${ids.id('listing-help')}">${t('listing.instructions')}</p>` : '';
  return html`${help}<table class="eureka__table" id="${ids.id('table')}" data-count="${files.length}"${grid}>
    <caption class="visually-hidden" id="${ids.id('caption')}">${t('listing.caption', { cd: state.listing.path })}, ${t('listing.count', { n: files.length })}</caption>
    ${header(ctx)}
    <tbody class="${classes({ empty: files.length === 0 })}">${files.length ? files.map((f, i) => memoRow(ctx, f, i)) : emptyState(ctx, colSpan)}</tbody>
  </table>`;
}
