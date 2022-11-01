// eslint-disable-next-line max-classes-per-file
import MessageAbstractClassError from '../error';

/**
 * @interface IMessage
 */
export class AbstractMessage {
  /** @abstract */
  async send() {
    throw new MessageAbstractClassError('send');
  }
}

/** **************************************************
 * IGNORE warnings about method is not implemented!!!
 ***************************************************
 * Such approach is used to ignore property (like "message")
 * to be considered as unimplemented method
 * */
export default class BaseMessage extends AbstractMessage {
  constructor(message) {
    super();
    this.message = message;
  }
}
