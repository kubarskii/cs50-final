import { createSlice } from '@reduxjs/toolkit';

export const chatbotStatusSlice = createSlice(
  {
    name: 'status',
    initialState: {
      wsState: 0,
    },
    reducers: {
      stateChange(state, action) {
        const { type, payload } = action;
        return {
          ...state,
          wsState: payload,
        };
      },
    },
  },
);

export const { actions: { stateChange } } = chatbotStatusSlice;
