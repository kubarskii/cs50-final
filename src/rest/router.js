/**
 * @typedef {import('http').RequestListener} RequestListener
 * */
import db from '../lib/db';
import User from '../models/user';

/**
 * @typedef { string | number | boolean | RequestListener } RouteAction
 * */

export const DEFAULT_HEADERS = {
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
export const getBody = (stream) => new Promise((resolve, reject) => {
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
