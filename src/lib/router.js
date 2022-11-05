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
   * @param {string} [basePath]
   * */
  constructor(srv, basePath = '') {
    this.srv = srv;
    this.basePath = basePath;
    this.init();
  }

  init() {
    this.srv.on('request', (req, res) => this.handleRouters(req, res));
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
    const urlWithoutBasePath = url.replace(this.basePath, '');
    const handler = this.findHandler(method, urlWithoutBasePath);
    handler(req, res);
  }

  parseUrl(uri) {
    const rule = uri
      .replace(/([\\\/\-\_\.])/g, '\\$1')
      .replace(/\{[a-zA-Z]+\}/g, '(:any)')
      .replace(/\:any/g, '[\\w\\-\\_\\.]+')
      .replace(/\:word/g, '[a-zA-Z]+')
      .replace(/\:num/g, '\\d+');
    return {
      route: uri,
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
