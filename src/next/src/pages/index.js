import React, {
  useContext, useEffect, useState,
} from 'react';
import Container from '../components/container/container';
import InputWrapper from '../components/input-wrapper/input-wrapper.component';
import useCookie from '../hooks/useCookie';
import { JWT } from '../../../utils/jwt';
import { RoomService } from '../services/room.service';
import { ControlsContext } from '../context/controls.context';

function HomePage() {
  const [token] = useCookie('accessToken');
  const decoded = JWT.decoderJWT(token);
  const { name, surname, id } = decoded;
  const [rooms, setRooms] = useState([]);
  const chatbotCtx = useContext(ControlsContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    RoomService.getUsersRooms(token)
      .then(({ rooms: roomsResponse }) => {
        setRooms(roomsResponse);
      })
      .catch(console.log);
  }, []);

  const onChatSelect = (roomId) => {
    chatbotCtx.setCurrentRoom(roomId);
    chatbotCtx.showInput();

    RoomService.getMessagesInRoom(token, roomId)
      .then(({ messages: data }) => {
        const preparedMessages = data.map((msg) => {
          const {
            id: messageId, message, user_id: userId,
          } = msg;
          return {
            type: 'message',
            sender: (userId.toString() === id) ? 'user' : 'bot',
            props: { text: message },
            uniqueId: messageId,
          };
        });
        setMessages(preparedMessages);
      })
      .catch(console.log);
  };

  return (
    <div style={{
      display: 'flex',
    }}
    >
      <aside style={{
        width: '100%',
        maxWidth: '300px',
        overflow: 'hidden',
        flexShrink: 3,
        borderRight: '1px solid #dfe1e5',
      }}
      >
        <div style={{
          alignItems: 'center',
          display: 'flex',
          height: '56px',
          maxWidth: 'inherit',
        }}
        >
          <div style={{
            marginRight: '4px',
            flexShrink: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ccc',
          }}
          />
          <h3 style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          >
            {name}
            {' '}
            {surname}
          </h3>
        </div>
        {!!rooms && !!rooms.length && (
          <div>
            {
              rooms.map(({ id, name: roomName }) => (
                <div
                  style={{
                    border: '1px solid #ccc',
                    height: '3rem',
                    cursor: 'pointer',
                  }}
                  onPointerDown={() => onChatSelect(id)}
                  key={id}
                >
                  {roomName}
                </div>
              ))
            }
          </div>
        )}
      </aside>
      <div style={{
        height: '100vh',
        width: '100%',
        maxHeight: '100%',
      }}
      >
        <Container
          initialMessages={messages}
          {...{
            messagesListStyle: {
              width: '100%',
              maxWidth: '768px',
              margin: '0 auto',
            },
            header: {
              title: 'Message-ME',
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
            },
            containerStyles: {
              display: 'flex',
              height: '100%',
              flex: 1,
              flexDirection: 'column',
              background: '#f7f7f7',
              overflow: 'hidden',
            },
            footer: {
              placeholder: 'Type your value here...',
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
                boxSizing: 'border-box',
                padding: '0 12px',
              },
              inputWrapperStyles: {
                fontSize: '1rem',
                height: '3rem',
                boxShadow: 'rgba(99, 99, 99, 0.3) 0px 2px 8px 0px',
                backgroundColor: '#fff',
                marginRight: '8px',
              },
              InputWrapper,
            },
          }}
        />
      </div>
    </div>
  );
}

export default HomePage;
