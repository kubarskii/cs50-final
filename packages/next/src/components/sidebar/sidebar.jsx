import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReadyState } from 'react-use-websocket';
import { JWT } from '@me/server/src/utils/jwt';
import styles from './sidebar.module.css';
import { RoomService } from '../../services/room.service';
import useCookie from '../../hooks/useCookie';
import UserInfo from './user-info';
import Room from './room';
import debounce from '../../utils/debounce';
import { UserService } from '../../services/user.service';
import { PORT } from '../../../constants';

export default function Sidebar() {
  const [token] = useCookie('accessToken');
  const decoded = JWT.decoderJWT(token);
  const { name, surname, id: userId } = decoded;
  const rooms = useSelector((state) => state.rooms.rooms);
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

  const onChange = async (e) => {
    const searchString = e.target.value;
    const { hostname, protocol } = window.location;
    if (searchString.length >= 2) {
      await UserService.findUser(token, searchString, `${protocol}//${hostname}:${PORT}`);
    }
  };

  const handler = useMemo(() => debounce(onChange, 300), [token]);

  return (
    <aside className={styles.asideComponent}>
      <UserInfo name={name} surname={surname} />
      <input
        type="text"
        placeholder="search"
        onChange={(e) => handler(e)}
        style={{
          maxWidth: 'calc(100% - 20px)',
          height: '32px',
          padding: '10px',
          boxSizing: 'border-box',
          margin: '10px',
          borderRadius: '8px',
          background: 'aliceblue',
        }}
      />
      {!!rooms && !!rooms.length && (
      <div>
        {rooms.map(({ id: elRoomId, name: roomName }) => (
          <Room
            isSelected={elRoomId === currentRoomId}
            roomId={elRoomId}
            roomName={roomName}
            userId={userId}
            key={elRoomId}
          />
        ))}
      </div>
      )}
      <button
        type="submit"
        style={{ width: '100%', border: '1px solid black' }}
        onClick={async () => {
          await RoomService.createRoom(token, {
            userIds: [2],
            name: 'nut',
          });
        }}
      >
        nut
      </button>
      {connectionStatus !== 'Open' && (
      <div className={styles.connectionStatus}>
        <p>{connectionStatus}</p>
        <div className={styles.ring} />
      </div>
      )}
    </aside>
  );
}
