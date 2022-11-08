import Base from './base';

export default class Room extends Base {
  /**
     * @rotected
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
    const sql = `SELECT users.id, users.name, users.surname, login
                     FROM rooms AS rooms
                              INNER JOIN room_members AS members ON rooms.id = members.room_id
                              INNER JOIN users ON members.user_id = users.id
                     WHERE rooms.id = $1`;
    const { rows } = await this.db.query(sql, [roomId]);
    return (rows.length) ? rows : null;
  }

  async getUserRooms(userId) {
    const sql = `SELECT rooms.id, rooms.name
                     FROM rooms AS rooms
                              INNER JOIN room_members AS members ON rooms.id = members.room_id
                              INNER JOIN users ON members.user_id = users.id
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
