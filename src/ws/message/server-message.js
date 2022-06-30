import AbstractMessage from './abstract-message';

/**
 * @implements {IMessage}
 * */
export default class ServerMessage extends AbstractMessage {
  /**
   * @param {MessageDTO} message
   * @param {WebSocket} ws
   * */
  constructor(message, ws) {
    super(message);
    this.ws = ws;
  }

  async send() {
    /** @param {MessageDTO} */
    this.ws.send(JSON.stringify(this.message));
  }
}
