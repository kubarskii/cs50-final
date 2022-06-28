import MessageAbstractClassError from '../error';
/**
 * @typedef Message
 * */
export default class Message {
  async send() {
    throw new MessageAbstractClassError('send');
  }
}
