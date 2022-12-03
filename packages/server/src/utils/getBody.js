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
    const str = Buffer.concat(bodyParts).toString();
    if (!str) resolve(str);
    try {
      const json = JSON.parse(str);
      resolve(json);
    } catch (e) {
      reject(e);
    }
  };

  stream.on('data', addChunk);
  stream.on('end', partsToJSON);
  stream.on('error', (e) => reject(e));
});
