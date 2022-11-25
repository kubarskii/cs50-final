import { createSlice } from '@reduxjs/toolkit';

export const chatbotStatusSlice = createSlice(
  {
    name: 'status',
    initialState: {
      wsState: 0,
    },
    reducers: {
      stateChange(state, action) {
        const { payload: wsState } = action;
        return { ...state, wsState };
      },
    },
  },
);

export const { actions: { stateChange } } = chatbotStatusSlice;
