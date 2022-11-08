import URL from 'url';
import authHeaderParser from '../../next/src/utils/auth-header-parser';
import Room from '../../models/room';
import db from '../../lib/db';
import { DEFAULT_HEADERS } from '../../constants';
import parseQuery from '../../utils/queryParser';
import { getBody } from '../../utils/getBody';
import { validateSchema } from '../../lib/schema-validator';
import { user } from './user.controller';

export const room = new Room(db);

const addUserToRoomSchema = {
  type: 'object',
  properties: {
    roomId: { type: 'string' },
    userId: { type: 'string' },
    toAdd: { type: 'string' },
  },
};

function checkHeader(req, res, authHeader) {
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
    } else {

    }
  }, // token, roomId
  async getMessagesInRoom(req, res) {
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const { query } = URL.parse(req.url);
    const { roomId } = parseQuery(query);
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
  }, // token, roomId
  async createRoom(req, res) {
  }, // token, roomName
};
