import React, { useCallback, useRef } from 'react';
import Header from '../header/header';
import useChatbot from '../../hooks/useChatbot';
import Footer from '../footer/footer';
import BotMessage from '../message/message';
import styles from './container.module.css';
import { ControlsProvider } from '../../context/controls.context';

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

  const messagesListRef = useRef < HTMLDivElement > (null);
  const scrollToLast = useCallback(() => {
    setTimeout(() => {
      const lastChild = messagesListRef.current?.lastElementChild;
      if (!lastChild || !messagesListRef.current) return;
      messagesListRef.current.scrollTop = lastChild.offsetTop;
    });
  }, [messagesStore]);

  return (
    <ControlsProvider inputDisabled={inputDisabled} isOnline={isOnline}>
      <div style={containerStyles}>
        {(!!messagesStore && !!registry)
                    && (
                    <>
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
                        style={messagesListStyle}
                        className={styles.container}
                        ref={messagesListRef}
                      >
                        {messages.map((el, index) => (
                          <BotMessage
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
                    </>
                    )}
      </div>
    </ControlsProvider>
  );
}
