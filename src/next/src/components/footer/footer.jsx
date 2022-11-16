import React, {
  useCallback, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import Input from '../input/input';
import { message } from '../../store/slices/messages.slice';

export default function Footer(props) {
  const {
    left,
    right,
    messageParser,
    inputParser,
    placeholder,
    InputWrapper,
    scroll,
    maxConcurrentRequests,
    inputWrapperStyles,
    containerStyles,
    buttonTitle,
    buttonStyles,
  } = props;

  console.log(InputWrapper);

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

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
            maxConcurrentRequests={maxConcurrentRequests}
            scroll={scroll}
            left={left}
            right={right}
            inputParser={inputParser}
            messageParser={messageParser}
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
              maxConcurrentRequests={maxConcurrentRequests}
              left={left}
              right={right}
              inputParser={inputParser}
              messageParser={messageParser}
              placeholder={placeholder}
              buttonTitle={buttonTitle}
              buttonStyles={buttonStyles}
            />
          )
      }

    </footer>
  );
}
