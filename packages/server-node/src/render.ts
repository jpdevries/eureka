// Default page renderer: the Level 0 form inside a document shell, with the
// stylesheet and icon sprite served by the handler (assetFiles).
import { createRequire } from 'node:module';
import path from 'node:path';
import { escapeHtml, renderDocument, renderLevel0 } from '@eureka/html';
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
}

export function createDefaultRenderer(o: DefaultRendererOptions = {}) {
  return (ctx: PageContext): string => {
    const basePath = ctx.basePath.endsWith('/') ? ctx.basePath : ctx.basePath + '/';
    const form = renderLevel0({ sources: ctx.sources, source: { id: ctx.source.id, name: ctx.source.name }, path: ctx.path, entries: ctx.entries, tree: ctx.tree, lang: ctx.lang, basePath, locationRequested: ctx.locationRequested ?? false, ...(ctx.uploaded ? { uploaded: ctx.uploaded } : {}), config: { assetsBasePath: '/assets/' } });
    const attrs = Object.entries({ api: basePath, assets: '/assets/', ...(o.elementAttributes ?? {}) }).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('');
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

/** Paths of the built stylesheet and icon sprite from @eureka/css, resolved from this package. */
export function cssAssets(): Record<string, string> {
  const require = createRequire(import.meta.url);
  const pkg = path.dirname(require.resolve('@eureka/css/package.json'));
  return { '/assets/css/eureka.css': path.join(pkg, 'dist', 'eureka.css'), '/assets/img/icons.svg': path.join(pkg, 'assets', 'icons.svg') };
}

/** Paths of the element and worker bundles from @eureka/element (built with `npm run build`). */
export function elementAssets(): Record<string, string> {
  const require = createRequire(import.meta.url);
  const dist = path.join(path.dirname(require.resolve('@eureka/element/package.json')), 'dist');
  return Object.fromEntries(['eureka-browser.js', 'eureka-browser.js.map', 'eureka-worker.js', 'eureka-worker.js.map'].map((f) => [`/assets/js/${f}`, path.join(dist, f)]));
}
