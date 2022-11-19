import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { roomApi } from '../services/room.service';
import { chatbotStatusSlice } from './slices/chatbot-status.slice';
import { roomSlice } from './slices/room.slice';
import { messagesSlice } from './slices/messages.slice';
import { chatbotElementsSlice } from './slices/chatbot-elements.slice';

export const store = configureStore(
  {
    reducer: {
      [roomApi.reducerPath]: roomApi.reducer,
      wsStatus: chatbotStatusSlice.reducer,
      rooms: roomSlice.reducer,
      messages: messagesSlice.reducer,
      elements: chatbotElementsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(roomApi.middleware),
  },
);

setupListeners(store.dispatch);
