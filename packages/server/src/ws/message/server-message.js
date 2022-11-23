import BaseMessage from './abstract-message';
import Room from '../../models/room';
import Message from '../../models/message';
import { MESSAGE_COMMANDS, MESSAGE_TYPES, UNIQUE_USER } from '../constants';
import db from '../../utils/db';

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
    this.notifyUsersBySockets = this.notifyUsersBySockets.bind(this);
    this.messages = this.messages.bind(this);
    this.rooms = this.rooms.bind(this);
    this.online = this.online.bind(this);
    this.typing = this.typing.bind(this);
    this.members = this.members.bind(this);
    this.processMessage = this.processMessage.bind(this);
  }

  get clients() {
    return this.server.clients;
  }

  /**
     * @private
     * */
  async processMessage() {
    const [_, messageType, payload] = this.value;
    const handler = this[messageType];
    if (!handler || typeof handler !== 'function') {
      this.ws.send(JSON.stringify([MESSAGE_TYPES.SERVER_ERROR, { message: `Handler: ${messageType} is not implemented` }]));
      return;
    }
    await handler(payload);
  }

  /**
     * @private
     * @param {string} userId
     * @param {string} roomId
     * */
  async checkUserInTheRoom(userId, roomId) {
    /** @type {{ id: string }[]} */
    const usersInTheRoom = await room.getUsersInRoom(roomId);
    const ids = usersInTheRoom.map((user) => user.id);
    return userId in ids;
  }

  /**
     * @private
     * */
  async getSocketsOfUsersInTheRoomOnline(roomId) {
    /** @type {{ id: string }[]} */
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
    const offline = ids.filter((id) => {
      const socketsArr = [...sockets];
      const socket = socketsArr.find((el) => el[UNIQUE_USER]?.id === id);
      return !socket;
    });
    return { sockets, offline };
  }

  /**
     * @private
     * @param {Set} sockets
     * @param {MessageType} type
     * @param {any} messagePayload
     * */
  async notifyUsersBySockets(sockets, type, messagePayload, commandType = MESSAGE_COMMANDS.MESSAGE) {
    Array.from(sockets).forEach((socket) => {
      socket.send(JSON.stringify([type, commandType, messagePayload]));
    });
  }

  async typing(payload) {
    const { roomId } = payload;
    const userId = this.ws[UNIQUE_USER].id;
    const { sockets } = await this.getSocketsOfUsersInTheRoomOnline(roomId);
    await this.notifyUsersBySockets(
      sockets,
      MESSAGE_TYPES.SERVER_MESSAGE,
      { userId },
      MESSAGE_COMMANDS.TYPING,
    );
  }

  async online(payload) {
    const { clients = [] } = this.server;
    const onlineUser = [...clients].find((el) => {
      const { id } = (el[UNIQUE_USER]);
      return id === payload.id;
    });
    this.ws.send(JSON.stringify(
      [
        MESSAGE_TYPES.SERVER_MESSAGE,
        MESSAGE_COMMANDS.IS_ONLINE,
        { isOnline: !!onlineUser },
      ],
    ));
  }

  async members(payload) {
    const { roomId } = payload;
    const members = await room.getUsersInRoom(roomId);
    this.ws.send(JSON.stringify([
      MESSAGE_TYPES.SERVER_MESSAGE,
      MESSAGE_COMMANDS.MEMBERS,
      { rows: members }]));
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
    const userId = this.ws[UNIQUE_USER]?.id;
    if (!userId) return;
    const isUserInTheRoom = await room.isUserInRoom(userId, roomId);
    if (!isUserInTheRoom) return;
    const { rows: createdMessages } = await messageModel.create(
      { user_id: userId, message: payloadMessage, room_id: roomId },
    );
    const { created_at: createdAt, id: createdMessageId } = createdMessages[0];
    const { id: senderId, name, surname } = this.ws[UNIQUE_USER];
    const messagePayload = {
      message: this.value[2].message,
      user_id: senderId,
      room_id: roomId,
      name,
      surname,
      created_at: createdAt,
    };

    const { sockets, offline } = await this.getSocketsOfUsersInTheRoomOnline(roomId);

    await this.notifyUsersBySockets(sockets, 1, messagePayload);
    // eslint-disable-next-line no-restricted-syntax
    for await (const userOfflineId of [...offline]) {
      await messageModel.saveUnReceivedMessage(userOfflineId, createdMessageId);
    }
  }

  async rooms() {
    const rows = await room.getUserRooms(this.ws[UNIQUE_USER]?.id);
    this.ws.send(JSON.stringify(
      [MESSAGE_TYPES.SERVER_MESSAGE, MESSAGE_COMMANDS.ROOMS, { rows }],
    ));
  }

  // async missed() {
  //   // const { rows } =
  // }

  async messages(payload) {
    const { roomId } = payload;
    const { rows } = await messageModel.getMessages(roomId);
    this.ws.send(JSON.stringify([
      MESSAGE_TYPES.SERVER_MESSAGE, MESSAGE_COMMANDS.MESSAGES, { rows },
    ]));
  }

  async command() {
  }

  /** @override */
  async send() {
    await this.processMessage();
  }
}
