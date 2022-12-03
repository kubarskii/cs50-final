const DEFAULT_HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, DNT, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Range, Authorization, Content-Language, Accept, Accept-Language, Referer, Origin',
  'Content-Type': 'application/json; charset=UTF-8',
};

module.exports = {
  DEFAULT_HEADERS,
};
