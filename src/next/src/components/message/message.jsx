import React, { useCallback, useContext } from 'react';
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

  const { text = '' } = messageProps;

  const tail = !needTail ? styles.noTail : '';

  const UserMessage = useCallback(() => (
    <div className={[styles.message, styles.userMessage, tail].join(' ')}>
      <p aria-label="User message">{text}</p>
    </div>
  ), [messageProps, tail]);

  const BotTextMessage = useCallback(
    ({ loading = false }) => (
      <div
        style={{ width: loading ? '4rem' : undefined }}
        className={[styles.message, styles.botMessage, tail].join(' ')}
      >
        {loading ? (
          <div className={styles['dot-elastic']} />
        ) : (
          <p aria-label="Bot message">{text}</p>
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
        <Boundary type={type}>
          {(!!Widget)
              && <Widget />}
        </Boundary>
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
