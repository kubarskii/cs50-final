import { useCallback, useContext, useState } from 'react';
import useWebSockets from '../../hooks/useWebSockets';
import { ControlsContext } from '../../context/controls.context';

export default function InputWrapper(props) {
  const { Original, messagesStore, scroll } = props;

  const [value, setValue] = useState('');

  const ctx = useContext(ControlsContext);

  const onMessage = useCallback(({ data }) => {
    const parsedData = JSON.parse(data);
    switch (parsedData?.[1]) {
      case 'message': {
        messagesStore?.add({
          type: 'message',
          sender: 'bot',
          props: { text: parsedData?.[2]?.message || 'Error' },
        });
        scroll();
        break;
      }
      case 'typing': {
        const userName = parsedData?.[2]?.userName || '';
        ctx.addTyping(userName);
        break;
      }
      case 'stopTyping': {
        const userName = parsedData?.[2]?.userName || '';
        if (!userName) ctx.removeAllTyping();
        else ctx.removeTyping(userName);
        break;
      }
      default: {
        console.log('Unknown command');
      }
    }
  }, []);

  const ws = useWebSockets({ url: 'ws://localhost/ws/api?token=123', onMessage });

  const inputParser = useCallback(async (message) => {
    messagesStore?.add({
      type: 'message',
      sender: 'user',
      props: { text: message },
    });
    ws.sendMessage(JSON.stringify([1, 'message', { message }]));
  }, [ws]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (value) inputParser(value);
    setValue('');
  };

  const onChange = (e) => {
    const { target: { value: inputValue } } = e;
    setValue(inputValue);
  };

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading,react/react-in-jsx-scope
    <Original
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      buttonTitle=">"
      onSubmit={onSubmit}
      onChange={onChange}
      value={value}
      inputParser={inputParser}
    />
  );
}
