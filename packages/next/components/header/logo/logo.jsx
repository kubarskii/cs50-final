import React from 'react';
import styles from './logo.module.css';

export default function Logo(props) {
  const {
    imgSrc,
    custom,
    logoStyles,
    logoContainerStyle,
  } = props;
  return (
    (custom)
      ? <div>{custom}</div>
      : (
        <div style={logoContainerStyle}>
          <img className={styles.logoImg} style={logoStyles} src={imgSrc} alt="chatbot logo" />
        </div>
      )
  );
}
