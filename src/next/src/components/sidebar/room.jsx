import React from 'react';
import { ControlsContext } from '../../context/controls.context';
import useCookie from '../../hooks/useCookie';
import styles from './sidebar.module.css';

export default function Room(props) {
  const [token] = useCookie('accessToken');
  const chatbotCtx = React.useContext(ControlsContext);
  const {
    roomId,
    roomName,
    userId: id,
    isSelected,
  } = props;

  const onChatSelect = async (roomId, roomName) => {
    if (roomId === chatbotCtx.getCurrentRoom()?.roomId) return;
    chatbotCtx.setCurrentRoom({ roomId, roomName });
    chatbotCtx.showInput();
  };
  return (
    <div
      className={[isSelected ? styles.selected : '', styles.roomComponent].join(' ')}
      onPointerDown={() => onChatSelect(roomId, roomName)}
      key={roomId}
    >
      {roomName}
    </div>
  );
}
