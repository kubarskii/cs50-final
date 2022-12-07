import { createSlice } from '@reduxjs/toolkit';

export const foundUsersSlice = createSlice({
  name: 'foundUsers',
  initialState: {
    users: new Array(),
  },
  reducers: {
    setUsers(state, action) {
      const { foundUsers } = action.payload;
      state.users = foundUsers;
    },
    clearUsers(state) {
      state.users = [];
    },
  },
});

export const {
  actions: { setUsers, foundUsers, clearUsers },
} = foundUsersSlice;
