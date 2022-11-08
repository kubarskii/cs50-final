import React, { useEffect, useRef } from 'react';
import ChatbotControls from '../core/chatbot-controls/chatbot-controls';

export const ControlsContext = React.createContext(
  new ChatbotControls({ inputDisabled: false, isOnline: true }),
);

export function ControlsProvider(props) {
  const {
    children,
    isOnline = true,
    inputDisabled = false,
    inputShown = false,
  } = props;
  const observer = useRef(new ChatbotControls({ inputDisabled, isOnline, inputShown }));

  return (
    <ControlsContext.Provider
      value={observer.current}
    >
      {children}
    </ControlsContext.Provider>
  );
}
