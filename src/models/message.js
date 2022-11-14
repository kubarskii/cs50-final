import Base from './base';

export default class Message extends Base {
  /**
   * @protected
   * */
  getTable() {
    return 'messages';
  }

  async getMessages(roomId, limit = 200, offset = 0) {
    const sql = 'SELECT * FROM messages WHERE room_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
    return this.db.query(sql, [roomId, limit, offset]);
  }
}
