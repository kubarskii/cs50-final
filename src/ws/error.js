export default class MessageAbstractClassError extends Error {
  constructor(msg) {
    super(msg);
    this.message = `AbstractMessage method "${msg}" is not implemented`;
  }
}
