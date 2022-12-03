export default class BaseMessage {
  constructor(message) {
    this.value = message;
  }

  async send() {
    return Promise.resolve(undefined);
  }
}
