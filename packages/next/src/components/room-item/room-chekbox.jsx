import React from "react";
import styles from "./room-item.module.css";

export function RoomCheckbox() {
  return (
    <div className={styles.roomCheckboxBody}>
        <input type="checkbox" />
    </div>
  );
}
