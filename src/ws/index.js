import { WebSocketServer } from 'ws';

export default function runWS(httpServer) {
  const wssServer = new WebSocketServer({ server: httpServer, path: '/ws', clientTracking: true });

  wssServer.on('connection', () => {
    wssServer.on('message', (data) => {
      console.log('received: %s', data);
    });

    wssServer.send('something');
  });

  return wssServer;
}
