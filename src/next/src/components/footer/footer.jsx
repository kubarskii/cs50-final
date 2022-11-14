import React, {
  useCallback, useContext, useRef, useState,
} from 'react';
import Input from '../input/input';
import Semaphore from '../../utils/semaphore';
import { ControlsContext } from '../../context/controls.context';

export default function Footer(props) {
  const {
    left,
    right,
    messagesStore,
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

  const [query, setQuery] = useState('');
  const semaphoreRef = useRef(new Semaphore(maxConcurrentRequests));
  const inputRef = useRef(null);
  const controls = useContext(ControlsContext);

  const processMessage = useCallback(async (q) => {
    const result = await inputParser({
      query: q,
      messagesStore,
      scroll,
      botControls: controls,
    });
    await messageParser({
      query: q,
      result,
      messagesStore,
      scroll,
      botControls: controls,
    });
  }, [inputParser, messageParser]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const q = query;
    setQuery(() => '');

    inputRef.current?.focus();
    if (query === '') return;

    messagesStore.add({
      props: {
        text: query,
        date: Date.now(),
      },
      type: 'message',
      sender: 'user',
    });
    scroll();
    /**
     * Promise warnings should be ignored
     * */
    semaphoreRef.current
      .execute(processMessage, q);
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
            botControls={controls}
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
            messagesStore={messagesStore}
            buttonTitle={buttonTitle}
            buttonStyles={buttonStyles}
          />
        )
          : (
            <Input
              botControls={controls}
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
              messagesStore={messagesStore}
              buttonTitle={buttonTitle}
              buttonStyles={buttonStyles}
            />
          )
      }

    </footer>
  );
}
