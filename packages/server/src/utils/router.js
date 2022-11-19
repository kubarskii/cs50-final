import URL from 'url';
import { DEFAULT_HEADERS } from '../../constants';

/**
 * @typedef {import('http').RequestListener} RequestListener
 * */

export default class Router {
  handlers = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
  };

  /**
     * @param {any} srv
     * @param {string} [basePath]
     * @param {string} [interceptEvent]
     * */
  constructor(srv, basePath = '', interceptEvent = 'request') {
    this.srv = srv;
    this.interceptEvent = interceptEvent;
    this.basePath = basePath;
    this.init();
  }

  init() {
    const event = this.interceptEvent;
    this.srv.on(event, (...args) => this.handleRouters(...args));
  }

  findHandler(method, url) {
    const handlers = this.handlers[method];
    for (let i = 0; i < handlers.length; i += 1) {
      const matches = url.match(handlers[i].reg);
      if (matches) {
        return handlers[i].handler;
      }
    }
  }

  /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * */
  async handleRouters(req, res) {
    const { url, method } = req;
    if (method === 'OPTIONS') {
      res.writeHead(204, DEFAULT_HEADERS);
      res.end();
      return;
    }
    const { pathname } = URL.parse(url);
    const urlWithoutBasePath = pathname.replace(this.basePath, '');
    const handler = this.findHandler(method, urlWithoutBasePath);
    if (handler && typeof handler === 'function') handler(req, res);
    else {
      res.writeHead(404);
      res.end();
    }
  }

  parseUrl(uri) {
    const { pathname } = URL.parse(uri);
    const rule = pathname
      .replace(/([\\\/\-\_\.])/g, '\\$1')
      .replace(/\{[a-zA-Z]+\}/g, '(:any)')
      .replace(/\:any/g, '[\\w\\-\\_\\.]+')
      .replace(/\:word/g, '[a-zA-Z]+')
      .replace(/\:num/g, '\\d+');
    return {
      route: pathname,
      reg: new RegExp(`^${rule}$`, 'i'),
    };
  }

  addHandler(method, url, handler) {
    const parsedUrl = this.parseUrl(url);
    const data = {
      ...parsedUrl,
      handler,
    };
    this.handlers[method].push(data);
  }

  /**
     * @param {string} url
     * @param {RequestListener} cb
     * */
  get(url, cb) {
    this.addHandler('GET', url, cb);
  }

  post(url, cb) {
    this.addHandler('POST', url, cb);
  }

  put(url, cb) {
    this.addHandler('PUT', url, cb);
  }

  delete(url, cb) {
    this.addHandler('DELETE', url, cb);
  }

  patch(url, cb) {
    this.addHandler('PATCH', url, cb);
  }
}
