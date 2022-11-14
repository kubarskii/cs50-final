import {
  useCallback,
  useEffect, useRef,
  useState,
} from 'react';

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

  const connectionRef = useRef(null);
  const [error, setError] = useState('');
  const [webSocket, setWebSocket] = useState(null);

  const connect = () => {
    if (connectionRef.current instanceof WebSocket) {
      const connection = connectionRef.current;
      // eslint-disable-next-line no-multi-assign
      connection.onopen = connection.onclose = connection.onerror = null;
    }
    const wss = new WebSocket(url, protocols);
    wss.addEventListener('message', onMessage);
    wss.addEventListener('close', () => {
      setWebSocket(null);
      setTimeout(() => {
        connect();
      }, 1000);
    });
    wss.addEventListener('open', () => {
      setWebSocket(wss);
    });
    connectionRef.current = wss;
  };

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
    const connection = connectionRef.current;
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
    connect();
    return () => {
      const connection = connectionRef.current;
      if (connection instanceof WebSocket) {
        connection.close(1000, 'Unmount occurred');
      }
    };
  }, []);

  return {
    webSocket,
    sendMessage,
    error,
  };
}
