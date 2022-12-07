import React from "react";
import styles from "./room-item.module.css";

export function RoomAvatar() {
  const randWidth = React.useMemo(
    () => Math.floor(Math.random() * 100) + 32,
    [false]
  );
  return (
    <div className={styles.roomAvatarWrapper}>
      <img
        src={`https://placekitten.com/${randWidth}/${randWidth}`}
        alt="avatart"
      />
    </div>
  );
}
