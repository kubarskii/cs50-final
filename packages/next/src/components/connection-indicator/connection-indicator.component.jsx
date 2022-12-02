import React from 'react';
import { ReadyState } from 'react-use-websocket';
import { useSelector } from 'react-redux';
import styles from './connection-indicator.module.css';

export default function ConnectionIndicator() {
  const { wsStatus: { wsState: readyState } } = useSelector((state) => state);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Retrying',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    (connectionStatus !== 'Open') ? (
      <div className={styles.connectionStatus}>
        <p>{connectionStatus}</p>
        <div className={styles.ring} />
      </div>
    ) : null
  );
}
