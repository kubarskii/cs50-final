import React from 'react';
import '../styles/global.css';
import RouteGuard from '../guards/auth.guard';
import { ControlsProvider } from '../context/controls.context';

export default function App({ Component, pageProps }) {
  return (
    <ControlsProvider>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </ControlsProvider>
  );
}
