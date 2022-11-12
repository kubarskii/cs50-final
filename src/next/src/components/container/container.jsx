import React, { useCallback, useEffect, useRef } from 'react';
import Header from '../header/header';
import useChatbot from '../../hooks/useChatbot';
import Footer from '../footer/footer';
import ChatMessage from '../message/message';
import styles from './container.module.css';

export default function Container(props) {
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

  const messagesListRef = useRef(null);

  const scrollToLast = useCallback((behavior = 'smooth') => {
    setTimeout(() => {
      const lastChild = messagesListRef.current?.firstElementChild?.lastElementChild;
      if (!lastChild || !messagesListRef.current) return;
      messagesListRef.current.scroll({ top: lastChild.offsetTop, behavior });
      //  scrollTop = lastChild.offsetTop;
    });
  }, [messagesListRef, initialMessages]);

  const scrollSmooth = useCallback(() => {
    setTimeout(() => {
      if (messagesListRef.current) {
        const yCoord = messagesListRef.current.lastChild.offsetTop;
        messagesListRef.current.scrollTo({
          left: 0,
          top: yCoord,
          behavior: 'smooth',
        });
      }
    });
  }, [messagesListRef, initialMessages]);

  useEffect(() => {
    messagesStore.update(initialMessages);
    scrollToLast(undefined);
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
                      {messages.map((el, index) => (
                        <ChatMessage
                          key={el.uniqueId}
                          needTail={el.sender !== messages[index + 1]?.sender}
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
}
