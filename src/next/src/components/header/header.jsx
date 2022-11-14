import React, { useContext, useEffect, useState } from 'react';
import styles from './header.module.css';
import Logo from './logo/logo';
import { ControlsContext } from '../../context/controls.context';

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

  const botControls = useContext(ControlsContext);
  const [usersTyping, setTyping] = useState([]);

  useEffect(() => {
    const unsubscribe = botControls
      .subscribe(() => {
        const typing = botControls.getTyping();
        setTyping(typing);
      });
    return () => unsubscribe();
  }, []);

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
      {!!usersTyping.length && (
      <div style={{ display: 'flex' }}>
        <div className={styles['dot-elastic']} />
        <div style={{ marginLeft: '0.8rem' }}>
          {usersTyping.join(', ')}
          {' '}
          {usersTyping.length > 1 ? 'are' : 'is'}
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
