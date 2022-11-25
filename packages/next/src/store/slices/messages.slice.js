import { createSlice } from '@reduxjs/toolkit';

/**
 * {
 *      type: 'message',
 *      sender: 'user', - sender `${name} ${surname}`,
 *      uniqueId: string,
 *      props: { text: 'message', date: Date | string, name, surname, userId, }
 * }
 * */

export const messagesSlice = createSlice(
  {
    name: 'messages',
    initialState: {
      isLoading: false,
      messages: [],
      error: null,
    },
    reducers: {
      /** CAUTION NO (s) */
      message(state, action) {
        const { payload } = action;
        if (payload.currentRoomId !== payload.room_id) return state;
        /**
                 * preprocess message before adding to state
                 * */
        return { ...state, messages: [...state.messages, payload] };
      },
      deleteMessage(state, action) {
        const { payload } = action;
        return { ...state, messages: [...state.messages, payload] };
      },
      messages(state, action) {
        const { payload: { rows } } = action;
        /**
                 * preprocess messages
                 * */
        return { ...state, messages: [...(rows.reverse())] };
      },
      setLoading(state, action) {
        const { payload } = action;
        return { ...state, isLoading: payload };
      },
    },
  },
);

export const {
  actions: {
    message,
    setLoading,
    messages,
    deleteMessage,
  },
} = messagesSlice;

export const messagesActions = {
  message,
  setLoading,
  messages,
  deleteMessage,
};
