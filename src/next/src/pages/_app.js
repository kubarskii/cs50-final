import React, { useEffect } from 'react';
import '../styles/global.css';
import Head from 'next/head';
import { Provider } from 'react-redux';
import RouteGuard from '../guards/auth.guard';
import { store } from '../store/store';
import { WebsocketsProvider } from '../context/websocket.context';
import { HOST, PORT } from '../../constants';
import { messagesActions } from '../store/slices/messages.slice';
import { roomActions } from '../store/slices/room.slice';

const onMessage = ({ data }) => {
  const parsedData = JSON.parse(data);
  if (parsedData[0] !== 1 && parsedData[0] !== 2) return;
  const handlerName = parsedData[1];
  const action = messagesActions[handlerName] || roomActions[handlerName];
  if (typeof action !== 'function') return;
  const payload = parsedData[2];
  console.log(payload);
  store.dispatch(action(payload));
};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const setVh = () => {
      setTimeout(() => {
        const vh = window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${vh}px`);
      });
    };

    window.addEventListener('load', setVh);
    window.addEventListener('resize', setVh);
    setVh();
  }, []);

  return (
    <Provider store={store}>
      <WebsocketsProvider port={PORT} hostname={HOST} onMessage={onMessage}>
        <RouteGuard>
          <>
            <Head>
              <title>Message me!</title>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </>
        </RouteGuard>
      </WebsocketsProvider>
    </Provider>
  );
}
