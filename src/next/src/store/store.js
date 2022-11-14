import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { roomApi } from '../services/room.service';
import { chatbotStatusSlice } from './slices/chatbot-status.slice';

export const store = configureStore(
  {
    reducer: {
      [roomApi.reducerPath]: roomApi.reducer,
      wsStatus: chatbotStatusSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(roomApi.middleware),
  },
);

setupListeners(store.dispatch);
