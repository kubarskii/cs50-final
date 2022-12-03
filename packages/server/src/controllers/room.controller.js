import URL from 'url';
import Room from '../models/room';
import User from '../models/user';
import { DEFAULT_HEADERS } from '../../constants';
import { getBody } from '../utils/getBody';
import { validateSchema } from '../utils/schema-validator';
import db from '../utils/db';
import authHeaderParser from '../utils/auth-header-parser';

export const room = new Room(db);
export const user = new User(db);

const addUserToRoomSchema = {
  type: 'object',
  properties: {
    roomId: { type: 'string' },
    userId: { type: 'string' },
    toAdd: { type: 'string' },
  },
};

export function checkHeader(req, res, authHeader) {
  if (!authHeader) {
    res.writeHead(403, 'Unauthorized', DEFAULT_HEADERS);
    res.end();
    return;
  }
  const { type } = authHeaderParser(authHeader);
  if (type.toLowerCase() !== 'bearer') {
    res.writeHead(400, 'Invalid token', DEFAULT_HEADERS);
    res.end();
  }
}

export const RoomController = {
  async getRooms(req, res) {
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const { payload: { id } } = authHeaderParser(authHeader);
    if (id) {
      try {
        const data = await room.getUserRooms(id);
        res.writeHead(200, '', DEFAULT_HEADERS);
        res.write(JSON.stringify({ rooms: data }));
        res.end();
      } catch (e) {
        res.writeHead(500, 'Unknown error', DEFAULT_HEADERS);
        res.end();
      }
    }
  },
  async addUserToRoom(req, res) {
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const body = await getBody(req);
    const [isValid, error] = validateSchema(addUserToRoomSchema)(body);
    if (!isValid) {
      res.writeHead(400, 'Invalid body', DEFAULT_HEADERS);
      res.write(JSON.stringify({ error }));
      res.end();
    }
    const { userId, toAdd, roomId } = body;
    const user1 = await user.read(userId);
    const user2 = await user.read(toAdd);
    if (user1.rows.length && user2.rows.length) {
      await room.addUserToRoom(userId, roomId);
      await room.addUserToRoom(toAdd, roomId);
      res.writeHead(201, 'Created', DEFAULT_HEADERS);
      res.end();
    } else {
      res.writeHead(500, DEFAULT_HEADERS);
      res.end();
    }
  },
  async getMessagesInRoom(req, res) {
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const { query } = URL.parse(req.url, true);
    const { roomId } = query;
    if (!roomId) {
      res.writeHead(400, 'Invalid query parameters', DEFAULT_HEADERS);
      res.write(JSON.stringify({ error: 'roomId is not provided' }));
      res.end();
      return;
    }
    const data = await room.getMessagesInRoom(roomId);
    res.writeHead(200, '', DEFAULT_HEADERS);
    res.write(JSON.stringify({ messages: data || [] }));
    res.end();
  }, // token, roomId
  async deleteRoom(req, res) {
    const body = await getBody(req);
    res.writeHead(500, 'Not implemented', DEFAULT_HEADERS);
    res.write(JSON.stringify(body));
    res.end();
  }, // token, roomId
  async createRoom(req, res) {
    const body = await getBody(req).catch() || {};
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const { type, payload: { id: creatorId } } = authHeaderParser(authHeader);
    if (type.toLowerCase() !== 'bearer') {
      res.writeHead(400, 'Invalid authorization header', DEFAULT_HEADERS);
      res.end();
      return;
    }
    /**
         * userIds - array of user ids that should be added to room
         * */
    const { userIds, name: roomName = 'DEFAULT_ROOM' } = body;
    if (!userIds) {
      return res.error(400, {}, DEFAULT_HEADERS);
    }
    const { rows: createdRoomRows } = await room.createRoom(creatorId, roomName);
    const { id: roomId } = createdRoomRows[0];
    const errorsStack = [];
    const addedUsers = [];
    /**
         * for each existing user, add
         * */
    // eslint-disable-next-line no-restricted-syntax
    for await (const userToAddId of [creatorId, ...userIds]) {
      const { rows } = await user.getById(userToAddId);
      if (!rows.length) {
        errorsStack.push({ error: 'Unknown userId', userId: userToAddId });
        // eslint-disable-next-line no-continue
        continue;
      }
      await room.addUserToRoom(userToAddId, roomId)
        .then(() => {
          addedUsers.push(userToAddId);
        })
        .catch((e) => errorsStack.push({ error: e.message, userId: userToAddId }));
    }
    return res.json(201, { errors: errorsStack, success: addedUsers }, DEFAULT_HEADERS);
  },
  async getUsersInRoom(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.writeHead(403, 'Forbidden', DEFAULT_HEADERS);
      res.end();
      return;
    }
    checkHeader(req, res, authHeader);
    const { type, payload: { id: userId = '' } } = authHeaderParser(authHeader);
    if (type.toLowerCase() !== 'bearer') {
      res.writeHead(400, 'Invalid authorization header', DEFAULT_HEADERS);
      res.end();
      return;
    }
    const { url } = req;
    const { query } = URL.parse(url, true);
    const { roomId: roomIdRaw } = query;
    const roomId = parseInt(roomIdRaw, 10);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(roomId)) {
      res.writeHead(400, 'Invalid query parameters', DEFAULT_HEADERS);
      res.end();
      return;
    }
    if (!await user.IsUserInTheRoom(userId)) {
      res.writeHead(403, 'Forbidden', DEFAULT_HEADERS);
      res.end();
      return;
    }
    const usersInTheRoom = await room.getUsersInRoom(roomId);
    res.writeHead(200, 'Success', DEFAULT_HEADERS);
    res.write(JSON.stringify({ members: usersInTheRoom }));
    res.end();
  },
};
