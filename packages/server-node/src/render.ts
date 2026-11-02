// Default page renderer: the Level 0 form inside a document shell, with the
// stylesheet and icon sprite served by the handler (assetFiles).
import { createRequire } from 'node:module';
import path from 'node:path';
import { renderDocument, renderLevel0 } from '@eureka/html';
import type { PageContext } from './handler.js';

export interface DefaultRendererOptions {
  /** URL of the stylesheet as seen by the browser (default "/assets/css/eureka.css"). */
  stylesheetHref?: string;
  /** Module scripts to include (the element bundle for Level 1+). */
  scripts?: string[];
  title?: string;
  bodyClass?: string;
}

export function createDefaultRenderer(o: DefaultRendererOptions = {}) {
  return (ctx: PageContext): string => renderDocument({
    lang: ctx.lang,
    title: o.title ?? 'Eureka Media Browser',
    stylesheets: [o.stylesheetHref ?? '/assets/css/eureka.css'],
    scripts: o.scripts ?? [],
    bodyClass: ['modal-section', o.bodyClass].filter(Boolean).join(' '),
    body: renderLevel0({ sources: ctx.sources, source: { id: ctx.source.id, name: ctx.source.name }, path: ctx.path, entries: ctx.entries, tree: ctx.tree, lang: ctx.lang, basePath: ctx.basePath.endsWith('/') ? ctx.basePath : ctx.basePath + '/', ...(ctx.uploaded ? { uploaded: ctx.uploaded } : {}), config: { assetsBasePath: '/assets/' } })
  });
}

/** Paths of the built stylesheet and icon sprite from @eureka/css, resolved from this package. */
export function cssAssets(): Record<string, string> {
  const require = createRequire(import.meta.url);
  const pkg = path.dirname(require.resolve('@eureka/css/package.json'));
  return { '/assets/css/eureka.css': path.join(pkg, 'dist', 'eureka.css'), '/assets/img/icons.svg': path.join(pkg, 'assets', 'icons.svg') };
}
