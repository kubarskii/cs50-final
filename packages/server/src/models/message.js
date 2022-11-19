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

  async saveUnReceivedMessage(userId, messageId) {
    const sql = 'INSERT INTO not_received_messages (user_id, message_id) VALUES ($1, $2) RETURNING *';
    return this.db.query(sql, [userId, messageId]);
  }

  async getUnreceivedMessages(userId, roomId) {
    const sql = `
            SELECT 
                   messages.message as message,
                   messages.created_at as created_at,
                   messages.user_id as user_id,
                   messages.room_id as room_id
            FROM not_received_messages
                     LEFT JOIN messages on messages.id = not_received_messages.message_id
            WHERE messages.user_id = $1
              AND messages.room_id = $2
        `;
    return this.db.query(sql, [userId, roomId]);
  }
}
