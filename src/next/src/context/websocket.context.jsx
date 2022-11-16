import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useWebSocket from 'react-use-websocket';
import { useDispatch } from 'react-redux';
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

  const { readyState, sendMessage, getWebSocket } = useWebSocket(
    `ws://${hostname}:${port}/ws/api?token=${token}`,
    { onMessage, shouldReconnect: () => true, retryOnError: true },
  );

  const dispatch = useDispatch();

  useEffect(() => () => {
    const socket = getWebSocket();
    socket.close(1000);
  }, []);

  useEffect(() => {
    dispatch(stateChange(readyState));
  }, [readyState]);

  return (
    <WebsocketContext.Provider
      value={{ readyState, sendMessage }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}
