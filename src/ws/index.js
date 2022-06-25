import { WebSocketServer } from 'ws';

export default function runWS(config) {
  const ws = new WebSocketServer(config);

  ws.on('open', () => {
    console.error('TEST', 'connection');
    ws.send('connection');
  });

  ws.on('message', (msg) => {
    console.log(msg);
    ws.send(msg);
  });

  return ws;
}
