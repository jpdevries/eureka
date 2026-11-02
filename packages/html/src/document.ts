// A complete HTML document around an instance, for servers that have no page of their own.
import { attr, html, raw, type Raw } from './html.js';

export interface DocumentOptions {
  lang: string;
  title?: string;
  body: Raw | string;
  stylesheets?: string[];
  /** Module scripts to load after the markup (the element bundle, Level 1+). */
  scripts?: string[];
  head?: Raw | string;
  /** Classes on <body>, e.g. the accessible theme names. */
  bodyClass?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}

export function renderDocument(o: DocumentOptions): string {
  return html`<!doctype html>
<html lang="${o.lang}"${attr('dir', o.dir)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${o.title ?? 'Eureka Media Browser'}</title>
<meta name="color-scheme" content="light dark">
<style>html,body{margin:0;background:#ececec}main{display:flex;flex-direction:column}@media (min-width:40em){html,body,main{block-size:100%}.eureka-root{flex:1 1 auto;min-block-size:0;display:flex;flex-direction:column;overflow:hidden}}</style>
${(o.stylesheets ?? []).map((href) => html`<link rel="stylesheet" href="${href}">`)}
${o.head ? raw(String(o.head)) : ''}
</head>
<body${attr('class', o.bodyClass)}>
<main>
<h1 class="visually-hidden">${o.title ?? 'Eureka Media Browser'}</h1>
<div id="root" class="eureka-root">${typeof o.body === 'string' ? raw(o.body) : o.body}</div>
</main>
${(o.scripts ?? []).map((src) => html`<script type="module" src="${src}"></script>`)}
</body>
</html>
`.value;
}
