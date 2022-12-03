import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReadyState } from 'react-use-websocket';
import Sidebar from '../sidebar/sidebar';
import { WebsocketContext } from '../../context/websocket.context';
import { combineClasses } from '../../utils/combineClasses';
import styles from './chatbot-container.module.css';
import InputWrapper from '../input-wrapper/input-wrapper.component';
import Container from '../container/container';
import Header from '../header/header';
import { SVGIcon } from '../button/button.component';
import { current } from '../../store/slices/room.slice';
import { messages } from '../../store/slices/messages.slice';
import ConnectionIndicator from '../connection-indicator/connection-indicator.component';

export default function ChatbotContainer() {
  const { sendMessage, readyState } = useContext(WebsocketContext);
  const { id: roomId = '', name: roomName = '' } = useSelector((state) => state.rooms.currentRoom);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (roomId) {
        sendMessage(JSON.stringify([1, 'messages', { roomId }]));
        sendMessage(JSON.stringify([1, 'members', { roomId }]));
      }
      sendMessage(JSON.stringify([1, 'rooms', {}]));
    }
  }, [roomId, readyState]);

  const asideCheckBoxRef = useRef(null);
  useEffect(() => {
    if (roomId && asideCheckBoxRef.current) {
      asideCheckBoxRef.current.checked = true;
    }
  }, [roomId]);

  const dispatch = useDispatch();
  const headerStylesProps = useMemo(() => ({
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
      fontSize: '1rem',
    },
  }), [false]);

  const backHandler = useCallback(() => {
    dispatch(messages({ rows: [] }));
    dispatch(current({ id: null, name: null }));
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  return (
    <div className={combineClasses('row nowrap overflow-hidden', styles.fillHeight)}>
      <input
        ref={asideCheckBoxRef}
        type="checkbox"
        id="asideCB"
        name="asideCB"
        className={combineClasses(styles.hiddenCheckbox)}
      />
      <div className={combineClasses('col-md-4 overflow-hidden', styles.asideWrapper)}>
        <Sidebar />
      </div>
      <div className={combineClasses('col-auto overflow-hidden', styles.contentWrapper)}>
        <div className="row nowrap">
          <label
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                asideCheckBoxRef.current.click();
              }
            }}
            htmlFor="asideCB"
            className={combineClasses('btn svg btn-no-shadow', styles.backButton)}
            onClick={backHandler}
          >
            <SVGIcon type="back" />
          </label>
          <Header
            title={roomName}
            {...headerStylesProps}
          />
        </div>
        <Container
          messagesListStyle={{
            width: '100%',
            flex: 1,
            maxWidth: '768px',
            margin: '0 auto',
            maxHeight: 'calc(100% - 136px)',
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
      <ConnectionIndicator />
    </div>
  );
}
