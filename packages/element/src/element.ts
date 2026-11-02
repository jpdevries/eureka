// <eureka-browser>: light-DOM custom element over @eureka/core and @eureka/html.
// It enhances the server-rendered Level 0 form (hydrating from the embedded
// state) or renders itself from the API when there is none, and from then on
// re-renders the instance markup from state through a keyed morph, so focus,
// scroll position and media playback survive updates.
import {
  ancestors, basename, buildDisplayRecord, catalogCandidates, createEngineClient, createKeymap, createStore, createTranslator, initialState, joinPath, loadPersisted, markWelcomed, normalizePath, persist, resolveLocale, selectChosen, selectFocused, selectVisibleFiles, splitSourcePath, VIEW_MODES,
  type Catalog, type Config, type DialogKind, type DisplayRecord, type EngineClient, type Entry, type Event as EurekaEvent, type FileEntry, type Keymap, type PartialConfig, type SortBy, type SortDir, type SourceId, type State, type Store, type Translator, type ViewMode
} from '@eureka/core';
import { createIds, instance, type Ctx, type Ids } from '@eureka/html';
import { ATTRIBUTES, buildConfig } from './config.js';
import { fragmentFrom, morphChildren } from './morph.js';

interface Hydrated {
  location?: 'requested' | 'default';
  sources?: State['sources'];
  tree?: State['tree'];
  listing?: { source: SourceId; path: string; entries: Entry[]; status?: string };
}

const AUTO_DISMISS_MS = 8000;
const TEXT_FIELD = 'input:not([type=checkbox]):not([type=radio]):not([type=file]):not([type=submit]):not([type=button]):not([type=reset]), textarea, select, [contenteditable=""], [contenteditable="true"]';

function safeStorage(): Storage | null { try { return globalThis.localStorage ?? null; } catch { return null; } }
function errorMessage(err: unknown): string { return err instanceof Error ? err.message : String(err); }

export class EurekaBrowser extends HTMLElement {
  static get observedAttributes(): string[] { return [...ATTRIBUTES]; }

  #userConfig: PartialConfig | undefined;
  #config!: Config;
  #store!: Store;
  #engine!: EngineClient;
  #t!: Translator;
  #ids!: Ids;
  #keymap!: Keymap;
  #iconSprite = '';
  #started = false;
  #starting = false;
  #queued = false;
  #abort: AbortController | null = null;
  #timers = new Set<ReturnType<typeof setTimeout>>();
  #dialogOpener: Element | null = null;
  #focusNext: (() => Element | null | undefined) | null = null;
  #announcement = '';
  #dragging = false;
  #storage: Storage | null = null;
  #restartQueued = false;
  #rowMarkup = new Map<string, string>(); // last rendered row markup by path (PERF-11)

  constructor() {
    super();
    // a `config` set before the element was upgraded shadows the accessor; lift it
    if (Object.prototype.hasOwnProperty.call(this, 'config')) {
      const v = (this as unknown as { config: PartialConfig }).config;
      delete (this as unknown as { config?: PartialConfig }).config;
      this.#userConfig = v;
    }
  }

