import React from "react";
import { ControlsContext } from "../../context/controls.context";
import { RoomService } from "../../services/room.service";
import useCookie from "../../hooks/useCookie";
import styles from "./sidebar.module.css";

export default function Room(props) {
  const [token] = useCookie("accessToken");
  const chatbotCtx = React.useContext(ControlsContext);
  const { roomId, roomName, userID: id, setMessages, isSelected } = props;

  const onChatSelect = (roomId, roomName) => {
    chatbotCtx.setCurrentRoom({ roomId, roomName });
    chatbotCtx.showInput();

    RoomService.getMessagesInRoom(token, roomId)
      .then(({ messages: data }) => {
        const preparedMessages = data.map((msg) => {
          const {
            id: messageId,
            message,
            user_id: userId,
            created_at: createdAt,
          } = msg;
          return {
            type: "message",
            sender: userId.toString() === id ? "user" : "bot",
            props: { text: message, date: createdAt },
            uniqueId: messageId,
          };
        });
        setMessages(preparedMessages);
      })
      .catch(console.log);
  };
  return (
    <div
      className={[isSelected ? styles.selected : "", styles.roomComponent].join(
        " "
      )}
      onPointerDown={() => onChatSelect(roomId, roomName)}
      key={roomId}
    >
      {roomName}
    </div>
  );
}
