// Default page renderer: the Level 0 form inside a document shell, with the
// stylesheet and icon sprite served by the handler (assetFiles).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { escapeHtml, renderDocument, renderLevel0 } from '@mrktps/eureka-html';
import { catalogCandidates, type Catalog } from '@mrktps/eureka-core';
import type { PageContext } from './handler.js';

export interface DefaultRendererOptions {
  /** URL of the stylesheet as seen by the browser (default "/assets/css/eureka.css"). */
  stylesheetHref?: string;
  /** Module scripts to include (the element bundle for Level 1+). */
  scripts?: string[];
  title?: string;
  bodyClass?: string;
  /** Wrap the form in <eureka-browser> and load the element bundle (Level 1+). */
  enhance?: boolean;
  /** Attributes for the <eureka-browser> host when enhancing, e.g. { api: '/' }. */
  elementAttributes?: Record<string, string>;
  /** Catalog for a request locale (09 I18N-12). Default: the files in @mrktps/eureka-core/i18n; English needs none. */
  catalog?: (lang: string) => Catalog | undefined;
}

export function createDefaultRenderer(o: DefaultRendererOptions = {}) {
  const catalogFor = o.catalog ?? loadCatalog;
  return (ctx: PageContext): string => {
    const basePath = ctx.basePath.endsWith('/') ? ctx.basePath : ctx.basePath + '/';
    const catalog = catalogFor(ctx.lang);
    const form = renderLevel0({ sources: ctx.sources, source: { id: ctx.source.id, name: ctx.source.name }, path: ctx.path, entries: ctx.entries, tree: ctx.tree, lang: ctx.lang, basePath, locationRequested: ctx.locationRequested ?? false, ...(ctx.uploaded ? { uploaded: ctx.uploaded } : {}), ...(catalog ? { catalog } : {}), config: { assetsBasePath: '/assets/' } });
    const attrs = Object.entries({ api: basePath, assets: '/assets/', lang: ctx.lang, ...(o.elementAttributes ?? {}) }).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('');
    return renderDocument({
      lang: ctx.lang,
      title: o.title ?? 'Eureka Media Browser',
      stylesheets: [o.stylesheetHref ?? '/assets/css/eureka.css'],
      scripts: [...(o.scripts ?? []), ...(o.enhance ? ['/assets/js/eureka-browser.js'] : [])],
      bodyClass: ['modal-section', o.bodyClass].filter(Boolean).join(' '),
      body: o.enhance ? `<eureka-browser${attrs}>${form}</eureka-browser>` : form
    });
  };
}

const catalogCache = new Map<string, Catalog | undefined>();
/** Directory of the catalog files shipped with @mrktps/eureka-core (`i18n/{lang}.json`). */
export function i18nDir(): string {
  const require = createRequire(import.meta.url);
  return path.join(path.dirname(require.resolve('@mrktps/eureka-core/package.json')), 'i18n');
}
/** The catalog for a locale from @mrktps/eureka-core/i18n (full tag, then language; 09 I18N-10), or undefined for English and unknown locales. Cached. */
export function loadCatalog(lang: string): Catalog | undefined {
  if (lang.toLowerCase().startsWith('en')) return undefined;
  if (catalogCache.has(lang)) return catalogCache.get(lang);
  let found: Catalog | undefined;
  for (const tag of catalogCandidates(lang)) {
    const file = path.join(i18nDir(), `${tag}.json`);
    try { found = JSON.parse(fs.readFileSync(file, 'utf8')) as Catalog; break; } catch { /* next candidate */ }
  }
  catalogCache.set(lang, found);
  return found;
}
/** Paths of the catalog files, served at /assets/i18n/{lang}.json (the element's default `i18n` endpoint). */
export function i18nAssets(): Record<string, string> {
  const dir = i18nDir();
  let files: string[] = []; try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')); } catch { /* no catalogs */ }
  return Object.fromEntries(files.map((f) => [`/assets/i18n/${f}`, path.join(dir, f)]));
}

/** Paths of the built stylesheet and icon sprite from @mrktps/eureka-css, resolved from this package. */
export function cssAssets(): Record<string, string> {
  const require = createRequire(import.meta.url);
  const pkg = path.dirname(require.resolve('@mrktps/eureka-css/package.json'));
  return { '/assets/css/eureka.css': path.join(pkg, 'dist', 'eureka.css'), '/assets/img/icons.svg': path.join(pkg, 'assets', 'icons.svg') };
}

/** Paths of the element and worker bundles from @mrktps/eureka (built with `npm run build`). */
export function elementAssets(): Record<string, string> {
  const require = createRequire(import.meta.url);
  const dist = path.join(path.dirname(require.resolve('@mrktps/eureka/package.json')), 'dist');
  return Object.fromEntries(['eureka-browser.js', 'eureka-browser.js.map', 'eureka-worker.js', 'eureka-worker.js.map'].map((f) => [`/assets/js/${f}`, path.join(dist, f)]));
}
