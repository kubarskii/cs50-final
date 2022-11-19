import React, { useEffect, useState } from 'react';
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

export function WebsocketsProvider(props) {
  const {
    children,
    hostname,
    port,
    onMessage,
  } = props;

  const [token] = useCookie('accessToken');

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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stateChange(readyState));
  }, [readyState]);

  // const value = useMemo(
  //   () => ({ readyState, sendMessage, error }),
  //   [readyState, sendMessage, error],
  // );

  return (
    <WebsocketContext.Provider
      value={{ readyState, sendMessage, error }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}
