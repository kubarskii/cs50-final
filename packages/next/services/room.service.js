import { API_BASE_URL } from '../constants';

export const RoomService = {
  async deleteRoom(token, roomId, url) {
    const response = await fetch(`${url || API_BASE_URL}/rest/api/room`, {
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

  async createRoom(token, config, url) {
    const response = await fetch(`${url || API_BASE_URL}/rest/api/room`, {
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
};
