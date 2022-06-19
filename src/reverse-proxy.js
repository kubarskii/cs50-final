import http from 'node:http';
import { routesConfig } from './constants.js';

const proxyBack = (options, proxyReq, proxyRes) => {
  const request = http.request(options, (res) => {
    proxyRes.writeHead(res.statusCode, res.statusMessage, res.headers);

    res.on('data', (chunk) => {
      proxyRes.write(chunk);
    });

    res.on('end', (chunk) => {
      proxyRes.end(chunk);
    });

    res.on('error', (e) => {
      console.error(e);
      proxyRes.end();
    });
  });
  request.on('error', (e) => {
    console.error(e);
    // proxyRes.writeHead(request.statusCode, request.statusMessage, request.headers);
    proxyRes.end();
  });
  request.end();
};

/**
 * @param {Request} req
 * @param {ServerResponse} res
 * */
export const httpProxy = (req, res) => {
  const path = req.url;
  const routes = Object.keys(routesConfig);
  const headers = { ...req.headers };

  const generalOptions = {
    method: req.method,
    hostname: 'localhost',
    path,
    headers,
    maxRedirects: 20,
  };

  for (let i = 0; i < routes.length; i += 1) {
    const reg = new RegExp(routes[i]);
    const params = routesConfig[routes[i]];
    const matches = path.match(reg);
    if (matches) {
      proxyBack({
        ...generalOptions,
        port: params.port,
      }, req, res);
      return;
    }
  }

  const params = routesConfig.default;
  proxyBack({ ...generalOptions, port: params.port }, req, res);
};
