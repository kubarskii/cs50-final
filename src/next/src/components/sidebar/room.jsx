import React from 'react';
import styles from './sidebar.module.css';

export default function Room(props) {
  const {
    roomId,
    roomName,
    userId: id,
    isSelected,
  } = props;

  const onChatSelect = async (roomId, roomName) => {
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
