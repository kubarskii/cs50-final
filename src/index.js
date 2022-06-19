import http from 'node:http';
import fs from 'fs';
import path from 'path';
import cluster from 'cluster';
import winston from 'winston';
import net from 'net';
import runNext from './next/index.js';
import runWS from './ws/index.js';
import {
  LB_PORT, NEXT_PORT, REST_API_PORT, routesConfig,
} from './constants.js';
import { parseRequest } from './utils.js';

const services = {
  NEXT: null,
  REST: null,
};

async function main() {
  const consoleTransport = new winston.transports.Console();
  const winstonOptions = {
    transports: [consoleTransport],
  };
  const logger = new winston.createLogger(winstonOptions);

  const httpsOptions = {
    key: fs.readFileSync(path.normalize('cert/key.pem'), 'utf8'),
    cert: fs.readFileSync(path.normalize('cert/server.crt'), 'utf8'),
  };

  if (cluster.isPrimary) {
    const servicesEntries = Object.entries(services);
    for (let i = 0; i < servicesEntries.length; i += 1) {
      const worker = cluster.fork({ CHILD_P_NAME: servicesEntries[i][0] });
      worker.on('exit', (code, signal) => {
        if (signal) {
          logger.info(`Worker killed by signal ${signal}`);
        } else if (code !== 0) {
          logger.error(`worker exited with error code: ${code}`);
        } else {
          logger.info('worker success!');
        }
      });
    }
    const tcpServer = net.createServer();

    tcpServer.on('connection', (socket) => {
      socket.on('data', (buffer) => {
        const connectionConfig = {
          host: 'localhost',
          port: 3001,
          allowHalfOpen: true,
          timeout: 30000,
        };

        let data;
        try {
          data = parseRequest(buffer);
          socket.url = data.url;
        } catch {
          // Websocket connection
        }
        const headersObject = {};
        if (data && data.headers.length % 2 === 0) {
          for (let i = 0; i < data.headers.length; i += 2) {
            if (data.headers[i].toLowerCase() === 'accept-encoding') continue;
            headersObject[data.headers[i]] = data.headers[i + 1];
          }
        }
        const routes = Object.keys(routesConfig);

        if (data) {
          for (let i = 0; i < routes.length; i += 1) {
            const reg = new RegExp(routes[i]);
            const params = routesConfig[routes[i]];
            const matches = data.url.match(reg);
            if (matches) {
              socket.port = params.port;
              connectionConfig.port = socket.port || params.port;
            }
          }
        }

        const proxySocket = net.createConnection(connectionConfig);

        proxySocket.on('error', (e) => {
          console.error(e);
        });

        proxySocket.on('end', () => {
          proxySocket.destroy();
        });

        socket.on('error', (e) => {
          console.error(e);
        });

        /** Working with http */
        proxySocket.write(buffer);
        socket.on('end', () => {
          proxySocket.end();
        });

        proxySocket.on('data', (chunk) => {
          socket.write(chunk);
        });

        proxySocket.on('end', () => {
          socket.end();
        });
      });
    });

    tcpServer.on('error', (err) => {
      console.error(err);
    });

    tcpServer.on('close', () => {
      console.log('client disconnected');
    });

    tcpServer.listen({ host: 'localhost', port: LB_PORT }, () => {
      logger.info(`TCP Server is running on ${LB_PORT}`);
    });
  }

  if (process.env.CHILD_P_NAME === 'NEXT') {
    /** build first to run production version */
    await runNext({ dev: true }, NEXT_PORT, logger);
    logger.info(`NEXT is running on ${NEXT_PORT}`);
  }

  if (process.env.CHILD_P_NAME === 'REST') {
    const srv = http.createServer((req, res) => {
      res.on('error', (e) => {
        console.error(e);
      });
      res.writeHead(200, { 'Content-Type': 'text/json' });
      const buffer = Buffer.from(JSON.stringify({ data: 'this is from rest service' }));
      res.write(buffer);
      res.end();
    });

    runWS(srv);

    srv.listen(REST_API_PORT, () => {
      logger.info(`REST is running on ${REST_API_PORT}`);
    });
  }
}

await main();
