// Host configuration for <eureka-browser>: attributes, a JSON child, or the
// `config` property, merged in that order (later wins) over the defaults.
import { resolveConfig, type Config, type PartialConfig } from '@mrktps/eureka-core';

type Dict = Record<string, unknown>;
const NESTED = new Set(['sort', 'headers', 'endpoints', 'intervals', 'callbacks', 'handlers', 'keymap']);

/** Merge partial configs; nested option groups merge one level deep. */
export function mergeConfig(...parts: Array<PartialConfig | null | undefined>): PartialConfig {
  const out: Dict = {};
  for (const p of parts) {
    if (!p) continue;
    for (const [k, v] of Object.entries(p)) {
      if (NESTED.has(k) && v && typeof v === 'object' && out[k] && typeof out[k] === 'object') out[k] = { ...(out[k] as Dict), ...(v as Dict) };
      else out[k] = v;
    }
  }
  return out as PartialConfig;
}

const sourceId = (v: string) => (/^\d+$/.test(v) ? Number(v) : v);

/** Attributes understood by the element (kebab-case). Boolean `no-*` attributes switch features off. */
export const ATTRIBUTES = ['api', 'lang', 'source', 'path', 'mode', 'storage-prefix', 'uid', 'assets', 'base-path', 'worker', 'i18n', 'tree-open', 'no-storage', 'no-uploads', 'no-dnd', 'no-rename', 'no-delete', 'no-download', 'no-crop', 'no-masonry', 'no-fullscreen', 'no-welcome', 'no-choose', 'no-choose-multiple', 'confirm-delete', 'always-welcome', 'learn-more', 'thumbnails'] as const;

export function configFromAttributes(el: Element): PartialConfig {
  const c: PartialConfig = {};
  const endpoints: Record<string, string> = {};
  const get = (n: string) => el.getAttribute(n);
  const has = (n: string) => el.hasAttribute(n);
  const api = get('api'); if (api) endpoints.api = api;
  const worker = get('worker'); if (worker) endpoints.worker = worker;
  const i18n = get('i18n'); if (i18n) endpoints.i18n = i18n;
  if (Object.keys(endpoints).length) c.endpoints = endpoints;
  const lang = get('lang'); if (lang) c.lang = lang;
  const source = get('source'); if (source !== null && source !== '') c.mediaSource = sourceId(source);
  const path = get('path'); if (path) c.currentDirectory = path;
  const mode = get('mode'); if (mode) c.mode = mode as Config['mode'];
  const prefix = get('storage-prefix'); if (prefix) c.storagePrefix = prefix;
  const uid = get('uid'); if (uid) c.uid = uid;
  const assets = get('assets'); if (assets) c.assetsBasePath = assets;
  const basePath = get('base-path'); if (basePath) c.basePath = basePath;
  const learnMore = get('learn-more'); if (learnMore) c.learnMore = learnMore;
  if (has('tree-open')) c.treeHidden = false;
  if (has('no-storage')) c.useLocalStorage = false;
  if (has('no-uploads')) c.allowUploads = false;
  if (has('no-dnd')) c.doDragNDrop = false;
  if (has('no-rename')) c.allowRename = false;
  if (has('no-delete')) c.allowDelete = false;
  if (has('no-download')) { c.allowDownload = false; c.allowDownloadMultiple = false; }
  if (has('no-crop')) c.allowCrop = false;
  if (has('no-masonry')) c.allowMasonry = false;
  if (has('no-fullscreen')) c.allowFullscreen = false;
  if (has('no-welcome')) c.welcome = false;
  if (has('no-choose')) c.allowChoose = false;
  if (has('no-choose-multiple')) c.allowChooseMultiple = false;
  if (has('confirm-delete')) c.confirmBeforeDelete = true;
  if (has('always-welcome')) c.alwaysWelcome = true;
  const thumbs = get('thumbnails'); if (thumbs === 'server' || thumbs === 'client' || thumbs === 'none') c.thumbnails = thumbs;
  return c;
}

/** `<script type="application/json" data-eureka-config>` inside the element. */
export function configFromJsonChild(el: Element): PartialConfig {
  const script = el.querySelector(':scope > script[type="application/json"][data-eureka-config]');
  if (!script?.textContent) return {};
  try { const v = JSON.parse(script.textContent); return v && typeof v === 'object' ? (v as PartialConfig) : {}; } catch { return {}; }
}

export function buildConfig(el: Element, property: PartialConfig | undefined): Config {
  const config = resolveConfig(mergeConfig(configFromJsonChild(el), configFromAttributes(el), property));
  // Catalogs default to {assets}i18n/{lang}.json (09 I18N-11), next to the stylesheet's assets.
  if (!config.endpoints.i18n) config.endpoints = { ...config.endpoints, i18n: `${config.assetsBasePath.replace(/\/+$/, '')}/i18n/` };
  return config;
}
