import { MESSAGE_COMMANDS, MESSAGE_TYPES } from '../constants';
import '../../typedef';
import BaseMessage from './abstract-message';

/**
 * Basic class for Server Errors occurred on the server check that were not expected
 * */
export default class ServerErrorMessage extends BaseMessage {
  /**
     * @param {string} message
     * @param {WebSocket} ws
     * */
  constructor(message, ws) {
    super(message);
    this.ws = ws;
  }

  /** @override */
  async send() {
    /** @type MessageDTO */
    const msg = [
      MESSAGE_TYPES.SERVER_ERROR,
      MESSAGE_COMMANDS.SYS_MESSAGE,
      { value: this.value },
    ];
    this.ws.send(JSON.stringify(msg));
  }
}
