import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ChatbotControls from '../core/chatbot-controls/chatbot-controls';

export const ControlsContext = React.createContext(
  new ChatbotControls({ inputDisabled: false, isOnline: true }),
);

ControlsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  isOnline: PropTypes.bool,
  inputDisabled: PropTypes.bool,
  inputShown: PropTypes.bool,
  currentRoom: PropTypes.shape({
    roomId: PropTypes.string,
    roomName: PropTypes.string,
  }),
};

ControlsProvider.defaultProps = {
  isOnline: true,
  inputDisabled: false,
  inputShown: false,
  currentRoom: {},
};

export function ControlsProvider(props) {
  const {
    children,
    isOnline = true,
    inputDisabled = false,
    inputShown = false,
    currentRoom = {},
  } = props;

  const observer = useRef(new ChatbotControls({
    inputDisabled,
    isOnline,
    inputShown,
    currentRoom,
  }));

  return (
    <ControlsContext.Provider
      value={observer.current}
    >
      {children}
    </ControlsContext.Provider>
  );
}
