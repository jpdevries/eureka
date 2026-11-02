// Module worker entry: `new Worker(new URL('@mrktps/eureka-core/worker', import.meta.url), { type: 'module' })`.
import { createEngine } from './engine.js';
import { renderTextThumbnail } from '../thumbs/text.js';
import type { EngineRequest } from './protocol.js';

const engine = createEngine({ renderText: (text, filename) => renderTextThumbnail(text, { filename }) });
const scope = globalThis as unknown as { addEventListener(type: 'message', fn: (e: MessageEvent<EngineRequest>) => void): void; postMessage(msg: unknown, transfer?: Transferable[]): void };
scope.addEventListener('message', async (e) => {
  const res = await engine.handle(e.data);
  const transfer: Transferable[] = res.ok && typeof ImageBitmap !== 'undefined' && res.result instanceof ImageBitmap ? [res.result] : [];
  scope.postMessage(res, transfer);
});
