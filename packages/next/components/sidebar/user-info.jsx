import React from 'react';
import styles from './sidebar.module.css';

export default function UserInfo(props) {
  const { name, surname } = props;

  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.userAvatar} />
      <h3 className={styles.userName}>{`${name} ${surname}`}</h3>
    </div>
  );
}
