export const LB_PORT = process.env.REST_PORT || 80;
export const REST_API_PORT = process.env.REST_PORT || 3000;
export const WS_PORT = process.env.REST_PORT || 3006;
export const NEXT_PORT = process.env.NEXT_PORT || 3001;

export const routesConfig = {
  '/rest/api(/|)': {
    port: REST_API_PORT,
    protocol: ['http'],
  },
  '/ws/api(/|)': {
    port: WS_PORT,
    protocol: ['ws'],
  },
  default: {
    port: NEXT_PORT,
    protocol: ['http', 'ws'],
  },
};
