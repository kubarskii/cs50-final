import http from 'http';
import cluster from 'cluster';
import winston from 'winston';
import net from 'net';
import runNext from './next/index.js';
import runWS from './ws/index.js';
import { LB_PORT, NEXT_PORT, REST_API_PORT } from './constants.js';
import { proxy } from './reverse-proxy.js';

const services = {
  NEXT: null,
  REST: null,
};

(async function main() {
  const consoleTransport = new winston.transports.Console();
  const winstonOptions = {
    transports: [consoleTransport],
  };
  const logger = new winston.createLogger(winstonOptions);

  /** Support for older Node versions */
  if (cluster.isPrimary || cluster.isMaster) {
    const servicesEntries = Object.entries(services);
    for (let i = 0; i < servicesEntries.length; i += 1) {
      const worker = cluster.fork({ CHILD_PROCESS_NAME: servicesEntries[i][0] });
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
    /** TODO: Relace with TLS in production */
    const tcpServer = net.createServer(proxy);
    tcpServer.on('error', console.error);
    tcpServer.on('close', () => {
      console.log('client disconnected');
    });
    tcpServer.listen({ host: '127.0.0.1', port: LB_PORT }, () => {
      logger.info(`TCP Server is running on ${LB_PORT}`);
    });
  }

  if (process.env.CHILD_PROCESS_NAME === 'NEXT') {
    /** build first to run production version */
    await runNext({ dev: true }, NEXT_PORT, logger);
    logger.info(`NEXT is running on ${NEXT_PORT}`);
  }

  if (process.env.CHILD_PROCESS_NAME === 'REST') {
    const srv = http.createServer((req, res) => {
      res.on('error', (e) => {
        console.error(e);
      });
      res.writeHead(200, { 'Content-Type': 'text/json' });
      const buffer = Buffer.from(JSON.stringify({ data: 'this is from rest service' }));
      res.write(buffer);
      res.end();
    });

    const wss = runWS({ server: srv });

    srv.listen(REST_API_PORT, () => {
      logger.info(`REST is running on ${REST_API_PORT}`);
    });
  }
}());
