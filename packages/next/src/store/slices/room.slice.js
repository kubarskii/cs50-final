import { createSlice } from '@reduxjs/toolkit';

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    currentRoom: { name: '', id: '' },
    rooms: [],
    roomMembers: [],
  },
  reducers: {
    current(state, action) {
      const { payload: currentRoom } = action;
      return {
        ...state,
        currentRoom: {
          ...state.constructor,
          ...currentRoom,
        },
      };
    },
    members(state, action) {
      const { payload: { rows = [] } } = action;
      return {
        ...state,
        roomMembers: [
          ...(rows || []),
        ],
      };
    },
    rooms(state, action) {
      const { payload: { rows = [] } } = action;
      return { ...state, rooms: [...(rows || [])] };
    },
    roomMember(state, action) {
      const { payload } = action;
      const { user, userId } = payload;
      return {
        ...state,
        roomMembers: [
          ...state.roomMembers,
          { user, userId },
        ],
      };
    },
  },
});

export const {
  actions: {
    roomMember,
    rooms,
    current,
    members,
  },
} = roomSlice;

export const roomActions = {
  roomMember, rooms, current, members,
};
