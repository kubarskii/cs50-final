import { HTTPParser } from 'http-parser-js';

export const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x);

export function parseRequest(input) {
  const parser = new HTTPParser(HTTPParser.REQUEST);
  let complete = false;
  let shouldKeepAlive;
  let upgrade;
  let method;
  let url;
  let versionMajor;
  let versionMinor;
  let headers = [];
  let trailers = [];
  const bodyChunks = [];

  parser[HTTPParser.kOnHeadersComplete] = (req) => {
    shouldKeepAlive = req.shouldKeepAlive;
    upgrade = req.upgrade;
    method = HTTPParser.methods[req.method];
    url = req.url;
    versionMajor = req.versionMajor;
    versionMinor = req.versionMinor;
    headers = req.headers;
  };

  parser[HTTPParser.kOnBody] = (chunk, offset, length) => {
    bodyChunks.push(chunk.slice(offset, offset + length));
  };

  /** This is actually the event for trailers, go figure. */
  parser[HTTPParser.kOnHeaders] = (t) => {
    trailers = t;
  };

  parser[HTTPParser.kOnMessageComplete] = () => {
    complete = true;
  };

  /**
     * Since we are sending the entire Buffer at once here all callbacks above happen synchronously.
     * The parser does not do _anything_ asynchronous.
     * However, you can of course call execute() multiple times with multiple chunks,
     * e.g. from a stream.
     * But then you have to refactor the entire logic to be async
     * (e.g. resolve a Promise in kOnMessageComplete check add timeout logic).
     */
  parser.execute(input);
  parser.finish();

  if (!complete) {
    return null;
  }

  const body = Buffer.concat(bodyChunks);

  const headersMap = {};
  if (headers.length % 2 === 0) {
    for (let i = 0; i < headers.length; i += 2) {
      headersMap[headers[i]] = headers[i + 1];
    }
  }

  return {
    shouldKeepAlive,
    upgrade,
    method,
    url,
    versionMajor,
    versionMinor,
    headers,
    body,
    trailers,
    headersMap,
  };
}
