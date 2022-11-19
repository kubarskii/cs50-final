/**
 * @typedef {import('http').RequestListener} RequestListener
 * */

/**
 * @typedef { string | number | boolean | RequestListener } RouteAction
 * */

/**
 * @param {IncomingMessage} stream
 * */
export const getBody = (stream) => new Promise((resolve, reject) => {
  const bodyParts = [];
  /**
     * @type {(c: any) => number}
     * */
  const addChunk = (c) => bodyParts.push(c);
  const partsToJSON = () => {
    try {
      resolve(JSON.parse(Buffer.concat(bodyParts).toString()));
    } catch (e) {
      reject(e);
    }
  };

  stream.on('data', addChunk);
  stream.on('end', partsToJSON);
  stream.on('error', (e) => reject(e));
});
