import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReadyState } from 'react-use-websocket';
import { WebsocketContext } from '../../context/websocket.context';
import Sidebar from '../sidebar/sidebar';
import Container from '../container/container';
import InputWrapper from '../input-wrapper/input-wrapper.component';

export default function ChatContainerComponent() {
  const { sendMessage, readyState } = useContext(WebsocketContext);
  const { id: roomId = '' } = useSelector((state) => state.rooms.currentRoom);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (roomId) {
        sendMessage(JSON.stringify([1, 'messages', { roomId }]));
        sendMessage(JSON.stringify([1, 'members', { roomId }]));
      }
      sendMessage(JSON.stringify([1, 'rooms', {}]));
    }
  }, [roomId, readyState]);

  const { name: roomName = '' } = useSelector((state) => state.rooms.currentRoom);

  return (
    <div style={{
      maxHeight: 'inherit',
      display: 'flex',
      height: '100%',
      flex: 1,
    }}
    >
      <Sidebar />
      <div style={{
        width: '100%',
        flex: 1,
        maxHeight: 'var(--app-height)',
      }}
      >
        <Container
          messagesListStyle={{
            width: '100%',
            flex: 1,
            maxWidth: '768px',
            margin: '0 auto',
            maxHeight: 'calc(100% - 136px)',
          }}
          header={{
            title: `${roomName}`,
            logoStyles: {
              marginRight: '6px',
            },
            logoContainerStyle: {
              minHeight: 0,
              minWidth: 0,
              maxHeight: '100%',
              height: '100%',
            },
            titleStyle: {
              fontWeight: '400',
            },
            headerStyles: {
              background: '#fff',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              padding: '0 12px',
              flex: 0,
              fontSize: '1rem',
            },
          }}
          containerStyles={{
            display: 'flex',
            height: '100%',
            flex: 1,
            flexDirection: 'column',
            background: '#f7f7f7',
            overflow: 'hidden',
          }}
          footer={{
            InputWrapper,
            placeholder: 'Type your message...',
            buttonStyles: {
              cursor: 'pointer',
              background: '#fff',
              padding: 0,
              height: '3rem',
              width: '3rem',
              border: 'none',
              borderRadius: '100%',
              display: 'flex',
              outline: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'rgb(99 99 99 / 30%) 0px 2px 8px 4px',
            },
            containerStyles: {
              background: 'transparent',
              height: '80px',
              maxWidth: '768px',
              margin: 'auto',
              width: '100%',
              display: 'flex ',
              flex: 1,
              boxSizing: 'border-box',
              padding: '0 12px',
            },
            inputWrapperStyles: {
              fontSize: '1rem',
              height: '3rem',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              boxShadow: 'rgba(99, 99, 99, 0.3) 0px 2px 8px 0px',
              backgroundColor: '#fff',
              marginRight: '8px',
            },
          }}
        />
      </div>
    </div>
  );
}
