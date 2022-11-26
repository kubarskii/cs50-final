import Base from './base';

export default class Room extends Base {
  /**
     * @protected
     * */
  getTable() {
    return 'rooms';
  }

  async isUserInRoom(userId, roomId) {
    const sql = 'SELECT user_id FROM room_members WHERE user_id = $1 AND room_id = $2';
    const { rows } = await this.db.query(sql, [userId, roomId]);
    return !!rows.length;
  }

  async addUserToRoom(userId, roomId) {
    const sql = 'INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)';
    return this.db.query(sql, [roomId, userId]);
  }

  async getUsersInRoom(roomId) {
    const sql = `SELECT users.id, users.name, users.surname, login, rooms.name as room_name
                     FROM rooms AS rooms
                              INNER JOIN room_members AS members ON rooms.id = members.room_id
                              INNER JOIN users ON members.user_id = users.id
                     WHERE rooms.id = $1`;
    const { rows } = await this.db.query(sql, [roomId]);
    return (rows.length) ? rows : [];
  }

  async createRoom(creatorId, name) {
    const sql = 'INSERT INTO rooms (name, creator_id) VALUES ($1, $2) RETURNING *';
    const data = await this.db.query(sql, [name, creatorId]);
    return data;
  }

  async getUserRooms(userId) {
    const sql = `SELECT rooms.id, rooms.name, m.message as last_message
                 FROM rooms AS rooms
                        INNER JOIN room_members AS members ON rooms.id = members.room_id
                        INNER JOIN users ON members.user_id = users.id
                        LEFT JOIN (
                   SELECT *
                   FROM messages
                   WHERE messages.id in
                         (SELECT max(id)
                          FROM messages
                          GROUP BY room_id)
                 ) as m on rooms.id = m.room_id
                 WHERE users.id = $1`;
    const { rows } = await this.db.query(sql, [userId]);
    if (rows.length) {
      return rows;
    }
    return null;
  }

  async getMessagesInRoom(roomId) {
    const sql = 'SELECT * FROM messages WHERE room_id=$1';
    const { rows } = await this.db.query(sql, [roomId]);
    if (rows.length) {
      return rows;
    }
    return null;
  }
}
