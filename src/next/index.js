/**
 * @typedef {import('../../node_modules/next/dist/server/next').NextServerOptions} NextServerOptions
 */
import next from 'next';
import http from 'http';
import path from 'path';

/**
 * @param {NextServerOptions} config
 * @param {number} port
 * */
export async function runNext(config, port) {
  /**
     * Slightly isolating Next from other services and updating root folder
     * Next is running in separate cluster
     * */
  process.chdir(path.normalize('src/next'));

  const app = next({ ...config });
  const handle = app.getRequestHandler();

  await app.prepare();

  return http.createServer(
    (req, res) => {
      handle(req, res);
    },
  ).listen(port);
}
