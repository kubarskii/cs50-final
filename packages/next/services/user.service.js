import { API_BASE_URL } from '../constants';

export const UserService = {
  /**
     * @param {string} data.login
     * @param {string} data.password
     * @param {string} data.name
     * @param {string} data.surname
     * @param {string} data.phone
     * */
  async createUser(data, url) {
    const response = await fetch(`${url || API_BASE_URL}/rest/api/user`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
  async getUser({ login, password }, url) {
    const response = await fetch(`${url || API_BASE_URL}/rest/api/user`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`,
      },
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  },
  async findUser(token, str, url) {
    const response = await fetch(`${url || API_BASE_URL}/rest/api/user/search?q=${str}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      return [];
    }
    throw new Error(response.statusText);
  },
};
