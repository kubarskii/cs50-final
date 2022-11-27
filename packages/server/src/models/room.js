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
    const sql = `
            SELECT u.name    as user_name,
                   u.id      as user_id,
                   u.surname as surname,
                   rooms.name,
                   rooms.id,
                   m.message as last_message
            FROM rooms
                     LEFT JOIN room_members rm on rooms.id = rm.room_id
                     LEFT JOIN users u on u.id = rm.user_id
                     LEFT JOIN (
                SELECT *
                FROM messages
                WHERE messages.id in
                      (SELECT max(id)
                       FROM messages
                       GROUP BY room_id)) m
                               on rooms.id = m.room_id
            WHERE rooms.id in (
                SELECT room_id
                FROM room_members
                WHERE user_id = $1
            )
            GROUP BY m.created_at, u.name, u.id, u.surname, rooms.name, rooms.id, m.message
            ORDER BY m.created_at DESC NULLS LAST
        `;

    const data = await this.db.query(sql, [userId]);
    const processedRows = [];

    data.rows.forEach((el) => {
      const lastProcessed = processedRows.length ? processedRows[processedRows.length - 1] : null;
      if (lastProcessed && lastProcessed.id === el.id) {
        processedRows[processedRows.length - 1].members = [
          ...lastProcessed.members,
          {
            user_name: el.user_name,
            user_id: el.user_id,
            user_surname: el.surname,
          }];
      } else {
        processedRows.push(
          {
            members: [
              {
                user_name: el.user_name,
                user_id: el.user_id,
                user_surname: el.surname,
              },
            ],
            id: el.id,
            last_message: el.last_message,
            name: el.name,
          },
        );
      }
    });

    const processedRowsValidRoomNames = processedRows.map((el) => {
      if (el.members.length === 2) {
        return {
          ...el,
          name: [el.members.find((user) => user.user_id !== userId)]
            .reduce((acc, curr) => `${acc}${curr.user_name} ${curr.user_surname}`, ''),
        };
      }
      return el;
    });

    if (processedRowsValidRoomNames.length) {
      return processedRowsValidRoomNames;
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
