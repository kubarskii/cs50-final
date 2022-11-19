import { UNIQUE_USER } from './constants';

/**
 * @param {Set} clients
 * */
export const findUsersInClients = (clients) => (ids) => Array.from(clients).find((client) => ids.includes(client[UNIQUE_USER].id));
