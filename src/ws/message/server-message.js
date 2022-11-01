import BaseMessage from './abstract-message';

/**
 * @implements {IMessage}
 * */
export default class ServerMessage extends BaseMessage {
  /**
   * @param {MessageDTO} message
   * @param {WebSocket} ws
   * */
  constructor(message, ws) {
    super(message);
    this.ws = ws;
  }

  /** @override */
  async send() {
    /** @param {MessageDTO} */
    this.ws.send(JSON.stringify(this.message));
  }
}
