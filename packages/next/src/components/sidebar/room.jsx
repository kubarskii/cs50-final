import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './sidebar.module.css';
import { current } from '../../store/slices/room.slice';

export default function Room(props) {
  const {
    roomId,
    roomName,
    lastMessage = '',
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
      onClick={() => onChatSelect(roomId, roomName)}
      key={roomId}
    >
      <div className="row">
        <div />
        <div>
          <h5><b>{roomName}</b></h5>
          <p>{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}
