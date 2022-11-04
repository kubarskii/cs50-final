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
    this.ws.send(JSON.stringify([1, 'typing', { userName: 'Nataliia' }]));
    setTimeout(() => {
      this.ws.send(JSON.stringify([1, 'typing', { userName: 'Larisa' }]));
    }, 2000);
    setTimeout(() => {
      this.ws.send(JSON.stringify([1, 'message', { message: 'This message sent from Nataliia', sender: 'Nataliia' }]));
      this.ws.send(JSON.stringify([1, 'stopTyping', { userName: 'Nataliia' }]));
    }, 4000);
    setTimeout(() => {
      this.ws.send(JSON.stringify([1, 'message', { message: 'This message sent from Larisa', sender: 'Larisa' }]));
      this.ws.send(JSON.stringify([1, 'stopTyping', { userName: 'Larisa' }]));
    }, 5000);
  }
}
