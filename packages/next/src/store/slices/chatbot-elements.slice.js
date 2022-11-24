import { createSlice } from '@reduxjs/toolkit';

export const chatbotElementsSlice = createSlice({
  name: 'elements',
  initialState: {
    isInputDisabled: false,
    isInputShown: true,
    typing: [],
  },
  reducers: {
    addTyping(state, action) {
      const { payload } = action;
      return {
        ...state,
        typing: [...new Set([...state.typing, payload])],
      };
    },
    removeTyping(state, action) {
      const { payload } = action;
      const index = state.typing.findIndex((el) => el === payload);
      return {
        ...state,
        typing: [...state.messages.slice(0, index), ...state.slice(index + 1)],
      };
    },
    enableInput(state) {
      return {
        ...state,
        isInputDisabled: false,
      };
    },
    disableInput(state) {
      return {
        ...state,
        isInputDisabled: true,
      };
    },
    showInput(state) {
      return {
        ...state,
        isInputShown: true,
      };
    },
    hideInput(state) {
      return {
        ...state,
        isInputShown: false,
      };
    },
  },
});

export const {
  actions: {
    hideInput,
    showInput,
    disableInput,
    enableInput,
    removeTyping,
    addTyping,
  },
} = chatbotElementsSlice;
