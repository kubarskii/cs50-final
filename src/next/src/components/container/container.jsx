import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import dayjs from 'dayjs';
import Header from '../header/header';
import useChatbot from '../../hooks/useChatbot';
import Footer from '../footer/footer';
import ChatMessage from '../message/message';
import styles from './container.module.css';

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

  const {
    messages = [],
    registry,
    messagesStore,
  } = useChatbot({
    widgets,
    initialMessages,
  });

  console.log(messages);

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
      const lastChild = messagesListRef.current
        ?.firstElementChild
        ?.lastElementChild
        ?.lastElementChild
        ?.lastElementChild;
      console.dir(lastChild);
      if (!lastChild || !messagesListRef.current) return;
      messagesListRef.current.scroll({ top: 10000000, behavior });
    }, 10);
  }, [messagesListRef, initialMessages]);

  useEffect(() => {
    messagesStore.update(initialMessages);
    scrollToLast('auto');
  }, [initialMessages]);

  return (
    <div style={containerStyles}>
      {(!!messagesStore && !!registry)
                && (
                <div
                  className={styles.mainContainer}
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
                                    messagesStore={messagesStore}
                                    widgetsRegistry={registry}
                                    type={el.type}
                                    sender={el.sender}
                                    props={el.props}
                                    scroll={scrollToLast}
                                    uniqueId={el.uniqueId}
                                    currentMessage={messagesStore.getMessage(el.uniqueId)}
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
                    messagesStore={messagesStore}
                  />
                </div>
                )}
    </div>
  );
});
