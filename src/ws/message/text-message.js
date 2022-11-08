import { MESSAGE_COMMANDS, MESSAGE_TYPES } from '../constants';
import '../../typedef';
import BaseMessage from './abstract-message';

export default class TextMessage extends BaseMessage {
  /**
     * @param {string} message
     * @param {WebSocket} ws
     * */
  constructor(message, ws) {
    super(message);
    this.ws = ws;
  }

  /** @override  */
  async send() {
    /** @type MessageDTO */
    const msg = [
      MESSAGE_TYPES.SERVER_MESSAGE,
      MESSAGE_COMMANDS.SYS_MESSAGE,
      { value: this.value },
    ];
    this.ws.send(JSON.stringify(msg));
  }
}
