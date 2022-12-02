const http = require('http');
const Router = require('@me/http-router');

/**
 * Prototype placeholder
 * */
function QuickServer() {}
QuickServer.prototype = Object.create(Router.prototype);

function qServer(cb) {
  const httpServer = http.createServer(cb);
  const fn = () => fn;

  const config = {
    srv: httpServer,
    handlers: {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
    },
  };

  Object.setPrototypeOf(fn, QuickServer.prototype);
  return Object.assign(fn, config)(cb);
}

QuickServer.prototype.listen = function (...args) {
  this.init();
  return this.srv.listen(...args);
};

module.exports = qServer;
