import React, { useState } from 'react';
import styles from './header.module.css';
import Logo from './logo/logo';

export default function Header(props) {
  const {
    title = 'Chatbot',
    headerStyles = {},
    imgSrc,
    custom,
    logoContainerStyle,
    logoStyles,
    controlContainerStyles,
    titleStyle = {},
    controls, // buttons
  } = props;

  return (
    <div className={['header', styles.headerContainer].join(' ')} style={headerStyles}>
      { (!!(custom || imgSrc)) && (
      <Logo
        custom={custom}
        logoContainerStyle={logoContainerStyle}
        logoStyles={logoStyles}
        imgSrc={imgSrc}
      />
      )}
      <h3 style={{ flex: 1, ...titleStyle }}>{title}</h3>
      {!![].length && (
      <div style={{ display: 'flex' }}>
        <div className={styles['dot-elastic']} />
        <div style={{ marginLeft: '0.8rem' }}>
          {[].join(', ')}
          {' '}
          {[].length > 1 ? 'are' : 'is'}
          {' '}
          typing
        </div>
      </div>
      )}
      <div style={controlContainerStyles}>
        {controls}
      </div>
    </div>
  );
}
