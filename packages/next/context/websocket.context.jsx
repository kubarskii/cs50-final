import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import useCookie from '../hooks/useCookie';
import { stateChange } from '../store/slices/chatbot-status.slice';

export const WebsocketContext = React.createContext(null);

WebsocketsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hostname: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
};

const Observer = {
  value: null,
  subscriptions: [],
  next(v) {
    this.value = v;
    this.subscriptions.forEach((fn) => fn.call(null, v));
  },
  subscribe(fn) {
    const index = this.subscriptions.push(fn);
    return () => this.subscriptions.splice(index, 1);
  },
};

const pendingRequests = Object.create(Observer);
const messagesTypesUserCanRequest = ['messages', 'rooms', 'members'];
pendingRequests.next(
  messagesTypesUserCanRequest.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}),
);
export { pendingRequests };

export function WebsocketsProvider(props) {
  const {
    children,
    hostname,
    port,
    onMessage,
  } = props;

  const [token] = useCookie('accessToken');
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const onError = (e) => {
    setError(e.message);
  };

  const { readyState, sendMessage } = useWebSocket(
    `ws://${hostname}:${port}/ws/api?token=${token}`,
    {
      onMessage,
      onError,
      shouldReconnect: () => true,
      retryOnError: true,
    },
  );

  useEffect(() => {
    const u = pendingRequests.subscribe((v) => {
      console.log(v);
    });
    return () => u();
  }, []);

  const sendMessageHOF = (data) => {
    sendMessage(data);
    const parsedData = JSON.parse(data);
    const type = parsedData[1];
    if (!messagesTypesUserCanRequest.includes(type)) return;

    const check = () => {
      setTimeout(() => {
        if (pendingRequests.value[type]) {
          const { value } = pendingRequests;
          pendingRequests.next({
            ...value,
            [type]: null,
          });
          sendMessageHOF(data);
        }
      }, 250);
    };

    const { value } = pendingRequests;
    pendingRequests.next(
      {
        ...value,
        [type]: data,
      },
    );

    check();
  };

  useEffect(() => {
    dispatch(stateChange(readyState));
  }, [readyState]);

  const value = useMemo(
    () => ({ readyState, sendMessage: sendMessageHOF, error }),
    [readyState, sendMessage, error],
  );

  return (
    <WebsocketContext.Provider
      value={value}
    >
      {children}
    </WebsocketContext.Provider>
  );
}
