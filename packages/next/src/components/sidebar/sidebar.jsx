import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReadyState } from 'react-use-websocket';
import { JWT } from '@me/server/src/utils/jwt';
import styles from './sidebar.module.css';
import useCookie from '../../hooks/useCookie';
import UserInfo from './user-info';
import Room from './room';
import SearchBar from './search-bar';

export function RoomsList(props) {
  const { currentRoomId, userId } = props;
  const rooms = useSelector((state) => state.rooms.rooms);

  return (
    <>
      {rooms.map(({ id: elRoomId, name: roomName, last_message: lastMessage }) => (
        <Room
          isSelected={elRoomId === currentRoomId}
          roomId={elRoomId}
          roomName={roomName}
          userId={userId}
          key={elRoomId}
          lastMessage={lastMessage}
        />
      ))}
    </>
  );
}

export default function Sidebar() {
  const [token] = useCookie('accessToken');
  const decoded = JWT.decoderJWT(token);
  const { name, surname, id: userId } = decoded;
  const { wsStatus: { wsState: readyState } } = useSelector((state) => state);
  const { id: currentRoomId } = useSelector((state) => state.rooms.currentRoom);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Retrying',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (currentRoomId) window.history.pushState({}, null, `/?roomId=${currentRoomId}`);
  }, [currentRoomId]);

  return (
    <aside className={styles.asideComponent}>
      <UserInfo name={name} surname={surname} />
      <SearchBar token={token} />
      <div>
        <RoomsList
          currentRoomId={currentRoomId}
          userId={userId}
        />
      </div>
      {connectionStatus !== 'Open' && (
      <div className={styles.connectionStatus}>
        <p>{connectionStatus}</p>
        <div className={styles.ring} />
      </div>
      )}
    </aside>
  );
}
