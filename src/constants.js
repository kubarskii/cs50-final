export const LB_PORT = process.env.REST_PORT || 8080;
export const REST_API_PORT = process.env.REST_PORT || 3002;
export const WS_PORT = process.env.REST_PORT || 3006;
export const NEXT_PORT = process.env.NEXT_PORT || 3001;
export const DEFAULT_HOST = 'localhost'

export const routesConfig = {
  '/rest/api(/|)': {
    port: REST_API_PORT,
    host: DEFAULT_HOST,
    protocol: ['http'],
  },
  '/ws/api(/|)': {
    port: WS_PORT,
    host: DEFAULT_HOST,
    protocol: ['ws'],
  },
  default: {
    port: NEXT_PORT,
    host: DEFAULT_HOST,
    protocol: ['http', 'ws'],
  },
};
