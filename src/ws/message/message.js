import MessageAbstractClassError from '../error';

export default class AbstractMessage {
  send() {
    throw new MessageAbstractClassError('send');
  }
}
