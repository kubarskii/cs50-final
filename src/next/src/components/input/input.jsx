import React, {
  useEffect, useState,
} from 'react';
import styles from './input.module.css';

export default React.forwardRef((props, ref) => {
  const {
    value,
    onChange,
    onSubmit,
    placeholder,
    right,
    left,
    containerStyles = {},
    inputWrapperStyles = {},
    buttonStyles = {},
    buttonTitle = 'Send',
    botControls,
  } = props;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const unsubscribe = botControls
      .subscribe((v) => {
        const { inputDisabled } = v;
        setDisabled(inputDisabled);
      });
    return () => unsubscribe();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <div style={containerStyles}>
        <div className={styles.controlsWrapper}>
          <div className={styles.inputWrapper} style={inputWrapperStyles}>
            <div>
              {left}
            </div>
            <input
              disabled={disabled}
              ref={ref}
              className={styles.input}
              spellCheck
              autoCorrect="on"
              onChange={onChange}
              value={value}
              type="text"
              placeholder={placeholder}
            />
            {right}
          </div>
          <button type="submit" style={buttonStyles}>{buttonTitle}</button>
        </div>
      </div>
    </form>
  );
});
