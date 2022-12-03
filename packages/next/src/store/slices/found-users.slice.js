import { createSlice } from '@reduxjs/toolkit';

export const foundUsersSlice = createSlice({
  name: 'foundUsers',
  initialState: {
    users: [],
  },
  reducers: {
    setUsers(state, action) {
      const { foundUsers } = action.payload;
      state.users = foundUsers;
    },
  },
});

export const {
  actions: { setUsers, foundUsers },
} = foundUsersSlice;
