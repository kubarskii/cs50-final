import React from "react";
import styles from "./room-item.module.css";
import { RoomAvatar } from "./room-avatar";
import { RoomText } from "./room-text";
import { RoomCheckbox } from "./room-chekbox";

export function RoomItem(props) {
  const { user, checkbox = false, selected } = props;
  return (
    <div
      className={[selected ? styles.selected : "", styles.roomItemBody].join(
        " "
      )}
    >
      {checkbox && <RoomCheckbox />}
      <RoomAvatar />
      <RoomText topText={user.name} bottomText={"Bottom"} />
    </div>
  );
}
