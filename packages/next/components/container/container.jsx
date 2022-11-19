import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { JWT } from '@me/server/src/utils/jwt';
import Header from '../header/header';
import Footer from '../footer/footer';
import ChatMessage from '../message/message';
import styles from './container.module.css';
import { useGetUsersInTheRoomQuery } from '../../services/room.service';
import { getCookie } from '../../hooks/useCookie';

export default React.memo((props) => {
  const {
    isOnline = true,
    inputDisabled = false,
    initialMessages = [],
    widgets = {},
    inputParser,
    messageParser,
    containerStyles,
    maxConcurrentRequests,
    messagesListStyle,
    onClose,
    footer: {
      right,
      left,
      placeholder,
      InputWrapper,
      containerStyles: footerContainerStyles,
      inputWrapperStyles,
      buttonTitle,
      buttonStyles,
    } = {},
    header: {
      imgSrc,
      logoContainerStyle,
      custom,
      logoStyles,
      showX,
      controlContainerStyles = {},
      headerStyles = {},
      controlsStyle = {},
      title = 'Chatbot',
      logo,
      titleStyle,
      controls,
    } = {},
  } = props;

  const storeMessages = useSelector((state) => state.messages.messages);
  const { id: roomId = 0 } = useSelector((state) => state.rooms.currentRoom);
  const [messages, setMessages] = useState([]);
  const token = getCookie('accessToken');
  const { id: userIdFromToken } = JWT.decoderJWT(token);
  const {
    data: { members = [] } = {},
    error: roomsMembersError,
    isLoading: isMembersLoading,
  } = useGetUsersInTheRoomQuery(roomId);

  useEffect(() => {
    if (!members.length) return;
    const preparedMessages = storeMessages.map((msg) => {
      const {
        id: messageId,
        message,
        user_id: senderId,
        created_at: createdAt,
      } = msg;
      const { name = '', surname = '' } = members?.find((el) => el.id === senderId.toString()) || {};
      return {
        type: 'message',
        sender: senderId.toString() === userIdFromToken ? 'user' : `${name}`,
        props: { text: message, date: createdAt },
        uniqueId: messageId,
      };
    });
    /**
         * Creating data suitable for MessagesStore
         * */
    setMessages(preparedMessages);
  }, [members, storeMessages]);

  const splitByUser = useCallback((messages) => messages.reduce((acc, curr, index) => {
    if (index === 0) {
      return [[curr]];
    }
    const lastArrayFromAcc = acc[acc.length - 1];
    const lastFromLast = lastArrayFromAcc[lastArrayFromAcc.length - 1];
    if (lastFromLast.sender === curr.sender) {
      const arr = [...acc];
      arr[arr.length - 1].push(curr);
      return arr;
    }
    return [...acc, [curr]];
  }, []), []);

  const splittedByDate = useMemo(() => messages
    .reduce((acc, curr, index) => {
      if (index === 0) {
        return [[curr]];
      }
      const lastArrayFromAcc = acc[acc.length - 1];
      const lastFromLast = lastArrayFromAcc[lastArrayFromAcc.length - 1];

      const lastDate = new Date(lastFromLast.props.date);
      const currDate = new Date(curr.props.date);

      if (lastDate.getDate() === currDate.getDate()) {
        const arr = [...acc];
        arr[arr.length - 1].push(curr);
        return arr;
      }
      return [...acc, [curr]];
    }, [])
    .map(splitByUser), [messages]);

  const messagesListRef = useRef(null);

  const scrollToLast = useCallback((behavior = 'smooth') => {
    setTimeout(() => {
      messagesListRef.current?.scroll({ top: 10000000, behavior });
    }, 100);
  }, [messagesListRef, messages]);

  useEffect(() => {
    scrollToLast('auto');
  }, [initialMessages]);

  return (
    <div style={containerStyles}>
      {(!!messages)
                && (
                <div
                  className={[styles.mainContainer, 'bg-gra-03'].join(' ')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <Header
                    onClose={onClose}
                    headerStyles={headerStyles}
                    controlContainerStyles={controlContainerStyles}
                    controlsStyle={controlsStyle}
                    logo={logo}
                    showX={showX}
                    imgSrc={imgSrc}
                    logoStyles={logoStyles}
                    logoContainerStyle={logoContainerStyle}
                    custom={custom}
                    title={title}
                    titleStyle={titleStyle}
                    controls={controls}
                  />
                  <div
                    style={{
                      overflowY: 'overlay',
                      display: 'flex',
                      flex: 1,
                      maxHeight: 'calc(100% - 136px)',
                    }}
                    ref={messagesListRef}
                  >
                    <div
                      style={messagesListStyle}
                      className={styles.container}
                    >
                      {splittedByDate.map((byUser) => (
                        <div style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          height: 'maxContent',
                          flexShrink: 0,
                        }}
                        >
                          <p style={{
                            position: 'sticky',
                            margin: '0px auto',
                            top: '10px',
                            left: 0,
                            zIndex: 2,
                            fontWeight: 'bold',
                            fontSize: '.75rem',
                            borderRadius: '40px',
                            background: 'hsla(86.4, 43.8462%, 45.1176%, 0.4)',
                            padding: '4px 8px',
                            color: '#fff',
                          }}
                          >
                            {
                                                dayjs(byUser[0][0].props.date).format('DD MMMM')
                                            }
                          </p>
                          {
                                            byUser.map((group) => (
                                              <div
                                                style={{
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  flexShrink: 0,
                                                  position: 'relative',
                                                }}
                                              >
                                                {group[0].sender !== 'user' && (
                                                <div style={{
                                                  display: 'flex',
                                                  flexDirection: 'column-reverse',
                                                  position: 'absolute',
                                                  paddingTop: '18px',
                                                  marginBottom: '9px',
                                                  height: '100%',
                                                  width: '100%',
                                                  bottom: 0,
                                                  left: 0,
                                                }}
                                                >
                                                  <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: '#fff',
                                                    position: 'sticky',
                                                    top: '9px',
                                                    fontSize: '20px',
                                                    bottom: 0,
                                                    left: 0,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    alignContent: 'center',
                                                  }}
                                                  >
                                                    {group[0].sender.slice(0, 2).toUpperCase()}
                                                  </div>
                                                </div>
                                                )}
                                                {group.map((el, index) => (
                                                  <ChatMessage
                                                    key={el.uniqueId}
                                                    needTail={el.sender !== group[index + 1]?.sender}
                                                    type={el.type}
                                                    sender={el.sender}
                                                    props={el.props}
                                                    scroll={scrollToLast}
                                                    uniqueId={el.uniqueId}
                                                  />
                                                ))}
                                              </div>
                                            ))
                                        }
                        </div>
                      ))}

                    </div>
                  </div>
                  <Footer
                    containerStyles={footerContainerStyles}
                    inputWrapperStyles={inputWrapperStyles}
                    InputWrapper={InputWrapper}
                    scroll={scrollToLast}
                    placeholder={placeholder}
                    maxConcurrentRequests={maxConcurrentRequests}
                    right={right}
                    left={left}
                    inputParser={inputParser}
                    buttonStyles={buttonStyles}
                    buttonTitle={buttonTitle}
                    messageParser={messageParser}
                  />
                </div>
                )}
    </div>
  );
});
