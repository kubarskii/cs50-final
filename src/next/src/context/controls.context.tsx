import React, { PropsWithChildren, useRef } from 'react';
import ChatbotControls, { ChatbotControlsState } from '../core/chatbot-controls/chatbot-controls';

export const ControlsContext = React.createContext<ChatbotControls>(
  new ChatbotControls({ inputDisabled: false, isOnline: true }),
);

export function ControlsProvider(props: PropsWithChildren<ChatbotControlsState>) {
  const { inputDisabled, isOnline, children } = props;
  const observer = useRef(new ChatbotControls({ inputDisabled, isOnline }));
  return (
    <ControlsContext.Provider
      value={observer.current}
    >
      {children}
    </ControlsContext.Provider>
  );
}
