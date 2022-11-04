/**
 * @typedef {import('http').RequestListener} RequestListener
 * */
import URL from 'url';
import db from '../lib/db';
import User from '../models/user';
import { JWT } from '../utils/jwt';

/**
 * @typedef { string | number | boolean | RequestListener } RouteAction
 * */

const DEFAULT_HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

/**
 * @param {IncomingMessage} stream
 * */
const getBody = (stream) => new Promise((resolve, reject) => {
  const bodyParts = [];
  /**
     * @type {(c: any) => number}
     * */
  const addChunk = (c) => bodyParts.push(c);
  const partsToJSON = () => JSON.parse(Buffer.concat(bodyParts).toString());

  stream.on('data', addChunk);
  stream.on('end', () => resolve(partsToJSON()));
  stream.on('error', (e) => reject(e));
});

/**
 * @type {Record<string, RouteAction>}
 * */
export const routes = {
  '/user': async (req, res) => {
    const { method } = req;
    const supportedMethods = ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'];
    if (!supportedMethods.includes(method)) {
      res.writeHead(400, 'Method is not supported', DEFAULT_HEADERS);
    } else {
      const user = new User(db);
      switch (method) {
        case 'POST':
          try {
            const body = await getBody(req);
            await user.create(body);
            res.writeHead(201, 'User created', DEFAULT_HEADERS);
            res.end();
          } catch (e) {
            res.writeHead(500, e || 'Unknown Error on POST', DEFAULT_HEADERS);
            res.end();
          }
          break;
        case 'PUT':
          // updateUser
          break;
        case 'DELETE':
          // deleteUser
          break;
        default: {
          const { query } = URL.parse(req.url, true);
          if (query?.login) {
            const userData = await user.login(query.login, query.password);
            if (!userData) {
              res.writeHead(404, 'User not found', DEFAULT_HEADERS);
              res.end();
              return;
            }
            const accessToken = await JWT.generateJWTForUser(userData);
            res.writeHead(200);
            res.write(Buffer.from(JSON.stringify({ accessToken })));
            res.end();
          }
        }
      }
    }
  },
};
