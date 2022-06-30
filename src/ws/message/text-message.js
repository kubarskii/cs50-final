import AbstractMessage from './abstract-message';
import { MESSAGE_COMMANDS, MESSAGE_TYPES } from '../constants';
import '../typedef';

/**
 * @implements {IMessage}
 * */
export default class TextMessage extends AbstractMessage {
  /**
     * @param {string} message
     * @param {WebSocket} ws
     * */
  constructor(message, ws) {
    super(message);
    this.ws = ws;
  }

  async send() {
    /** @type MessageDTO */
    const msg = [
      MESSAGE_TYPES.SERVER_MESSAGE,
      MESSAGE_COMMANDS.SYS_MESSAGE,
      { message: this.message },
    ];
    this.ws.send(JSON.stringify(msg));
  }
}
