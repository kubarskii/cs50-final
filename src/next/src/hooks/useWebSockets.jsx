import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import useCookie from './useCookie';

/**
 * @typedef {object} UseWebSocketsConfig
 * @property {string} url
 * @property {string[]} [protocols]
 * @property {(args: any) => void} onMessage
 * */
/**
 * @param {UseWebSocketsConfig} config
 * */
export default function useWebSockets(config) {
  const { url, protocols = [], onMessage = (() => undefined) } = config;

  const [connection, setConnection] = useState(null);
  const [error, setError] = useState('');

  const reconnect = useCallback(() => {
    if (connection instanceof WebSocket) {
      connection.removeAllListeners();
      connection.close();
      const wss = new WebSocket(url, protocols);
      wss.addEventListener('message', onMessage);
      setConnection(wss);
    }
  }, [connection]);

  const waitForOpenConnection = (socket) => new Promise((resolve, reject) => {
    socket.addEventListener('open', openListener);
    socket.addEventListener('error', errorListener);

    function openListener() {
      socket.removeEventListener('open', openListener);
      socket.removeEventListener('error', errorListener);
      resolve();
    }

    function errorListener(e) {
      socket.removeEventListener('open', openListener);
      socket.removeEventListener('error', errorListener);
      reject(e);
    }
  });

  const sendMessage = async (msg) => {
    if (!connection) {
      console.error('no ws connection');
      return;
    }
    if (connection.readyState !== connection.OPEN) {
      try {
        await waitForOpenConnection(connection);
        connection.send(msg);
      } catch (err) {
        setError(err);
      }
    } else {
      connection.send(msg);
    }
  };

  useEffect(() => {
    const wss = new WebSocket(url, protocols);
    setConnection(wss);
    wss.addEventListener('message', onMessage);
    wss.addEventListener('close', (e) => {
      if (e.code > 1000) {
        reconnect();
      }
    });

    return () => {
      if (connection instanceof WebSocket) {
        connection.close(1000, 'Unmount occurred');
        connection.removeAllListeners();
      }
    };
  }, []);

  return {
    webSocket: connection,
    sendMessage,
    error,
  };
}
