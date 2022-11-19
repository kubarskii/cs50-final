import React, {
  useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import styles from './input-wrapper.module.css';
import { WebsocketContext } from '../../context/websocket.context';

export default function InputWrapper(props) {
  const {
    Original,
    scroll,
  } = props;

  const [value, setValue] = useState('');
  const [shown, setShown] = useState(true);
  const audioPlayerRef = useRef(null);

  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);

  const { sendMessage } = useContext(WebsocketContext);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    const context = audioContextRef.current;

    const unlock = () => {
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      if (source.start) {
        source.start(0);
      } else {
        source.noteOn(0);
      }
      document.removeEventListener('pointerdown', unlock);
    };

    document.addEventListener('pointerdown', unlock);
    document.body.click();

    const gainNode = context.createGain();
    gainNode.gain.value = 1; // set volume to 100%

    fetch('/music/notification-sound.mp3')
      .then((response) => response.arrayBuffer())
      .then((data) => audioContextRef.current.decodeAudioData(
        data,
        (responseBuffer) => {
          audioBufferRef.current = responseBuffer;
        },
        (error) => console.log(error),
      ));
  }, []);

  const play = useCallback((context, audioBuffer) => {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (value) sendMessage(JSON.stringify([1, 'message', { message: value, roomId: '18' }]));
    setValue('');
  };

  const onChange = (e) => {
    const {
      target: { value: inputValue },
    } = e;
    setValue(inputValue);
  };

  const image = useMemo(
    () => (
      <svg
        className={styles.paperPlane}
        viewBox="0 0 440.144 400.979"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="matrix(1, 0, 0, 1, 2, 0)">
          <g transform="rotate(45 131.203 200.101)">
            <path
              d="m348.20205,-16.85998a24,24 0 0 0 -25.5,-5.46l-400.03,151.41l-0.08,0a24,24 0 0 0 1,45.16l0.41,0.13l137.3,58.63a16,16 0 0 0 15.54,-3.59l220.36,-205.33a7.07,7.07 0 0 1 10,10l-205.34,220.26a16,16 0 0 0 -3.59,15.54l58.65,137.38c0.06,0.2 0.12,0.38 0.19,0.57c3.2,9.27 11.3,15.81 21.09,16.25l1,0a24.63,24.63 0 0 0 23,-15.46l151.39,-399.92a24,24 0 0 0 -5.39,-25.57z"
            />
          </g>
        </g>
      </svg>
    ),
    [],
  );

  return (
    <div>
      {shown && (
      <Original
        {...props}
        buttonTitle={image}
        onSubmit={onSubmit}
        onChange={onChange}
        value={value}
      />
      )}
    </div>
  );
}
