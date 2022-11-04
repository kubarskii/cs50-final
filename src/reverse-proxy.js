import net from 'net';
import { ROUTES_CONFIG } from './constants';
import { parseRequest } from './utils/utils';

const PROTOCOLS = {
  HTTP: 'HTTP',
  WS: 'WS',
};

const socketsMap = new Map();

const getRouteData = (url = '') => {
  const routesKeys = Object.keys(ROUTES_CONFIG);
  for (let i = 0; i < routesKeys.length; i += 1) {
    const { host, port } = ROUTES_CONFIG[routesKeys[i]];
    if (url.match(routesKeys[i])) return { host, port };
  }
  return {};
};
/**
 * @param {Socket} socket
 * */
export const proxy = (socket) => {
  socket.on('data', (buffer) => {
    /**
     * TODO: Add types description
     * null | parsed HTTP request
     * */
    const parsedBuffer = parseRequest(buffer);
    const protocol = (parsedBuffer?.headersMap?.Upgrade === 'websocket' || !parsedBuffer) ? PROTOCOLS.WS : PROTOCOLS.HTTP;
    const { url } = parsedBuffer || {};
    const { host = 'localhost', port = ROUTES_CONFIG.default.port } = getRouteData(url);
    const config = { host, port };
    const cachedSocket = socketsMap.get(socket)?.connection;
    const client = new net.Socket();
    const connection = (protocol === PROTOCOLS.WS && cachedSocket)
      ? cachedSocket
      : client.connect({ ...config });
    const socketMeta = {
      url: parsedBuffer?.url,
      port,
      host,
      protocol,
      connection,
    };

    /** Checking for backpressure */
    if (!connection.write(buffer)) socket.pause();
    /** Subscribe only if no subscription */
    if (!socketsMap.has(socket)) {
      socket.on('drain', () => connection.resume());
      connection.on('drain', () => socket.resume());
      connection.on('error', (e) => {
        console.error(e);
        socketsMap.delete(socket);
      });
      connection.on('data', (chunk) => {
        if (!socket.write(chunk)) connection.pause();
      });

      connection.on('end', () => {
        if (protocol === PROTOCOLS.HTTP) socketsMap.delete(socket);
        connection.removeAllListeners('data');
      });
      socket.on('end', () => {
        if (protocol === PROTOCOLS.HTTP) socketsMap.delete(socket);
        connection.removeAllListeners('data');
        socket.removeAllListeners('data');
      });
    }
    if (!!parsedBuffer && !socketsMap.has(socket) && protocol === PROTOCOLS.WS) {
      socketsMap.set(socket, socketMeta);
    }
  });
  socket.on('error', console.error);
};
