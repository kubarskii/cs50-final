import BaseMessage from './abstract-message';
import ServerErrorMessage from './server-error-message';
import Room from '../../models/room';
import db from '../../lib/db';
import Message from '../../models/message';
import { UNIQUE_USER } from '../constants';

const room = new Room(db);
const messageModel = new Message(db);

export default class ServerMessage extends BaseMessage {
  /**
     * @param {MessageDTO} message
     * @param {WebSocket} ws
     * @param {Server} wss
     * */
  constructor(message, ws, wss) {
    super(message);
    this.ws = ws;
    this.server = wss;
    this.message = this.message.bind(this);
    this.notifyUsers = this.notifyUsers.bind(this);
  }

  get clients() {
    return this.server.clients;
  }

  async processMessage() {
    const [_, messageType, payload] = this.value;
    const handler = this[messageType];
    if (!handler || typeof handler !== 'function') {
      this.ws.send(new ServerErrorMessage('Server error can be generated only by server', this.ws));
    }
    await handler(payload);
  }

  /**
   * @private
   * */
  async saveMessage() {

  }

  /**
   * @private
   * */
  async checkUserInTheRoom() {

  }

  /**
   * @private
   * @param {MessageType} type
   * @param {string} roomId
   * */
  async notifyUsers(type, roomId, createdAt) {
    /**
     * 1. Getting all users in the room
     * 2. Getting websockets of users
     * 3. Sending messages to all of them
     * */
    const usersInTheRoom = await room.getUsersInRoom(roomId);
    const ids = usersInTheRoom.map((user) => user.id);
    const sockets = new Set();
    const { clients = [] } = this.server;
    clients.forEach((el) => {
      const userDetails = (el[UNIQUE_USER]);
      if (ids.includes(userDetails.id)) {
        sockets.add(el);
      }
    });
    const { id: senderId, name, surname } = this.ws[UNIQUE_USER];
    Array.from(sockets).forEach((socket) => {
      socket.send(JSON.stringify([type, 'message', {
        message: this.value[2].message,
        senderId,
        roomId,
        name,
        surname,
        createdAt,
      }]));
    });
  }

  async typing() {

  }

  async message(payload) {
    /**
         * 1. check room exists
         * 2. check user in the room
         * 3. save message to db
         * 4. notify all users in the room
         * */
    const { roomId, message: payloadMessage } = payload;
    const { rows } = await room.read(roomId);
    if (!rows.length) return;
    const userId = this.ws[UNIQUE_USER].id;
    if (!userId) return;
    const isUserInTheRoom = await room.isUserInRoom(userId, roomId);
    if (!isUserInTheRoom) return;
    const { rows: createdMessages } = await messageModel.create(
      { user_id: userId, message: payloadMessage, room_id: roomId },
    );
    const { created_at: createdAt } = createdMessages[0];
    await this.notifyUsers(1, roomId, createdAt);
  }

  async stopTyping() {
  }

  async command() {
  }

  /** @override */
  async send() {
    await this.processMessage();
  }
}
