import {WebSocketServer} from 'ws';

export default function runWS(config) {
    const wss = new WebSocketServer(config);

    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
            ws.send(data.toString())
        });

        ws.send('something');
    });

    return wss;
}
