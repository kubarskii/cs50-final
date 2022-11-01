import Base from './base';

export default class Message extends Base {
  /**
   * @rotected
   * */
  getTable() {
    return 'messages';
  }

  send(message, transport) {

  }
}
