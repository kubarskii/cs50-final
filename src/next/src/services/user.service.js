export const UserService = {
  /**
   * @param {string} data.login
   * @param {string} data.password
   * @param {string} data.name
   * @param {string} data.surname
   * @param {string} data.phone
   * */
  async createUser(data) {
    const response = await fetch('/rest/api/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
  async getUser({ login, password }) {
    const response = await fetch('/rest/api/user', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`,
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
  async getUserRooms(token) {
    const response = await fetch('/rest/api/user/rooms', {
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
