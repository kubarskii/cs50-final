import { useEffect, useRef, useState } from 'react';

/**
 * @typedef {object} UseWebSocketsConfig
 * @property {string[]} [protocols]
 * @property {(args: any) => void} onMessage
 * */
/**
 * @param {string} url
 * @param {UseWebSocketsConfig} config
 * */
export default function useWebSockets(url, config) {
  const { protocols = [], onMessage = (() => undefined) } = config;

  const connectionRef = useRef(null);
  const [error, setError] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const [readyState, setReadyState] = useState(0);

  const connect = () => {
    if (connectionRef.current instanceof WebSocket) {
      const connection = connectionRef.current;
      // eslint-disable-next-line no-multi-assign
      connection.onopen = connection.onclose = connection.onerror = null;
    }
    const wss = new WebSocket(url, protocols);
    wss.addEventListener('message', onMessage);
    wss.addEventListener('close', () => {
      setReadyState(3);
      setWebSocket(null);
      setTimeout(() => {
        connect();
      }, 5000);
    });
    wss.addEventListener('open', () => {
      setWebSocket(wss);
      setReadyState(1);
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
    readyState,
  };
}
