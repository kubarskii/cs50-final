import MessageAbstractClassError from '../error';

/**
 * Abstract class that is used to create inheritors
 * @interface IMessage
 * */
export default class AbstractMessage {
  /** @param {any} message */
  constructor(message) {
    this.message = message;
  }

  async send() {
    throw new MessageAbstractClassError('send');
  }
}
