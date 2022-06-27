import net from 'net';
import {routesConfig} from './constants.js';
import {parseRequest} from "./utils.js";
import {PassThrough} from 'stream';

const PROTOCOLS = {
    HTTP: 'HTTP',
    WS: 'WS'
}
const socketsMap = new Map();
const passPipe = new PassThrough()
passPipe.on('data', (chunk) => {
    console.log(chunk);
})

const getRouteData = (url = '', routesConfig) => {
    const routesKeys = Object.keys(routesConfig);
    for (let i = 0; i < routesKeys.length; i += 1) {
        const {host, port} = routesConfig[routesKeys[i]]
        if (url.match(routesKeys[i])) return {host, port}
    }
    return {}
}
/**
 * @param {Socket} socket
 * */
// eslint-disable-next-line import/prefer-default-export
export const proxy = (socket) => {
    socket.on('data', (buffer) => {
        const parsedBuffer = parseRequest(buffer)
        const protocol = (parsedBuffer?.headersMap?.Upgrade === 'websocket' || !parsedBuffer) ? PROTOCOLS.WS : PROTOCOLS.HTTP;
        const {url} = parsedBuffer || {};
        const {host = 'localhost', port = routesConfig.default.port} = getRouteData(url, routesConfig)
        const config = {host, port};
        const cachedSocket = socketsMap.get(socket)?.connection

        const client = new net.Socket()

        const connection = (protocol === PROTOCOLS.WS && cachedSocket)
            ? cachedSocket
            : client.connect({...config});

        const socketMeta = {
            url: parsedBuffer?.url,
            port,
            host,
            protocol,
            connection
        }
        socket.on('drain', () => connection.resume())
        if (!connection.write(buffer)) socket.pause()

        /** Subscribe only if no subscription*/
        if (!socketsMap.has(socket)) {

            connection.on('drain', () => socket.resume())
            connection.on('error', (e) => {
                console.error(e);
                socketsMap.delete(socket);
            })
            connection.on('data', (chunk) => {
                if (protocol === PROTOCOLS.WS) console.log('passing data');
                if (!socket.write(chunk)) connection.pause();
            })

            connection.on('end', () => {
                if (protocol === PROTOCOLS.HTTP) socketsMap.delete(socket)
                connection.removeAllListeners('data')
                connection.destroy()
            })
            socket.on('end', () => {
                if (protocol === PROTOCOLS.HTTP) socketsMap.delete(socket)
                connection.removeAllListeners('data')
                connection.destroy()
            })
        }
        if (!!parsedBuffer && !socketsMap.has(socket) && protocol === PROTOCOLS.WS) {
            socketsMap.set(socket, socketMeta)
        }
    });
    socket.on('error', console.error)
    socket.on('end', () => {
        socket.destroy()
    })

};
