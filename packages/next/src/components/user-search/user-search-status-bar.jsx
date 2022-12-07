import React from "react";
import styles from "./user-search.module.css";

export function StatusBar(props) {
  const { found } = props;
  return (
    <div className={styles.statusBarBody}>
      <span>{found > 0 ? `Found ${found} users` : "No users found"}</span>
    </div>
  );
}
