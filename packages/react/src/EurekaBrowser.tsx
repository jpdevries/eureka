import { createElement, useEffect, useImperativeHandle, useRef } from 'react';
import type { PartialConfig } from '@mrktps/eureka-core';
import { defineEurekaBrowser, type EurekaBrowserElement } from './define.js';
import type { EurekaBrowserAttributes, EurekaBrowserProps } from './types.js';

/** React prop → element attribute. Strings are written as given; `true` writes an empty attribute; `false`/undefined write nothing. */
const ATTRIBUTE_OF: Record<keyof EurekaBrowserAttributes, string> = {
  api: 'api', assets: 'assets', lang: 'lang', source: 'source', path: 'path', mode: 'mode', storagePrefix: 'storage-prefix', uid: 'uid', basePath: 'base-path', worker: 'worker', i18n: 'i18n', learnMore: 'learn-more',
  treeOpen: 'tree-open', noStorage: 'no-storage', noUploads: 'no-uploads', noDnd: 'no-dnd', noRename: 'no-rename', noDelete: 'no-delete', noDownload: 'no-download', noCrop: 'no-crop', noMasonry: 'no-masonry', noFullscreen: 'no-fullscreen', noWelcome: 'no-welcome', noChoose: 'no-choose', noChooseMultiple: 'no-choose-multiple', confirmDelete: 'confirm-delete', alwaysWelcome: 'always-welcome', thumbnails: 'thumbnails', treeDepth: 'tree-depth', noListFolders: 'no-list-folders'
};

export function attributesFromProps(props: EurekaBrowserAttributes): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(ATTRIBUTE_OF) as Array<keyof EurekaBrowserAttributes>) {
    const v = props[key];
    if (v === undefined || v === null || v === false) continue;
    out[ATTRIBUTE_OF[key]] = v === true ? '' : String(v);
  }
  return out;
}

type Listener = (e: Event) => void;

/**
 * `<EurekaBrowser>`: the Eureka media browser in a React tree.
 *
 * It renders the `<eureka-browser>` element (07 STATE-50/52), maps its events to
 * handler props, sets `config` as a property, and registers the element on
 * first use. Only attributes go through JSX, so React 19's custom-element
 * handling never has to guess between a property and an attribute.
 */
export function EurekaBrowser(props: EurekaBrowserProps) {
  const { config, onChoose, onClose, onNavigate, onError, onStateChange, markup, children, define = true, tag = 'eureka-browser', id, className, style, hidden, ref, ...attributeProps } = props;
  const elementRef = useRef<EurekaBrowserElement | null>(null);
  useImperativeHandle(ref, () => elementRef.current as EurekaBrowserElement, []);

  // Handlers are read through a ref so that a new arrow function per render does not re-bind listeners.
  const handlers = useRef({ onChoose, onClose, onNavigate, onError, onStateChange });
  handlers.current = { onChoose, onClose, onNavigate, onError, onStateChange };

  useEffect(() => { if (define) void defineEurekaBrowser(tag); }, [define, tag]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const on = (name: string, call: (e: CustomEvent) => void): [string, Listener] => [name, (e) => call(e as CustomEvent)];
    const bindings: Array<[string, Listener]> = [
      on('eureka-choose', (e) => handlers.current.onChoose?.(e.detail.items, e)),
      on('eureka-close', (e) => handlers.current.onClose?.(e)),
      on('eureka-navigate', (e) => handlers.current.onNavigate?.(e.detail, e)),
      on('eureka-error', (e) => handlers.current.onError?.(e.detail, e)),
      on('eureka-statechange', (e) => handlers.current.onStateChange?.(e.detail.state, e))
    ];
    for (const [name, fn] of bindings) el.addEventListener(name, fn);
    return () => { for (const [name, fn] of bindings) el.removeEventListener(name, fn); };
  }, []);

  // `config` is a property (it carries functions); set it before the element upgrades too, the element lifts it.
  useEffect(() => {
    const el = elementRef.current as (EurekaBrowserElement & { config?: PartialConfig }) | null;
    if (!el) return;
    if (el.config !== config) el.config = config;
  }, [config]);

  const attrs = attributesFromProps(attributeProps);
  const domProps: Record<string, unknown> = { ...attrs, ref: elementRef };
  if (id !== undefined) domProps.id = id;
  if (className !== undefined) domProps.className = className;
  if (style !== undefined) domProps.style = style;
  if (hidden) domProps.hidden = true;
  if (markup !== undefined) domProps.dangerouslySetInnerHTML = { __html: markup };
  return createElement(tag, domProps, markup === undefined ? children : undefined);
}
