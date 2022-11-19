import { createSlice } from '@reduxjs/toolkit';

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    currentRoom: { name: '', id: '' },
    rooms: [],
    roomMembers: {},
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
    rooms(state, action) {
      const { payload: { rows } } = action;
      return { ...state, rooms: [...rows] };
    },
    setRoomMember(state, action) {
      const { payload } = action;
      const { user, userId } = payload;
      return {
        ...state,
        roomMembers: {
          ...state.roomMembers,
          [userId]: user,
        },
      };
    },
  },
});

export const {
  actions: {
    setRoomMember,
    rooms,
    current,
  },
} = roomSlice;

export const roomActions = { setRoomMember, rooms, current };
