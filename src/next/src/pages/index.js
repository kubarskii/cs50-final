import React, { useCallback, useEffect, useState } from 'react';
import Container from '../components/container/container';
import InputWrapper from '../components/input-wrapper/input-wrapper.component';
import { useGetMessagesInRoomQuery, useGetUsersInTheRoomQuery, useGetUsersRoomsQuery } from '../services/room.service';
import Sidebar from '../components/sidebar/sidebar';
import { ControlsContext } from '../context/controls.context';
import useCookie from '../hooks/useCookie';
import { JWT } from '../../../utils/jwt';

export async function getServerSideProps(context) {
  const { headers: host } = context.req;
  return { props: { host: host.host } };
}

function HomePage(props) {
  const { host } = props;
  const [hostname, port = 80] = host.split(':');
  const [token] = useCookie('accessToken');
  const decoded = JWT.decoderJWT(token);
  const { id } = decoded;

  /**
   * Adding hostname and port to the component
   * */
  // eslint-disable-next-line no-shadow
  const wrapper = useCallback((props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <InputWrapper {...props} port={port} hostname={hostname} />
  ), [port]);

  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(0);
  const chatbotCtx = React.useContext(ControlsContext);
  let { roomName = 'Message-ME' } = chatbotCtx.getCurrentRoom();
  const {
    data: { messages: messagesResponse = [] } = {},
    error: messagesError,
    isLoading: isMessagesLoading,
  } = useGetMessagesInRoomQuery(roomId);
  const {
    data: { rooms = [] } = {},
    error: roomsListError,
    isLoading: isRoomsListLoading,
  } = useGetUsersRoomsQuery();

  const {
    data: { members = [] } = {},
    error: roomsMembersError,
    isLoading: isMembersLoading,
  } = useGetUsersInTheRoomQuery(roomId);

  if (members.length && members.length <= 2) {
    const { name, surname } = members.find((el) => el.id !== id);
    roomName = `${name} ${surname}`;
  }

  useEffect(() => {
    const preparedMessages = messagesResponse.map((msg) => {
      const {
        id: messageId,
        message,
        user_id: userId,
        created_at: createdAt,
      } = msg;
      const { name = '', surname = '' } = members?.find((el) => el.id === userId.toString()) || {};
      return {
        type: 'message',
        sender: userId.toString() === id ? 'user' : `${name}`,
        props: { text: message, date: createdAt },
        uniqueId: messageId,
      };
    });
    /**
     * Creating data suitable for MessagesStore
     * */
    setMessages(preparedMessages);
  }, [messagesResponse, members]);

  useEffect(() => {
    const unsubscribe = chatbotCtx.subscribe(({ currentRoom }) => {
      if (currentRoom.roomId && roomId !== currentRoom.roomId) {
        setRoomId(currentRoom.roomId);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{
      maxHeight: 'inherit',
      display: 'flex',
      height: '100%',
      flex: 1,
    }}
    >
      <Sidebar rooms={rooms} />
      <div style={{
        width: '100%',
        flex: 1,
        maxHeight: 'var(--app-height)',
      }}
      >
        <Container
          initialMessages={messages}
          {...{
            messagesListStyle: {
              width: '100%',
              flex: 1,
              maxWidth: '768px',
              margin: '0 auto',
              maxHeight: 'calc(100% - 136px)',
            },
            header: {
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
              InputWrapper: wrapper,
            },
          }}
        />
      </div>
    </div>
  );
}

export default HomePage;
