import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useCookie from '../hooks/useCookie';

export const ChatbotContext = React.createContext(null);

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

  const token = useCookie('accessToken');

  const data = useWebSocket(
    `ws://${hostname}:${port}/ws/api?token=${token}`,
    { onMessage, shouldReconnect: () => true, retryOnError: true },
  );

  return (
    <ChatbotContext.Provider
      value={{ ...data }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}
