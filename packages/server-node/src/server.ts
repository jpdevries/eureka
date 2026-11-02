import http from 'node:http';
import { createEurekaHandler, type HandlerOptions } from './handler.js';

export interface StartOptions extends HandlerOptions { port?: number; host?: string }

/** Start a node:http server for the handler. Resolves with the server and the bound port. */
export function startServer({ port = 3000, host = '127.0.0.1', ...handlerOptions }: StartOptions): Promise<{ server: http.Server; port: number; close(): Promise<void> }> {
  const handle = createEurekaHandler(handlerOptions);
  const server = http.createServer(async (req, res) => {
    const handled = await handle(req, res);
    if (!handled && !res.headersSent) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('not found'); }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const addr = server.address();
      const bound = typeof addr === 'object' && addr ? addr.port : port;
      resolve({ server, port: bound, close: () => new Promise<void>((r, j) => server.close((e) => (e ? j(e) : r()))) });
    });
  });
}
