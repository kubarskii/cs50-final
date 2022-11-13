import React, { useEffect } from 'react';
import '../styles/global.css';
import Head from 'next/head';
import { Provider } from 'react-redux';
import RouteGuard from '../guards/auth.guard';
import { ControlsProvider } from '../context/controls.context';
import { store } from '../store/store';

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
      <ControlsProvider>
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
      </ControlsProvider>
    </Provider>
  );
}
