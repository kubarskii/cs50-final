import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import styles from './message.module.css';

/**
 * TODO:  Find the reason of extra re-renders
 * */
export default React.memo((props) => {
  const {
    type,
    sender,
    needTail = false,
    props: messageProps,
  } = props;

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
        style={{ width: loading ? '4rem' : undefined, marginLeft: '56px' }}
        className={[styles.message, styles.botMessage, tail].join(' ')}
      >
        {loading ? (
          <div className={styles['dot-elastic']} />
        ) : (
          <div>
            <p className={styles.timeText} style={{ marginLeft: '-4px' }}>{sender}</p>
            <div style={{ display: 'flex' }}>

              <p className={styles.messageText} aria-label="Bot value">
                {text}
              </p>
              <p className={styles.timeText} aria-label="Date value">
                {msgDate}
              </p>
            </div>
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

  const BotDefaultMessage = useCallback(() => <BotTextMessage />, [type, needTail]);

  return (
    <div style={{ flexShrink: 0 }}>
      {sender === 'user' ? <UserMessage /> : <BotDefaultMessage />}
    </div>
  );
});
