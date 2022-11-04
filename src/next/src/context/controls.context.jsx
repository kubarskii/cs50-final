import React, { useRef } from 'react';
import ChatbotControls from '../core/chatbot-controls/chatbot-controls';

export const ControlsContext = React.createContext(
  new ChatbotControls({ inputDisabled: false, isOnline: true }),
);

export function ControlsProvider(props) {
  const { inputDisabled = false, isOnline = true, children } = props;
  const observer = useRef(new ChatbotControls({ inputDisabled, isOnline }));
  return (
    <ControlsContext.Provider
      value={observer.current}
    >
      {children}
    </ControlsContext.Provider>
  );
}
