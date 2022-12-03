import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '../input/input';

export default function Footer(props) {
  const {
    buttonTitle,
    left,
    right,
    placeholder,
    InputWrapper,
    scroll,
    inputWrapperStyles,
    containerStyles,
    buttonStyles,
  } = props;

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { id: roomId } = useSelector((state) => state.rooms.currentRoom);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setQuery(() => '');

    inputRef.current?.focus();
    if (query === '') return;

    scroll();
  };

  const onChangeHandler = useCallback((e) => {
    const { value } = e.target;
    setQuery(value);
  }, []);

  if (!roomId) return null;

  return (
    <footer style={{ flexShrink: 0 }}>
      {
                InputWrapper ? (
                  <InputWrapper
                    inputWrapperStyles={inputWrapperStyles}
                    containerStyles={containerStyles}
                    defaultOnChange={onChangeHandler}
                    defaultOnSubmit={onSubmitHandler}
                    Original={Input}
                    scroll={scroll}
                    left={left}
                    right={right}
                    placeholder={placeholder}
                    buttonTitle={buttonTitle}
                    buttonStyles={buttonStyles}
                  />
                )
                  : (
                    <Input
                      inputWrapperStyles={inputWrapperStyles}
                      containerStyles={containerStyles}
                      ref={inputRef}
                      onSubmit={onSubmitHandler}
                      onChange={onChangeHandler}
                      value={query}
                      scroll={scroll}
                      left={left}
                      right={right}
                      placeholder={placeholder}
                      buttonTitle={buttonTitle}
                      buttonStyles={buttonStyles}
                    />
                  )
            }

    </footer>
  );
}
