// The instance root: Level 0 form (03) or the enhanced <div> (02 §1-2).
import { classes, html, jsonForScript, type Raw } from '../html.js';
import { hydrationState, type Ctx } from '../model.js';
import { notifications, pathBar, chooseBar } from './bars.js';
import { dialogs } from './dialogs.js';
import { listing } from './listing.js';
import { sourcePanel } from './panel.js';
import { stageHeader, toolbar } from './toolbar.js';
import { hidden } from './icon.js';

export function instance(ctx: Ctx): Raw {
  const { state, t, ids, level } = ctx;
  const mode = state.view.mode;
  const cls = classes('eureka', `eureka__view-mode__${mode}`, { 'eureka__choose-multiple': level > 0 && state.view.chooseMode === 'multiple', 'eureka__server-side': level === 0, 'eureka__enlarge-focused-rows': state.config.enlargeFocusedRows, 'eureka__uploading': state.pending.uploading });
  const body = html`<div class="eureka__browse-content">
      ${level > 0 ? sourcePanel(ctx) : ''}
      <div class="eureka__stage">
        ${stageHeader(ctx)}
        ${toolbar(ctx)}
        <div class="eureka__table-wrapper">${listing(ctx)}</div>
      </div>
    </div>`;
  if (level === 0) {
    const uploaded = ctx.uploaded?.length ? html`<p class="alert-info eureka__notice" role="status">${t('uploaded.nFiles', { n: ctx.uploaded.length, cd: state.listing.path })}</p>` : '';
    return html`<form class="${cls}" method="post" action="${state.config.basePath}" enctype="multipart/form-data" lang="${state.locale.tag}" data-view="${mode}" data-choose="single" data-level="0">
      <input type="hidden" name="eureka__mediaSourceId" value="${String(state.listing.source ?? '')}">
      <input type="hidden" name="eureka__upload-dir" value="${state.listing.path}">
      ${uploaded}
      ${body}
      ${chooseBar(ctx)}
    </form>
    <script type="application/json" id="${ids.id('state')}">${jsonForScript(hydrationState(state))}</script>`;
  }
  return html`<div class="${cls}" lang="${state.locale.tag}" data-view="${mode}" data-choose="${state.view.chooseMode}" data-level="1" role="region" aria-label="${t('media.browser')}">
    ${notifications(ctx)}
    ${body}
    ${pathBar(ctx)}
    ${chooseBar(ctx)}
    ${dialogs(ctx)}
    ${hidden(html`<span aria-live="polite" id="${ids.id('announcer')}" data-announcer></span>`)}
  </div>`;
}
