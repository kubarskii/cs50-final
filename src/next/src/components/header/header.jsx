import React from 'react';
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
    controls,
  } = props;

  return (
    <div className={['header', styles.headerContainer].join(' ')} style={headerStyles}>
      <Logo
        custom={custom}
        logoContainerStyle={logoContainerStyle}
        logoStyles={logoStyles}
        imgSrc={imgSrc}
      />
      <h3 style={{ flex: 1, ...titleStyle }}>{title}</h3>
      <div style={controlContainerStyles}>
        {controls}
      </div>
    </div>
  );
}
