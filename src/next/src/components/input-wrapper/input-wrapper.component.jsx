import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import styles from './input-wrapper.module.css';
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

  const image = useMemo(() => (
    <svg className={styles.paperPlane} viewBox="0 0 440.144 400.979" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1, 0, 0, 1, 2, 0)">
        <g transform="rotate(45 131.203 200.101)">
          <path d="m348.20205,-16.85998a24,24 0 0 0 -25.5,-5.46l-400.03,151.41l-0.08,0a24,24 0 0 0 1,45.16l0.41,0.13l137.3,58.63a16,16 0 0 0 15.54,-3.59l220.36,-205.33a7.07,7.07 0 0 1 10,10l-205.34,220.26a16,16 0 0 0 -3.59,15.54l58.65,137.38c0.06,0.2 0.12,0.38 0.19,0.57c3.2,9.27 11.3,15.81 21.09,16.25l1,0a24.63,24.63 0 0 0 23,-15.46l151.39,-399.92a24,24 0 0 0 -5.39,-25.57z" />
        </g>
      </g>
    </svg>
  ), []);

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading,react/react-in-jsx-scope
    <Original
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      buttonTitle={image}
      onSubmit={onSubmit}
      onChange={onChange}
      value={value}
      inputParser={inputParser}
    />
  );
}
