// Engine client: one interface, backed by a module Worker when available or
// by the inline engine otherwise (10 PERF-03).
import { createEngine, type Engine, type EngineOptions } from './engine.js';
import type { EngineRequest, EngineResponse, EngineResultFor } from './protocol.js';

export interface EngineClient {
  request<T extends EngineRequest['type']>(req: Omit<Extract<EngineRequest, { type: T }>, 'id' | 'locale' | 'headers'> & Partial<Pick<EngineRequest, 'locale' | 'headers'>>): Promise<{ result: EngineResultFor<T>; fromCache: boolean }>;
  readonly mode: 'worker' | 'inline';
  terminate(): void;
}

export interface BridgeOptions extends EngineOptions {
  locale: string;
  headers?: Record<string, string>;
  basePath?: string;
  timeZone?: string;
  /** URL of the worker module; omit (or pass null) to force inline. */
  workerUrl?: URL | string | null;
  /** Override for tests. */
  WorkerImpl?: typeof Worker;
}

export function supportsWorker(): boolean {
  return typeof Worker === 'function' && typeof URL === 'function';
}

export function createEngineClient(opts: BridgeOptions): EngineClient {
  const defaults = { locale: opts.locale, headers: opts.headers ?? {}, basePath: opts.basePath, timeZone: opts.timeZone };
  let seq = 0;
  const WorkerImpl = opts.WorkerImpl ?? (typeof Worker === 'function' ? Worker : undefined);
  let worker: Worker | null = null;
  if (opts.workerUrl && WorkerImpl) {
    try { worker = new WorkerImpl(opts.workerUrl, { type: 'module' }); } catch { worker = null; }
  }
  const inline: Engine | null = worker ? null : createEngine(opts);
  const pending = new Map<string, { resolve: (r: EngineResponse) => void }>();
  worker?.addEventListener('message', (e: MessageEvent<EngineResponse>) => { const p = pending.get(e.data.id); if (p) { pending.delete(e.data.id); p.resolve(e.data); } });
  worker?.addEventListener('error', () => { for (const [id, p] of pending) { p.resolve({ id, ok: false, error: { message: 'worker error' } }); } pending.clear(); });

  return {
    mode: worker ? 'worker' : 'inline',
    async request(partial) {
      const req = { ...defaults, ...partial, id: `r${++seq}` } as unknown as EngineRequest;
      const res: EngineResponse = worker
        ? await new Promise<EngineResponse>((resolve) => { pending.set(req.id, { resolve }); worker!.postMessage(req); })
        : await inline!.handle(req);
      if (!res.ok) { const err = new Error(res.error.message) as Error & { status?: number }; err.status = res.error.status; throw err; }
      return { result: res.result as never, fromCache: res.fromCache ?? false };
    },
    terminate() { worker?.terminate(); worker = null; }
  };
}
