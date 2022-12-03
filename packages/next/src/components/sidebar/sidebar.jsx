import { JWT } from '@me/server/src/utils/jwt';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReadyState } from 'react-use-websocket';
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
      {rooms.map(({
        members, id: elRoomId, name: roomName, last_message: lastMessage, sender_id: senderId,
      }) => (
        <Room
          sender={members.find((member) => member.user_id?.toString() === senderId?.toString())}
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
  const { id: currentRoomId } = useSelector((state) => state.rooms.currentRoom);

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
    </aside>
  );
}
