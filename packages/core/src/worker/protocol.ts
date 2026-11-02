// Message protocol between the instance and the engine (10 PERF-04, schema/worker-messages.json).
import type { DisplayRecord, Entry, Sort, SortBy, SortDir, Source, SourceId, TreeNode } from '../types.js';

interface Base { id: string; locale: string; headers: Record<string, string>; basePath?: string; timeZone?: string }

export type EngineRequest =
  | (Base & { type: 'listSources' })
  | (Base & { type: 'listTree'; source: SourceId; cd?: string; depth?: number })
  | (Base & { type: 'listDirectory'; source: SourceId; path: string; preferCache?: boolean })
  | (Base & { type: 'sort'; by: SortBy; dir: SortDir })
  | (Base & { type: 'filter'; text: string; sort?: Sort })
  | (Base & { type: 'upload'; source: SourceId; path: string; files: File[] })
  | (Base & { type: 'delete'; source: SourceId; paths: string[]; cd?: string })
  | (Base & { type: 'rename'; source: SourceId; path: string; name: string })
  | (Base & { type: 'createDirectory'; source: SourceId; path: string })
  | (Base & { type: 'decodeThumbnail'; url: string; width: number })
  | (Base & { type: 'textThumbnail'; url: string; filename: string; maxBytes?: number })
  | (Base & { type: 'crop'; url: string; crop: { x: number; y: number; width: number; height: number; rotate?: number; scaleX?: number; scaleY?: number }; mimeType?: string; quality?: number });

export interface ListingResult { source: SourceId; path: string; entries: Entry[]; records: Record<string, DisplayRecord>; order: string[] }

export type EngineResultFor<T extends EngineRequest['type']> =
  T extends 'listSources' ? Source[] :
  T extends 'listTree' ? TreeNode[] :
  T extends 'listDirectory' ? ListingResult :
  T extends 'sort' | 'filter' ? { order: string[] } :
  T extends 'upload' | 'rename' | 'delete' ? ListingResult :
  T extends 'createDirectory' ? { path: string } :
  T extends 'decodeThumbnail' ? ImageBitmap :
  T extends 'textThumbnail' ? { svg: string } :
  T extends 'crop' ? Blob :
  never;

export type EngineResponse =
  | { id: string; ok: true; result: unknown; fromCache?: boolean }
  | { id: string; ok: false; error: { message: string; status?: number } };
