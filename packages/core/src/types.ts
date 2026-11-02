// Core types. Shapes follow spec/schema/*.json; keep them in sync.

export type SourceId = number | string;

export interface Source { id: SourceId; name: string }

export interface TreeNode { name: string; cd: string; children?: TreeNode[]; open?: boolean }

export interface Rendition { url: string; width: number; height?: number; type?: string }

export interface Entry {
  filename?: string;
  foldername?: string;
  directory: string;
  path: string;
  absoluteURL: string;
  absolutePreviewURL?: string;
  editedOn: number | string;
  dimensions?: [number, number];
  fileSize: number;
  alt?: string;
  renditions?: Rendition[];
}
export type FileEntry = Entry & { filename: string };
export type FolderEntry = Entry & { foldername: string };
export const isFile = (e: Entry): e is FileEntry => typeof e.filename === 'string' && e.filename.length > 0;
export const isFolder = (e: Entry): e is FolderEntry => !isFile(e) && typeof e.foldername === 'string';

export type ViewMode = 'table' | 'thumb' | 'grid' | 'list' | 'masonry';
export const VIEW_MODES: readonly ViewMode[] = ['table', 'thumb', 'grid', 'list', 'masonry'];
export type SortBy = 'filename' | 'dimensions' | 'fileSize' | 'editedOn';
export type SortDir = 'ascending' | 'descending';
export interface Sort { by: SortBy; dir: SortDir }
export type ChooseMode = 'single' | 'multiple';
export type Status = 'idle' | 'loading' | 'ready' | 'error';
export type MediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'other';

export interface Notification {
  id: string;
  message: string;
  kind: 'info' | 'danger';
  sticky: boolean;
  learnMore?: string;
  createdAt: number;
}

/** Per-entry display strings, computed once per locale (07 STATE-12, 10 PERF-01). */
export interface DisplayRecord {
  path: string;
  kind: MediaKind;
  icon: string;
  sizeText: string;
  dimensionsText: string;
  dateShort: string;
  dateLong: string;
  dateVerbose: string;
  description: string;
  haystack: string;
}

export type DialogKind = 'createDirectory' | 'rename' | 'crop' | 'confirmDelete' | 'shortcuts';

export interface Intervals { fetchDirectoryContents: false | number; updateSourceTree: false | number; searchBarPlaceholder: false | number }

export interface CreateFileHandlerResult { href: string; target?: string; onClick?: (sourceId: SourceId, cd: string) => void }

export interface Config {
  basePath: string;
  uid: string;
  storagePrefix: string;
  lang?: string;
  mediaSource?: SourceId;
  currentDirectory: string;
  mode: ViewMode;
  sort: Sort;
  treeHidden: boolean;
  useLocalStorage: boolean;
  allowChoose: boolean;
  allowChooseMultiple: boolean;
  allowInvertSelection: boolean;
  allowUploads: boolean;
  doDragNDrop: boolean;
  allowRename: boolean;
  allowDelete: boolean;
  confirmBeforeDelete: boolean;
  allowDownload: boolean;
  allowDownloadMultiple: boolean;
  allowCrop: boolean;
  allowMasonry: boolean;
  allowFullscreen: boolean;
  enlargeFocusedRows: boolean;
  emphasisFocusedMediaItem: boolean;
  welcome: boolean;
  alwaysWelcome: boolean;
  learnMore: string;
  headers: Record<string, string>;
  endpoints: { i18n?: string } & Record<string, string | undefined>;
  assetsBasePath: string;
  iconSVG: string;
  intervals: Intervals;
  callbacks: { choose?: (items: FileEntry | FileEntry[]) => void; close?: () => void };
  handlers: { createFile?: (sourceId: SourceId, cd: string) => CreateFileHandlerResult };
  keymap?: Record<string, string[]>;
}

export type PartialConfig = { [K in keyof Config]?: Config[K] extends object ? Partial<Config[K]> : Config[K] } & Record<string, unknown>;

export const defaultConfig: Config = Object.freeze({
  basePath: '/',
  uid: '0',
  storagePrefix: 'eureka__',
  currentDirectory: '/',
  mode: 'table',
  sort: { by: 'filename', dir: 'ascending' },
  treeHidden: true,
  useLocalStorage: true,
  allowChoose: true,
  allowChooseMultiple: true,
  allowInvertSelection: true,
  allowUploads: true,
  doDragNDrop: true,
  allowRename: true,
  allowDelete: true,
  confirmBeforeDelete: false,
  allowDownload: true,
  allowDownloadMultiple: true,
  allowCrop: true,
  allowMasonry: true,
  allowFullscreen: true,
  enlargeFocusedRows: false,
  emphasisFocusedMediaItem: true,
  welcome: true,
  alwaysWelcome: false,
  learnMore: 'https://github.com/mrktps/eureka',
  headers: {},
  endpoints: {},
  assetsBasePath: './assets/',
  iconSVG: './img/icons.svg',
  intervals: { fetchDirectoryContents: false, updateSourceTree: false, searchBarPlaceholder: false },
  callbacks: {},
  handlers: {}
}) as Config;

/** Merge host options over the defaults. Unknown keys are kept (01 CON-10). */
export function resolveConfig(options: PartialConfig = {}): Config {
  const o = options as Partial<Config>;
  return {
    ...defaultConfig,
    ...o,
    sort: { ...defaultConfig.sort, ...(o.sort ?? {}) },
    headers: { ...defaultConfig.headers, ...(o.headers ?? {}) },
    endpoints: { ...defaultConfig.endpoints, ...(o.endpoints ?? {}) },
    intervals: { ...defaultConfig.intervals, ...(o.intervals ?? {}) },
    callbacks: { ...defaultConfig.callbacks, ...(o.callbacks ?? {}) },
    handlers: { ...defaultConfig.handlers, ...(o.handlers ?? {}) }
  };
}
