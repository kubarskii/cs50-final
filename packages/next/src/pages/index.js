import React, { useCallback, useEffect, useRef } from 'react';
import { JWT } from '@me/server/src/utils/jwt';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getCookie } from '../hooks/useCookie';
import { pendingRequests, WebsocketsProvider } from '../context/websocket.context';
import { messagesActions } from '../store/slices/messages.slice';
import { current, roomActions } from '../store/slices/room.slice';
import { store } from '../store/store';
import { PORT } from '../../constants';
import ChatbotContainer from '../components/chatbot-container/chatbot-container';

const onMessage = (play) => ({ data }) => {
  const parsedData = JSON.parse(data);
  if (parsedData[0] !== 1 && parsedData[0] !== 2) return;
  const handlerName = parsedData[1];
  pendingRequests.next({
    ...pendingRequests.value,
    [handlerName]: null,
  });
  const action = messagesActions[handlerName] || roomActions[handlerName];
  if (typeof action !== 'function') return;
  const payload = parsedData[2];
  if (handlerName === 'message') {
    const globalState = store.getState();
    const { id: currentRoomId } = globalState.rooms.currentRoom;
    store.dispatch(action({ ...payload, currentRoomId }));
    const token = getCookie('accessToken');
    const decoded = JWT.decoderJWT(token);
    const { id } = decoded;
    const { user_id: senderId } = payload;
    if (id !== senderId && typeof play === 'function') play();
    return;
  }
  store.dispatch(action(payload));
};

export async function getServerSideProps(context) {
  const { headers: host } = context.req;
  return { props: { host: host.host } };
}

const publicVapidKey = 'BDaUFua706VttVFcxXxrBne9IxhsxcJBiPFjFOlurdPgr3JCFlK56lDL4lCrxYvkTm55UYtpwgF-UTBvyzgT7YM';

async function run(token, hostname, port) {
  const registration = await navigator.serviceWorker
    .register('/worker.js', { scope: '/' });

  const subscription = await registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });

  await fetch(`http://${hostname}:${port}/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

function HomePage(props) {
  const { host } = props;
  const [hostname, port = 80] = host.split(':');
  const token = getCookie('accessToken');
  const dispatch = useDispatch();
  const router = useRouter();
  const { roomId } = router.query;
  const room = useSelector((state) => state.rooms.rooms.find((el) => el.id === roomId));

  const setInitialRef = useRef(false);

  useEffect(() => {
    if (roomId && room && !setInitialRef.current) {
      setInitialRef.current = true;
      dispatch(current(room));
    }
  }, [roomId, room]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      run(token, hostname, 3006)
        .then(() => {
          console.log('Service working is running correctly');
        })
        .catch(console.error);
    }
  }, [token]);

  if (!token) {
    return null;
  }
  const audioPlayerRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);

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

  const play = useCallback(() => {
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start();
  }, []);

  return (
    <WebsocketsProvider port={PORT} hostname={hostname} onMessage={onMessage(play)}>
      <ChatbotContainer />
      <audio ref={audioPlayerRef} />
    </WebsocketsProvider>
  );
}

export default HomePage;
