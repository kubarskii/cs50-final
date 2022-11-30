import React, { useMemo } from 'react';
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

  const randWidth = useMemo(() => Math.floor(Math.random() * 100) + 32, [false]);

  return (
    <div
      className={[isSelected ? styles.selected : '', styles.roomComponent].join(' ')}
      onClick={() => onChatSelect(roomId, roomName)}
      key={roomId}
    >
      <div className="row">
        <div
          style={{
            width: '2rem',
            height: '2rem',
            marginRight: '8px',
          }}
        >
          <img
            style={{
              borderRadius: '50%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            src={`https://placekitten.com/${randWidth}/${randWidth}`}
            alt=""
          />
        </div>
        <div>
          <h5><b>{roomName}</b></h5>
          <p>{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}
