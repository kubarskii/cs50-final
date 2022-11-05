import Base from './base';

export default class Message extends Base {
  /**
   * @protected
   * */
  getTable() {
    return 'messages';
  }

  send(message, transport) {

  }
}
