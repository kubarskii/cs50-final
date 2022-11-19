export const LB_PORT = process.env.REST_PORT || 5555;
export const REST_API_PORT = process.env.REST_PORT || 3003;
export const NEXT_PORT = process.env.NEXT_PORT || 3001;
export const DEFAULT_HOST = 'localhost';

export const DEFAULT_HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=UTF-8',
};

export const ROUTES_CONFIG = {
  '/ws/api(/|)?.*': {
    port: REST_API_PORT,
    host: DEFAULT_HOST,
    protocol: ['http'],
  },
  '/rest/api(/|)?.*': {
    port: REST_API_PORT,
    host: DEFAULT_HOST,
    protocol: ['ws'],
  },
  default: {
    port: NEXT_PORT,
    host: DEFAULT_HOST,
    protocol: ['http', 'ws'],
  },
};