  // ---- host API (07 STATE-52) ------------------------------------------------------
  get config(): PartialConfig | undefined { return this.#userConfig; }
  set config(v: PartialConfig | undefined) { this.#userConfig = v; if (this.#started) this.#queueRestart(); }
  /** Read-only snapshot of the store. */
  get state(): State | undefined { return this.#store?.getState(); }
  get store(): Store | undefined { return this.#store; }
  get engineMode(): 'worker' | 'inline' | undefined { return this.#engine?.mode; }

  async navigate(source: SourceId | string, path: string): Promise<void> {
    if (!this.#started) return;
    const sid = this.#sourceId(source);
    const state = this.#store.getState();
    if (String(sid) !== String(state.listing.source)) { this.#store.dispatch({ type: 'source/select', id: sid }); void this.#loadTree(sid); }
    await this.#loadDirectory(sid, path);
  }
  setView(mode: ViewMode): void { if (this.#started && VIEW_MODES.includes(mode)) this.#store.dispatch({ type: 'view/setMode', mode }); }
  async refresh(): Promise<void> { if (!this.#started) return; const s = this.#store.getState().listing; if (s.source !== null) await this.#loadDirectory(s.source, s.path); }
  /** Choose the effective selection (single: focused item; multiple: checked items). */
  choose(): void { this.#choose(); }

  // ---- lifecycle ----------------------------------------------------------------------
  connectedCallback(): void {
    if (this.#started || this.#starting) return;
    if (document.readyState === 'loading' && !this.firstElementChild) { document.addEventListener('DOMContentLoaded', () => { if (this.isConnected) void this.#start(); }, { once: true }); return; }
    void this.#start();
  }
  disconnectedCallback(): void { this.#teardown(); }
  attributeChangedCallback(): void { if (this.#started) this.#queueRestart(); }

  #queueRestart(): void {
    if (this.#restartQueued) return;
    this.#restartQueued = true;
    queueMicrotask(() => { this.#restartQueued = false; if (this.isConnected) { this.#teardown(); void this.#start(); } });
  }

  #teardown(): void {
    this.#abort?.abort(); this.#abort = null;
    for (const t of this.#timers) clearTimeout(t); this.#timers.clear();
    this.#engine?.terminate();
    this.#started = false;
  }

  async #start(): Promise<void> {
    this.#starting = true;
    const config = buildConfig(this, this.#userConfig);
    this.#config = config;
    const prefix = config.storagePrefix;
    this.#ids = createIds(prefix);
    this.#iconSprite = `${config.assetsBasePath.replace(/\/+$/, '')}/img/icons.svg`;
    this.#storage = config.useLocalStorage ? safeStorage() : null;
    const persisted = loadPersisted(this.#storage, prefix);
    const hydrated = this.#readHydration(prefix);
    const locale = resolveLocale(config.lang, document.documentElement.lang, navigator.languages);
    this.#t = createTranslator(locale);
    this.#keymap = createKeymap(config.keymap ? { overrides: config.keymap } : {});

    // A default server location yields to the visitor's persisted one; a requested location (POST navigate, ?path=) wins (07 STATE-40).
    let init: NonNullable<Parameters<typeof initialState>[0]['hydrated']> | undefined;
    if (hydrated) {
      const h = hydrated.listing;
      const samePlace = !!h && !!persisted.location && String(persisted.location.source) === String(h.source) && normalizePath(persisted.location.path) === normalizePath(h.path);
      const keepListing = !!h && (hydrated.location === 'requested' || !persisted.location || samePlace);
      const path = keepListing && h ? normalizePath(h.path) : normalizePath(persisted.location?.path ?? config.currentDirectory);
      init = {
        ...(hydrated.sources ? { sources: hydrated.sources } : {}),
        ...(hydrated.tree ? { tree: { ...hydrated.tree, open: [...new Set([...(hydrated.tree.open ?? []), ...(persisted.treeOpen ?? []), ...ancestors(path)])] } } : {}),
        ...(keepListing && h ? { listing: { source: h.source, path: normalizePath(h.path), entries: h.entries, records: {}, status: 'ready' as const, requestId: 0 } } : {})
      };
    }
    let state = initialState({ config, locale, persisted, ...(init ? { hydrated: init } : {}) });
    this.#store = createStore(state);
    const api = config.endpoints.api ?? config.basePath;
    const workerSetting = config.endpoints.worker;
    const workerUrl = workerSetting === 'inline' || workerSetting === 'none' ? null : workerSetting ? workerSetting : new URL('./eureka-worker.js', import.meta.url);
    this.#engine = createEngineClient({ locale, headers: config.headers, basePath: api, workerUrl });

    this.#bind();
    this.#started = true; this.#starting = false;
    this.#render();
    this.#store.subscribe((s) => { this.#queueRender(); persist(this.#storage, prefix, s); });

    if (init?.listing) this.#store.dispatch({ type: 'listing/records', records: this.#recordsFor(init.listing.entries, locale) });
    if (config.welcome && (config.alwaysWelcome || !persisted.welcomed)) this.#notify(this.#t('welcomeToEureka'), 'info', { sticky: true, learnMore: config.learnMore, id: 'welcome' });

    void this.#loadCatalog(locale);
    state = this.#store.getState();
    if (!init?.sources) await this.#loadSources();
    const source = this.#store.getState().listing.source;
    if (source === null) return;
    if (!init?.tree) void this.#loadTree(source);
    if (!init?.listing) await this.#loadDirectory(source, this.#store.getState().listing.path);
  }

  #readHydration(prefix: string): Hydrated | null {
    const script = this.querySelector(`script[type="application/json"]#${CSS.escape(prefix + 'state')}`);
    if (!script?.textContent) return null;
    try { const v = JSON.parse(script.textContent) as Hydrated; return v && typeof v === 'object' ? v : null; } catch { return null; }
  }

  #recordsFor(entries: Entry[], locale: string): Record<string, DisplayRecord> {
    const out: Record<string, DisplayRecord> = {};
    for (const e of entries) out[e.path] = buildDisplayRecord(e, { locale, t: this.#t });
    return out;
  }

  async #loadCatalog(locale: string): Promise<void> {
    const base = this.#config.endpoints.i18n;
    if (!base || locale.toLowerCase().startsWith('en')) return;
    this.#store.dispatch({ type: 'locale/catalogLoading' });
    for (const tag of catalogCandidates(locale)) {
      try {
        const res = await fetch(`${base.replace(/\/+$/, '')}/${tag}.json`, { headers: this.#config.headers });
        if (!res.ok) continue;
        const catalog = (await res.json()) as Catalog;
        this.#t = createTranslator(locale, catalog);
        this.#store.dispatch({ type: 'locale/catalogLoaded' });
        this.#store.dispatch({ type: 'listing/records', records: this.#recordsFor(this.#store.getState().listing.entries, locale) });
        return;
      } catch { /* try the next candidate */ }
    }
    this.#store.dispatch({ type: 'locale/catalogLoaded' });
  }

  // ---- rendering ---------------------------------------------------------------------
  #queueRender(): void {
    if (this.#queued) return;
    this.#queued = true;
    queueMicrotask(() => { if (this.#queued) this.#render(); });
  }

  #render(): void {
    this.#queued = false;
    if (!this.#started) return;
    const state = this.#store.getState();
    const next = new Map<string, string>();
    const ctx: Ctx = { state, t: this.#t, ids: this.#ids, level: 1, iconSprite: this.#iconSprite, rowMemo: { previous: this.#rowMarkup, next } };
    const byId = new Map<string, string>();
    morphChildren(this, fragmentFrom(instance(ctx).value), { resolveKeep: (id) => { if (!byId.size) for (const [p, m] of next) byId.set(this.#ids.item('row', basename(p)), m); return byId.get(id); } });
    this.#rowMarkup = next;
    this.#afterRender(state);
  }

  #afterRender(state: State): void {
    const dialog = this.querySelector<HTMLDialogElement>('dialog.eureka__modal');
    if (dialog && !dialog.open) { try { dialog.showModal(); } catch { dialog.setAttribute('open', ''); } }
    if (this.#focusNext) {
      const next = this.#focusNext(); this.#focusNext = null;
      if (next instanceof HTMLElement) next.focus();
    } else if (!dialog && this.#dialogOpener) {
      const opener = this.#dialogOpener; this.#dialogOpener = null;
      const active = document.activeElement;
      if ((!active || active === document.body || !this.contains(active)) && opener.isConnected && opener instanceof HTMLElement) opener.focus();
    }
    if (!dialog) this.#dialogOpener = null;
    const announcer = this.querySelector('[data-announcer]');
    if (announcer && announcer.textContent !== this.#announcement) announcer.textContent = this.#announcement;
    if (this.#dragging) this.#applyDragging(true);
    this.dispatchEvent(new CustomEvent('eureka-statechange', { detail: { state }, bubbles: true }));
  }

  #announce(text: string): void { this.#announcement = text; this.#queueRender(); }

  // ---- DOM events ----------------------------------------------------------------------
  #bind(): void {
    this.#abort = new AbortController();
    const signal = this.#abort.signal;
    const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void, opts: AddEventListenerOptions = {}) => this.addEventListener(type, fn as EventListener, { signal, ...opts });
    on('click', (e) => this.#onClick(e));
    on('change', (e) => this.#onChange(e));
    on('input', (e) => this.#onInput(e));
    on('submit', (e) => this.#onSubmit(e));
    on('focusin', (e) => this.#onFocusIn(e));
    on('keydown', (e) => this.#onKeyDown(e));
    on('dblclick', (e) => this.#onDblClick(e));
    on('toggle', (e) => this.#onToggle(e), { capture: true });
    on('close', (e) => this.#onDialogClose(e), { capture: true });
    on('dragenter', (e) => this.#onDrag(e));
    on('dragover', (e) => this.#onDrag(e));
    on('dragleave', (e) => { if (!(e.relatedTarget instanceof Node) || !this.contains(e.relatedTarget)) this.#setDragging(false); });
    on('drop', (e) => this.#onDrop(e));
    on('paste', (e) => this.#onPaste(e));
    document.addEventListener('fullscreenchange', () => this.#onFullscreenChange(), { signal });
  }

  #root(): HTMLElement | null { return this.querySelector<HTMLElement>(':scope > .eureka'); }
  #rows(): HTMLTableRowElement[] { return Array.from(this.querySelectorAll<HTMLTableRowElement>('tbody > tr[data-path]')); }
  #filterInput(): HTMLInputElement | null { return this.querySelector<HTMLInputElement>('input[name="eureka__filter"]'); }
  #fileAt(path: string | undefined): FileEntry | undefined { return path === undefined ? undefined : (this.#store.getState().listing.entries.find((e) => e.path === path && typeof e.filename === 'string') as FileEntry | undefined); }
  #sourceId(v: SourceId | string): SourceId {
    const s = this.#store.getState().sources.all.find((x) => String(x.id) === String(v));
    return s ? s.id : (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v);
  }

  #onClick(e: MouseEvent): void {
    const target = e.target as Element;
    const sortBtn = target.closest<HTMLElement>('button[data-sort-by]');
    if (sortBtn) {
      const by = sortBtn.dataset.sortBy as SortBy; const sort = this.#store.getState().view.sort;
      this.#setSort(by, sort.by === by ? (sort.dir === 'ascending' ? 'descending' : 'ascending') : sort.dir);
      return;
    }
    const textarea = target.closest<HTMLTextAreaElement>('textarea[data-select-all]');
    if (textarea) { textarea.select(); return; }
    const el = target.closest<HTMLElement>('[data-action]');
    if (!el) return;
    const state = this.#store.getState();
    switch (el.dataset.action) {
      case 'toggle-panel': this.#store.dispatch({ type: 'view/togglePanel' }); break;
      case 'navigate': e.preventDefault(); void this.navigate(el.dataset.source ?? state.listing.source ?? '', el.dataset.cd ?? '/'); break;
      case 'create-directory': this.#openDialog('createDirectory', undefined, el); break;
      case 'upload': e.preventDefault(); this.#pickFiles(); break;
      case 'dismiss': this.#dismiss(el.dataset.id ?? ''); break;
      case 'choose': { const item = this.#fileAt(el.dataset.path); if (item) this.#choose([item]); else this.#choose(); break; }
      case 'crop': this.#openDialog('crop', el.dataset.path, el); break;
      case 'rename': this.#openDialog('rename', el.dataset.path, el); break;
      case 'delete': if (el.dataset.path) this.#requestDelete([el.dataset.path], el); break;
      case 'close': this.#close(); break;
      case 'focus-filter': e.preventDefault(); this.#filterInput()?.focus(); break;
      case 'clear-filter': e.preventDefault(); this.#store.dispatch({ type: 'view/setFilter', text: '' }); this.#filterInput()?.focus(); break;
      case 'dialog-cancel': el.closest('dialog')?.close(); break;
      case 'create-file': {
        const handler = this.#config.handlers.createFile;
        const r = handler?.(state.listing.source ?? '', state.listing.path);
        if (r?.onClick) { e.preventDefault(); r.onClick(state.listing.source ?? '', state.listing.path); }
        break;
      }
      default: break; // expand, download: plain links
    }
  }

  #onChange(e: Event): void {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    switch (t.dataset.control) {
      case 'browsing': { const { sourceId, path } = splitSourcePath(t.value); void this.navigate(sourceId, path); return; }
      case 'source': void this.navigate(t.value, '/'); return;
      case 'sort-by': this.#setSort(t.value as SortBy); return;
      case 'sort-dir': this.#setSort(undefined, t.value as SortDir); return;
      default: break;
    }
    if (!(t instanceof HTMLInputElement)) return;
    if (t.name === 'eureka__view') { if (t.checked) this.#store.dispatch({ type: 'view/setMode', mode: t.value as ViewMode }); return; }
    if (t.name === this.#ids.id('choose-mode')) { if (t.checked) this.#store.dispatch({ type: 'view/setChooseMode', mode: t.value === 'multiple' ? 'multiple' : 'single' }); return; }
    if (t.id === this.#ids.id('invert')) { this.#store.dispatch({ type: 'selection/invert', on: t.checked }); return; }
    if (t.name === 'eureka__fullscreen') { this.#toggleFullscreen(t.checked); return; }
    if (t.name === 'eureka__chosen_items') { if (t.dataset.path) this.#store.dispatch({ type: 'selection/toggle', path: t.dataset.path, checked: t.checked }); return; }
    if (t.name === 'eureka__uploadFiles') { const files = Array.from(t.files ?? []); t.value = ''; void this.#upload(files); return; }
  }

  #onInput(e: Event): void {
    const t = e.target as HTMLInputElement;
    if (t.name === 'eureka__filter') { this.#store.dispatch({ type: 'view/setFilter', text: t.value }); this.#announceCount(); return; }
    if (t.id === this.#ids.id('dialog-input')) { this.#store.dispatch({ type: 'dialog/input', value: t.value }); return; }
  }

  #onSubmit(e: SubmitEvent): void {
    const form = e.target as HTMLFormElement;
    const kind = form.dataset.form;
    const state = this.#store.getState();
    switch (kind) {
      case 'download-many': {
        if (!this.#config.allowDownloadMultiple || state.listing.source === null) { e.preventDefault(); return; }
        const names = selectChosen(state).map((f) => f.filename);
        const zip = this.#zipRequest(state.listing.source, state.listing.path, names);
        form.action = zip.url; // the browser handles the download response (HTML-90)
        return;
      }
      case 'delete-many': e.preventDefault(); this.#requestDelete(selectChosen(state).map((f) => f.path), form.querySelector('button')); return;
      case 'create-directory': { e.preventDefault(); const name = (new FormData(form).get('name') as string | null)?.trim(); if (name) void this.#createDirectory(name); return; }
      case 'rename': { e.preventDefault(); const name = (new FormData(form).get('name') as string | null)?.trim(); if (name && form.dataset.path) void this.#rename(form.dataset.path, name); return; }
      case 'confirm-delete': { e.preventDefault(); const paths = form.dataset.path ? [form.dataset.path] : selectChosen(state).map((f) => f.path); void this.#delete(paths); return; }
      case 'crop': e.preventDefault(); void this.#crop(form); return;
      default: e.preventDefault(); // filter, browsing, sort, view, upload: handled on input/change
    }
  }

  #onFocusIn(e: FocusEvent): void {
    const row = (e.target as Element).closest<HTMLTableRowElement>('tr[data-path]');
    if (row?.dataset.path) this.#store.dispatch({ type: 'selection/focus', path: row.dataset.path });
  }

  #onDblClick(e: MouseEvent): void {
    const cell = (e.target as Element).closest<HTMLElement>('.eureka__td-media');
    const row = cell?.closest<HTMLTableRowElement>('tr[data-path]');
    const item = this.#fileAt(row?.dataset.path);
    if (item) { e.preventDefault(); this.#choose([item]); }
  }

  #onToggle(e: Event): void {
    const d = e.target as HTMLDetailsElement;
    if (!(d instanceof HTMLDetailsElement) || !d.matches('details[data-cd]')) return;
    const cd = d.dataset.cd;
    if (!cd || cd === '/') return;
    const open = this.#store.getState().tree.open.includes(cd);
    if (open !== d.open) this.#store.dispatch({ type: 'tree/toggle', path: cd, open: d.open });
  }

  #onDialogClose(e: Event): void {
    if ((e.target as Element).matches?.('dialog.eureka__modal')) this.#store.dispatch({ type: 'dialog/close' });
  }

  #onKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (target.closest('dialog.eureka__modal')) return; // our dialogs own their keys; Escape is native. A host dialog around the whole browser does not count
    const row = target.closest<HTMLTableRowElement>('tr[data-path]');
    const toolbar = target.closest<HTMLElement>('[data-row-actions]');
    if (toolbar && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End')) { // KEY-B2 (APG toolbar)
      const controls = Array.from(toolbar.querySelectorAll<HTMLElement>('a, button')).filter((c) => !c.hasAttribute('disabled'));
      const i = controls.indexOf(target);
      if (e.key === 'ArrowLeft' && i === 0 && row) { e.preventDefault(); row.focus(); return; } // back to the row, like moving to the previous cell
      const next = e.key === 'Home' ? controls[0] : e.key === 'End' ? controls[controls.length - 1] : controls[(i + (e.key === 'ArrowRight' ? 1 : controls.length - 1)) % controls.length];
      if (next) { e.preventDefault(); for (const c of controls) c.tabIndex = c === next ? 0 : -1; next.focus(); }
      return;
    }
    if (row && target === row && e.key === 'ArrowRight') { // into the row's actions, like moving to the next cell (KEY-B2)
      const first = row.querySelector<HTMLElement>('[data-row-actions] a, [data-row-actions] button');
      if (first) { e.preventDefault(); first.focus(); }
      return;
    }
    const inTextField = target.matches(TEXT_FIELD);
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const m = this.#keymap.match(e, { inRow: !!row, inTextField, isMac });
    if (!m) return;
    const state = this.#store.getState();
    const item = this.#fileAt(row?.dataset.path);
    const rows = this.#rows();
    const index = row ? rows.indexOf(row) : -1;
    let handled = true;
    switch (m.binding.action) {
      case 'toggleSourcePanel': this.#store.dispatch({ type: 'view/togglePanel' }); break;
      case 'setView': { const mode = m.arg as ViewMode | undefined; if (mode && (mode !== 'masonry' || this.#config.allowMasonry)) this.#store.dispatch({ type: 'view/setMode', mode }); else handled = false; break; }
      case 'setSource': { const s = state.sources.all.find((x) => String(x.id) === m.arg); if (s) void this.navigate(s.id, '/'); else handled = false; break; }
      case 'upload': if (this.#config.allowUploads) this.#pickFiles(); else handled = false; break;
      case 'createDirectory': this.#openDialog('createDirectory', undefined, target); break;
      case 'createFile': { const h = this.#config.handlers.createFile; const r = h?.(state.listing.source ?? '', state.listing.path); if (r?.onClick) r.onClick(state.listing.source ?? '', state.listing.path); else if (r?.href) window.open(r.href, r.target ?? '_self'); else handled = false; break; }
      case 'focusFilter': { const f = this.#filterInput(); if (f) { f.focus(); f.select(); } else handled = false; break; }
      case 'sortAscending': this.#setSort(undefined, 'ascending'); break;
      case 'sortDescending': this.#setSort(undefined, 'descending'); break;
      case 'sortBy': if (m.arg) this.#setSort(m.arg as SortBy); else handled = false; break;
      case 'chooseSingle': this.#store.dispatch({ type: 'view/setChooseMode', mode: 'single' }); break;
      case 'chooseMultiple': if (this.#config.allowChooseMultiple) this.#store.dispatch({ type: 'view/setChooseMode', mode: 'multiple' }); else handled = false; break;
      case 'invertSelection': if (state.view.chooseMode === 'multiple') this.#store.dispatch({ type: 'selection/invert' }); else handled = false; break;
      case 'deselectAll':
        if (state.dialog || (e.key === 'Escape' && (state.view.filter || inTextField))) { handled = false; break; }
        this.#store.dispatch({ type: 'selection/clear' }); break;
      // row scope
      case 'chooseItem': if (item && target === row) this.#choose([item]); else handled = false; break;
      case 'expandItem': if (item) window.open(item.absoluteURL, '_blank', 'noopener'); else handled = false; break;
      case 'deleteItem': if (item && (target === row || !!toolbar)) this.#requestDelete([item.path], row); else handled = false; break;
      case 'renameItem': if (item) this.#openDialog('rename', item.path, row ?? target); else handled = false; break;
      case 'toggleItemChecked':
        if (item && target === row && state.view.chooseMode === 'multiple') this.#store.dispatch({ type: 'selection/toggle', path: item.path, checked: !(state.selection.inverted !== state.selection.checked.includes(item.path)) });
        else handled = false; break;
      case 'nextRow': handled = this.#focusRow(rows[index + 1]); break;
      case 'previousRow': handled = this.#focusRow(rows[index - 1]); break;
      case 'firstRow': handled = this.#focusRow(rows[0]); break;
      case 'lastRow': handled = this.#focusRow(rows[rows.length - 1]); break;
      default: handled = false;
    }
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  }

  #focusRow(row: HTMLTableRowElement | undefined): boolean {
    if (!row) return false;
    row.focus();
    row.scrollIntoView({ block: 'nearest' });
    return true;
  }

  // ---- drag and drop, paste (HTML-34, Level 2) -----------------------------------------
  #canDrop(): boolean { return this.#config.allowUploads && this.#config.doDragNDrop && !this.#store.getState().pending.uploading; }
  #hasFiles(dt: DataTransfer | null): boolean { return !!dt && Array.from(dt.types ?? []).includes('Files'); }
  #onDrag(e: DragEvent): void {
    if (!this.#canDrop() || !this.#hasFiles(e.dataTransfer)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    this.#setDragging(true);
  }
  #onDrop(e: DragEvent): void {
    if (!this.#canDrop() || !this.#hasFiles(e.dataTransfer)) return;
    e.preventDefault();
    this.#setDragging(false);
    void this.#upload(Array.from(e.dataTransfer?.files ?? []));
  }
  #onPaste(e: ClipboardEvent): void {
    if (!this.#config.allowUploads) return;
    const files = Array.from(e.clipboardData?.files ?? []);
    if (!files.length) return;
    if ((e.target as HTMLElement).matches?.(TEXT_FIELD) && !e.clipboardData?.types.every((t) => t === 'Files')) return;
    e.preventDefault();
    const stamp = Date.now();
    void this.#upload(files.map((f, i) => (/^(image|file)\.\w+$/i.test(f.name) ? new File([f], `paste-image.${stamp}${files.length > 1 ? `-${i + 1}` : ''}.${f.name.split('.').pop()}`, { type: f.type }) : f)));
  }
  #setDragging(on: boolean): void { if (this.#dragging !== on) { this.#dragging = on; this.#applyDragging(on); } }
  #applyDragging(on: boolean): void {
    this.#root()?.classList.toggle('eureka__dragover', on);
    this.querySelector('.eureka__drop-area')?.classList.toggle('eureka__drop-area--active', on);
  }

  // ---- fullscreen (HTML-48) ---------------------------------------------------------------
  #fullscreenTarget(): HTMLElement { return this.closest<HTMLElement>('.eureka-root') ?? this; }
  #toggleFullscreen(on: boolean): void {
    const target = this.#fullscreenTarget();
    if (on) { if (target.requestFullscreen) target.requestFullscreen().catch(() => this.#store.dispatch({ type: 'view/setFullscreen', on: false })); }
    else if (document.fullscreenElement) void document.exitFullscreen();
  }
  #onFullscreenChange(): void {
    const on = !!document.fullscreenElement && this.#fullscreenTarget().contains(document.fullscreenElement);
    if (this.#store.getState().view.fullscreen !== on) this.#store.dispatch({ type: 'view/setFullscreen', on });
  }

  // ---- state helpers ----------------------------------------------------------------------
  #setSort(by?: SortBy, dir?: SortDir): void {
    this.#store.dispatch({ type: 'view/setSort', ...(by ? { by } : {}), ...(dir ? { dir } : {}) });
    const sort = this.#store.getState().view.sort;
    this.#announce(`${this.#t({ filename: 'name', dimensions: 'dimensions', fileSize: 'fileSize', editedOn: 'editedOn' }[sort.by])}, ${this.#t(sort.dir === 'ascending' ? 'sort.ascending' : 'sort.descending')}`);
  }
  #announceCount(): void { this.#announce(this.#t('listing.count', { n: selectVisibleFiles(this.#store.getState()).length })); }
  #openDialog(kind: DialogKind, target: string | undefined, opener: Element | null | undefined): void {
    if (kind === 'rename' && !this.#config.allowRename) return;
    if (kind === 'crop' && !this.#config.allowCrop) return;
    this.#dialogOpener = opener ?? document.activeElement;
    this.#store.dispatch({ type: 'dialog/open', kind, ...(target !== undefined ? { target } : {}) });
  }
  #notify(message: string, kind: 'info' | 'danger' = 'info', { sticky = false, learnMore, id }: { sticky?: boolean; learnMore?: string; id?: string } = {}): void {
    const before = new Set(this.#store.getState().notifications.map((n) => n.id));
    this.#store.dispatch({ type: 'notification/push', message, kind, sticky, ...(learnMore ? { learnMore } : {}), ...(id ? { id } : {}) });
    const added = this.#store.getState().notifications.find((n) => !before.has(n.id));
    if (added && !sticky) { const t = setTimeout(() => { this.#timers.delete(t); this.#store.dispatch({ type: 'notification/dismiss', id: added.id }); }, AUTO_DISMISS_MS); this.#timers.add(t); }
  }
  #dismiss(id: string): void {
    if (id === 'welcome') markWelcomed(this.#storage, this.#config.storagePrefix);
    this.#store.dispatch({ type: 'notification/dismiss', id });
  }
  #fail(message: string, err: unknown): void {
    this.#notify(message, 'danger', { sticky: true });
    this.dispatchEvent(new CustomEvent('eureka-error', { detail: { message, cause: err }, bubbles: true }));
  }
  #pickFiles(): void {
    if (!this.#config.allowUploads) return;
    const existing = this.querySelector<HTMLInputElement>('input[name="eureka__uploadFiles"]');
    if (existing) { existing.click(); return; }
    const input = document.createElement('input');
    input.type = 'file'; input.multiple = true;
    input.addEventListener('change', () => void this.#upload(Array.from(input.files ?? [])), { once: true });
    input.click();
  }
  #zipRequest(source: SourceId, cd: string, names: string[]): { url: string } {
    const base = (this.#config.endpoints.api ?? this.#config.basePath).replace(/\/+$/, '');
    return { url: `${base}/media/attachments/${encodeURIComponent(String(source))}`, ...{ cd, names } };
  }

  #choose(items?: FileEntry[]): void {
    if (!this.#config.allowChoose) return;
    const state = this.#store.getState();
    const chosen = items ?? selectChosen(state);
    if (!chosen.length) return;
    const payload: FileEntry | FileEntry[] = state.view.chooseMode === 'multiple' && !items ? chosen : (chosen.length === 1 ? chosen[0]! : chosen);
    this.dispatchEvent(new CustomEvent('eureka-choose', { detail: { items: chosen }, bubbles: true }));
    this.#config.callbacks.choose?.(payload);
  }
  #close(): void {
    this.dispatchEvent(new CustomEvent('eureka-close', { bubbles: true }));
    this.#config.callbacks.close?.();
  }

  // ---- effects: loading ----------------------------------------------------------------------
  async #loadSources(): Promise<void> {
    try {
      const { result } = await this.#engine.request({ type: 'listSources' });
      this.#store.dispatch({ type: 'sources/loaded', sources: result });
    } catch (err) { this.#store.dispatch({ type: 'sources/failed', error: errorMessage(err) }); this.#fail(errorMessage(err), err); }
  }
  async #loadTree(source: SourceId): Promise<void> {
    this.#store.dispatch({ type: 'tree/loading' });
    try {
      const { result } = await this.#engine.request({ type: 'listTree', source });
      this.#store.dispatch({ type: 'tree/loaded', source, nodes: result });
    } catch (err) { this.#fail(errorMessage(err), err); }
  }
  async #loadDirectory(source: SourceId, path: string): Promise<void> {
    const p = normalizePath(path);
    this.#store.dispatch({ type: 'directory/navigate', source, path: p });
    const requestId = this.#store.getState().listing.requestId;
    this.dispatchEvent(new CustomEvent('eureka-navigate', { detail: { source, path: p }, bubbles: true }));
    try {
      const { result } = await this.#engine.request({ type: 'listDirectory', source, path: p });
      if (this.#store.getState().listing.requestId !== requestId) return; // superseded (STATE-20)
      this.#store.dispatch({ type: 'listing/loaded', source, path: p, entries: result.entries, records: result.records });
      this.#announceCount();
    } catch (err) {
      if (this.#store.getState().listing.requestId !== requestId) return;
      this.#store.dispatch({ type: 'listing/failed', error: this.#t('listing.failed', { cd: p, error: errorMessage(err) }) });
      this.#fail(this.#t('listing.failed', { cd: p, error: errorMessage(err) }), err);
    }
  }

  // ---- effects: mutations -------------------------------------------------------------------
  #current(): { source: SourceId; path: string } | null { const l = this.#store.getState().listing; return l.source === null ? null : { source: l.source, path: l.path }; }
  #stillHere(at: { source: SourceId; path: string }): boolean { const l = this.#store.getState().listing; return String(l.source) === String(at.source) && l.path === at.path; }

  async #upload(files: File[]): Promise<void> {
    const at = this.#current();
    if (!files.length || !at || !this.#config.allowUploads) return;
    this.#store.dispatch({ type: 'items/uploading', files: files.map((f) => f.name) });
    try {
      const { result } = await this.#engine.request({ type: 'upload', source: at.source, path: at.path, files });
      if (!this.#stillHere(at)) { this.#store.dispatch({ type: 'items/uploadFailed', error: 'moved' }); return; }
      this.#store.dispatch({ type: 'items/uploaded', entries: result.entries });
      this.#store.dispatch({ type: 'listing/records', records: result.records });
      this.#notify(this.#t('uploaded.nFiles', { n: files.length, cd: at.path }));
    } catch (err) {
      this.#store.dispatch({ type: 'items/uploadFailed', error: errorMessage(err) });
      this.#fail(this.#t('upload.failed', { error: errorMessage(err) }), err);
    }
  }

  #requestDelete(paths: string[], opener: Element | null | undefined): void {
    if (!this.#config.allowDelete || !paths.length) return;
    if (this.#config.confirmBeforeDelete) { this.#openDialog('confirmDelete', paths.length === 1 ? paths[0] : undefined, opener); return; }
    void this.#delete(paths);
  }
  async #delete(paths: string[]): Promise<void> {
    const at = this.#current();
    if (!at || !paths.length) return;
    const state = this.#store.getState();
    const visible = selectVisibleFiles(state);
    const gone = new Set(paths);
    const firstIndex = visible.findIndex((f) => gone.has(f.path));
    const names = paths.map((p) => basename(p));
    const previous = state.listing.entries;
    const focusWasInside = this.contains(document.activeElement);
    this.#store.dispatch({ type: 'items/deleting', paths });
    try {
      const { result } = await this.#engine.request({ type: 'delete', source: at.source, paths, ...(paths.length > 1 ? { cd: at.path } : {}) });
      this.#store.dispatch({ type: 'items/deleted', paths, ...(this.#stillHere(at) ? { entries: result.entries } : {}) });
      if (this.#stillHere(at)) this.#store.dispatch({ type: 'listing/records', records: result.records });
      this.#notify(paths.length === 1 ? this.#t('deleted.item', { filename: names[0] }) : this.#t('deleted.nItems', { n: paths.length }));
      if (focusWasInside && firstIndex >= 0) this.#focusNext = () => { const rows = this.#rows(); return rows[Math.min(firstIndex, rows.length - 1)] ?? this.querySelector<HTMLElement>('.eureka__empty-row [role="status"]'); };
      this.#queueRender();
    } catch (err) {
      this.#store.dispatch({ type: 'items/deleteFailed', paths, entries: previous, error: errorMessage(err) });
      this.#fail(this.#t('delete.failed', { filename: names.join(', '), error: errorMessage(err) }), err);
    }
  }

  async #rename(path: string, name: string): Promise<void> {
    const at = this.#current();
    if (!at || !this.#config.allowRename) return;
    const to = joinPath(at.path, name);
    this.#store.dispatch({ type: 'items/renaming', path });
    try {
      const { result } = await this.#engine.request({ type: 'rename', source: at.source, path, name });
      this.#store.dispatch({ type: 'items/renamed', from: path, to, entries: result.entries });
      this.#store.dispatch({ type: 'listing/records', records: result.records });
      this.#notify(this.#t('renamed.item', { from: basename(path), to: name }));
      this.#focusNext = () => this.#rows().find((r) => r.dataset.path === to) ?? null; // KEY-B4
    } catch (err) {
      this.#store.dispatch({ type: 'items/renameFailed', error: errorMessage(err) });
      this.#fail(this.#t('rename.failed', { filename: basename(path), error: errorMessage(err) }), err);
    }
  }

  async #createDirectory(name: string): Promise<void> {
    const at = this.#current();
    if (!at) return;
    const path = joinPath(at.path, name);
    try {
      await this.#engine.request({ type: 'createDirectory', source: at.source, path });
      this.#store.dispatch({ type: 'directory/created', path });
      this.#notify(this.#t('created.directory', { name }));
    } catch (err) { this.#fail(this.#t('directory.createFailed', { error: errorMessage(err) }), err); }
  }

  async #crop(form: HTMLFormElement): Promise<void> {
    const item = this.#fileAt(form.dataset.path);
    const at = this.#current();
    if (!item || !at) return;
    const fd = new FormData(form);
    const num = (k: string) => Number(fd.get(k) ?? 0);
    const saveAs = String(fd.get('saveAs') ?? item.filename).trim() || item.filename;
    const ext = saveAs.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
    try {
      const { result } = await this.#engine.request({ type: 'crop', url: item.absoluteURL, crop: { x: num('x'), y: num('y'), width: num('width'), height: num('height') }, mimeType });
      this.#store.dispatch({ type: 'dialog/close' });
      await this.#upload([new File([result], saveAs, { type: mimeType })]);
    } catch (err) { this.#fail(this.#t('crop.failed', { filename: item.filename, error: errorMessage(err) }), err); }
  }
}

/** Register the element under `tag` (default "eureka-browser") unless something already did. */
export function define(tag = 'eureka-browser'): typeof EurekaBrowser {
  if (!customElements.get(tag)) customElements.define(tag, EurekaBrowser);
  return EurekaBrowser;
}

export type { EurekaEvent, FileEntry, PartialConfig, SourceId, State, ViewMode };
