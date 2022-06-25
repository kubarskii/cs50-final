import net from 'net';
import { routesConfig } from './constants.js';
import { compose, parseRequest } from './utils.js';

const socketsMap = new Map();
/**
 * @param {Socket} socket
 * */
// eslint-disable-next-line import/prefer-default-export
export const proxy = (socket) => {
  socket.on('close', () => socketsMap.delete(socket));
  socket.on('error', () => compose(socket.destroy, () => socketsMap.delete(socket)));
  socket.on('data', (buffer) => {
    /** @type NetConnectOpts */
    const connectionConfig = {
      host: 'localhost',
      port: socketsMap.get(socket)?.port || routesConfig.default.port,
      timeout: 30000,
    };

    const data = parseRequest(buffer);
    if (data) {
      socketsMap.set(socket, {
        url: data?.url || '/',
      });
    }

    const headersObject = {};
    if (data && data.headers.length % 2 === 0) {
      for (let i = 0; i < data.headers.length; i += 2) {
        if (data.headers[i].toLowerCase() !== 'accept-encoding') headersObject[data.headers[i]] = data.headers[i + 1];
      }
    }

    const isWebsocketConnection = (headersObject.Upgrade === 'websocket' && headersObject.Connection === 'Upgrade');

    const routes = Object.keys(routesConfig);

    if (data) {
      for (let i = 0; i < routes.length; i += 1) {
        const reg = new RegExp(routes[i]);
        const params = routesConfig[routes[i]];
        const matches = data.url.match(reg);
        if (matches) {
          const s = socketsMap.get(socket) || {};
          socketsMap.set(socket, { ...s, port: params.port });
          connectionConfig.port = socketsMap.get(socket)?.port || params.port;
        }
      }
    }

    const proxySocket = socketsMap.get(socket)?.connection
        || net.createConnection(connectionConfig);

    if (isWebsocketConnection) {
      socketsMap.set(socket, {
        ...(socketsMap.get(socket) || {}),
        connection: proxySocket,
      });
    }

    proxySocket.on('error', compose(console.error, () => socket.destroy()));
    proxySocket.on('drain', () => socket.resume());

    socket.on('error', console.error);
    socket.on('end', () => proxySocket.end());
    socket.on('drain', () => proxySocket.resume());

    const isProxySocketNotFull = proxySocket.write(buffer);
    if (!isProxySocketNotFull) {
      socket.pause();
    }

    proxySocket.on('data', (chunk) => {
      const isNotFull = socket.write(chunk);
      if (!isNotFull) proxySocket.pause();
    });
  });
};
