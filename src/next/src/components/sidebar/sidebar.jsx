import React, { useEffect, useMemo, useState } from 'react';
import styles from './sidebar.module.css';
import { RoomService } from '../../services/room.service';
import useCookie from '../../hooks/useCookie';
import { JWT } from '../../../../utils/jwt';
import UserInfo from './user-info';
import Room from './room';
import { ControlsContext } from '../../context/controls.context';
import debounce from '../../utils/debounce';
import { UserService } from '../../services/user.service';

export default function Sidebar(props) {
  const [token] = useCookie('accessToken');
  const decoded = JWT.decoderJWT(token);
  const { name, surname, id: userId } = decoded;
  const { rooms, setMessages } = props;
  const chatbotCtx = React.useContext(ControlsContext);
  const [currentRoomId, setCurrentRoomId] = useState(chatbotCtx.getCurrentRoom());

  useEffect(() => {
    const unsubscribe = chatbotCtx.subscribe((value) => {
      const { currentRoom: { roomId } } = value;
      setCurrentRoomId(roomId);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onChange = async (e) => {
    const searchString = e.target.value;
    if (searchString.length >= 2) {
      const res = await UserService.findUser(token, searchString);
      console.log(res);
    }
  };

  const handler = useMemo(() => debounce(onChange, 300), [token]);

  return (
    <aside className={styles.asideComponent}>
      <UserInfo name={name} surname={surname} />
      <input type="text" placeholder="search" onChange={(e) => handler(e)} />

      {!!rooms && !!rooms.length && (
        <div>
          {rooms.map(({ id: roomId, name: roomName }) => (
            <Room
              isSelected={roomId === currentRoomId}
              roomId={roomId}
              roomName={roomName}
              setMessages={setMessages}
              userID={userId}
              key={roomId}
            />
          ))}
        </div>
      )}

      <button
        style={{ width: '100%', border: '1px solid black' }}
        onClick={async () => {
          const res = await RoomService.createRoom(token, {
            userIds: [2],
            name: 'nut',
          });
        }}
      >
        nut
      </button>
    </aside>
  );
}
