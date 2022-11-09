import React, { useCallback, useContext } from 'react';
import dayjs from 'dayjs';
import styles from './message.module.css';
import Boundary from '../error-boundary/error-boundary.component';
import { ControlsContext } from '../../context/controls.context';

/**
 * TODO:  Find the reason of extra re-renders
 * */
export default React.memo((props) => {
  const {
    type,
    sender,
    needTail = false,
    widgetsRegistry,
    messagesStore,
    props: messageProps,
    uniqueId,
    scroll,
    currentMessage,
  } = props;

  const controls = useContext(ControlsContext);
  const { text = '', date: createdAt } = messageProps;
  const msgDate = dayjs(createdAt).format('HH:mm');
  const tail = !needTail ? styles.noTail : '';

  const UserMessage = useCallback(
    () => (
      <div className={[styles.message, styles.userMessage, tail].join(' ')}>
        <p className={styles.messageText} aria-label="User value">
          {text}
        </p>
        <p className={styles.timeText} aria-label="Date value">
          {msgDate}
        </p>
        {needTail && (
        <svg
          className={styles.tailSvg}
          viewBox="1.206 1.675 70.253 89.665"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 1.608 2.178 L 2.047 59.227 C 2.8 89.269 55.176 93.882 69.813 89.324 C 47.226 81.53 41.265 79.33 35.076 59.696 C 34.221 56.983 34.723 0.142 34.781 1.899"
          />
          <path d="M 35.203 1.755 L 1.577 1.906" />
        </svg>
        )}
      </div>
    ),
    [messageProps, tail],
  );

  const BotTextMessage = useCallback(
    ({ loading = false }) => (
      <div
        style={{ width: loading ? '4rem' : undefined }}
        className={[styles.message, styles.botMessage, tail].join(' ')}
      >
        {loading ? (
          <div className={styles['dot-elastic']} />
        ) : (
          <div style={{ display: 'flex' }}>
            <p className={styles.messageText} aria-label="Bot value">
              {text}
            </p>
            <p className={styles.timeText} aria-label="Date value">
              {msgDate}
            </p>
          </div>
        )}
        {needTail && (
        <svg
          className={styles.tailSvgBot}
          viewBox="1.206 1.675 70.253 89.665"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 1.608 2.178 L 2.047 59.227 C 2.8 89.269 55.176 93.882 69.813 89.324 C 47.226 81.53 41.265 79.33 35.076 59.696 C 34.221 56.983 34.723 0.142 34.781 1.899"
          />
          <path d="M 35.203 1.755 L 1.577 1.906" />
        </svg>
        )}
      </div>
    ),
    [messageProps, tail],
  );

  const BotWidgetMessage = useCallback(() => {
    const Widget = widgetsRegistry.getWidget(type, {
      ...messageProps,
      scroll,
      messagesStore,
      uniqueId,
      botControls: controls,
      widgetsRegistry,
      needTail,
      type,
    });
    return (
      <div aria-label="Bot widget">
        <Boundary type={type}>{!!Widget && <Widget />}</Boundary>
      </div>
    );
  }, [type, needTail, messageProps]);

  const BotDefaultMessage = useCallback(() => {
    if (type === 'message') {
      return <BotTextMessage />;
    }
    if (type === 'loading') {
      return <BotTextMessage loading />;
    }
    return <BotWidgetMessage />;
  }, [type, needTail, currentMessage]);

  return (
    <div>
      {sender === 'user' && <UserMessage />}
      {sender === 'bot' && <BotDefaultMessage />}
    </div>
  );
});
