import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './sidebar.module.css';
import { current } from '../../store/slices/room.slice';

export default function Room(props) {
  const {
    roomId,
    roomName,
    userId: id,
    isSelected,
  } = props;

  const dispatch = useDispatch();

  const onChatSelect = async (roomId, roomName) => {
    dispatch(current({ id: roomId, name: roomName }));
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
