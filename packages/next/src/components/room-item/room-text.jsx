import React from "react";
import styles from "./room-item.module.css";

export function RoomText(props) {
  const { topText, bottomText } = props;
  return (
    <div className={styles.roomTextBody}>
      <h1>{topText}</h1>
      <h2>{bottomText}</h2>
    </div>
  );
}
