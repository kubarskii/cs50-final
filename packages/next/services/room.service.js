import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { getCookie } from '../hooks/useCookie';
import { API_BASE_URL } from '../constants';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: fetchBaseQuery(
    {
      baseUrl: `${API_BASE_URL}/rest/api`,
      prepareHeaders: (headers) => {
        const token = getCookie('accessToken');
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
      },
    },
  ),
  endpoints(builder) {
    return {
      getMessagesInRoom: builder.query({
        query: (roomId) => `/messages?roomId=${roomId}`,
      }),
      getUsersRooms: builder.query({
        query: () => '/user/rooms',
      }),
      getUsersInTheRoom: builder.query({
        query: (roomId) => `/room/users?roomId=${roomId}`,
      }),
    };
  },
});

export const {
  useGetMessagesInRoomQuery,
  useGetUsersInTheRoomQuery,
  useGetUsersRoomsQuery,
} = roomApi;

export const RoomService = {
  async getMessagesInRoom(token, roomId, signal) {
    const response = await fetch(`${API_BASE_URL}/rest/api/messages?roomId=${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
  async getUsersRooms(token) {
    const response = await fetch(`${API_BASE_URL}/rest/api/user/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },

  async deleteRoom(token, roomId) {
    const response = await fetch(`${API_BASE_URL}/rest/api/room`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
      body: JSON.stringify({ roomId }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },

  async createRoom(token, config) {
    const response = await fetch(`${API_BASE_URL}/rest/api/room`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify(config),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },

  async getUsersInTheRoom(token, roomId) {
    const response = await fetch(`${API_BASE_URL}/rest/api/room/users?roomId=${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
};
