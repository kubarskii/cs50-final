export const RoomService = {
  async getMessagesInRoom(token, roomId) {
    const response = await fetch(`/rest/api/messages?roomId=${roomId}`, {
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
    const response = await fetch('/rest/api/room', {
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
    const response = await fetch('/rest/api/room', {
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
