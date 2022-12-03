const mix = require('./mix');

const additional = {
  json(statusCode, obj, headers) {
    let data;
    if (typeof obj !== 'string') data = JSON.stringify(obj);
    if (typeof obj === 'string') data = obj;
    this.writeHead(statusCode, headers);
    this.write(data);
    this.end();
  },
  text(statusCode, str, headers) {
    this.writeHead(statusCode, headers);
    this.write(str);
    this.end();
  },
  error(statusCode = 500, msg = '', headers = {}) {
    this.writeHead(statusCode, msg, headers);
    this.end();
  },
};

const mixRes = (res) => mix(res, additional);
module.exports = mixRes;
