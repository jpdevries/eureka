import type { FileEntry, PartialConfig, SourceId, State, ViewMode } from '@eureka/core';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { EurekaBrowserElement } from './define.js';

/** Attribute-backed options of `<eureka-browser>` (see @eureka/element). Changing one restarts the instance. */
export interface EurekaBrowserAttributes {
  /** Base URL of the REST API; `media/` is appended. */
  api?: string;
  /** Base URL of the stylesheet's assets (the icon sprite). */
  assets?: string;
  lang?: string;
  /** Initial media source id. */
  source?: SourceId;
  /** Initial directory. */
  path?: string;
  /** Initial view mode. */
  mode?: ViewMode;
  /** Storage and DOM id prefix (default `eureka__`). */
  storagePrefix?: string;
  /** Distinguishes several instances on one page. */
  uid?: string;
  basePath?: string;
  /** Worker bundle URL, or `inline` to run the engine on the main thread. */
  worker?: string;
  /** Base URL for message catalogs (`{i18n}/{locale}.json`). */
  i18n?: string;
  learnMore?: string;
  treeOpen?: boolean;
  noStorage?: boolean;
  noUploads?: boolean;
  noDnd?: boolean;
  noRename?: boolean;
  noDelete?: boolean;
  noDownload?: boolean;
  noCrop?: boolean;
  noMasonry?: boolean;
  noFullscreen?: boolean;
  noWelcome?: boolean;
  noChoose?: boolean;
  noChooseMultiple?: boolean;
  confirmDelete?: boolean;
  alwaysWelcome?: boolean;
}

export interface EurekaNavigateDetail { source: SourceId; path: string }
export interface EurekaErrorDetail { message: string; cause?: unknown }

export interface EurekaBrowserProps extends EurekaBrowserAttributes {
  /** Anything attributes cannot express (headers, intervals, handlers, keymap...). Memoize it: a new object restarts the instance. */
  config?: PartialConfig;
  /** The chosen items (07 STATE-50 `eureka-choose`). One item in single-choose mode. */
  onChoose?: (items: FileEntry[], event: CustomEvent<{ items: FileEntry[] }>) => void;
  onClose?: (event: CustomEvent) => void;
  onNavigate?: (detail: EurekaNavigateDetail, event: CustomEvent<EurekaNavigateDetail>) => void;
  onError?: (detail: EurekaErrorDetail, event: CustomEvent<EurekaErrorDetail>) => void;
  /** Once per render of the browser (`eureka-statechange`). Prefer `useEurekaState` for reading state. */
  onStateChange?: (state: State, event: CustomEvent<{ state: State }>) => void;
  /**
   * Server-rendered Level 0 markup to enhance (the string `renderLevel0` of @eureka/html returns).
   * Keep it referentially stable; React resets the element's children whenever it changes.
   */
  markup?: string;
  /** Children are rendered inside the element until it starts; ignored when `markup` is given. */
  children?: ReactNode;
  /** Import and register the element when it is not defined yet (default true). Set false when the host loads `eureka-browser.js` itself. */
  define?: boolean;
  /** Tag name, when the element was registered under another name. */
  tag?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  ref?: Ref<EurekaBrowserElement>;
}
