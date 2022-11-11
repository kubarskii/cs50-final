import Base from './base';

export default class User extends Base {
  /**
    * @protected
    * */
  getTable() {
    return 'users';
  }

  async getAll() {
    const sql = `SELECT * FROM ${this.getTable()}`;
    const rows = await this.db.query(sql);
    return rows || [];
  }

  /**
   * FTC === Full Text Search
   * */
  async findUserFTC(requestString) {
    const param = `${requestString.split(' ').map((e) => `${e}:*`).join(' | ')}`;
    /**
    * Bad query, need to generate indexes, check LIKE as an alternative
    * */
    const sql = `
      SELECT name, id, surname, login FROM users
      WHERE to_tsvector(login)
              || to_tsvector(email)
              || to_tsvector('russian', name)
              || to_tsvector('russian', surname)
              || to_tsvector(name)
              || to_tsvector(surname) @@ to_tsquery($1)
    `;
    const { rows } = await this.db.query(sql, [param]);
    return rows;
  }

  async getById(id, record) {
    return super.read(id, record);
  }

  async getByLogin(login) {
    const sql = `SELECT * FROM ${this.getTable()} WHERE login=$1`;
    const { rows } = await this.db.query(sql, [login]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  }

  async getByEmail(email) {
    const sql = `SELECT * FROM ${this.getTable()} WHERE email=$1`;
    const { rows } = await this.db.query(sql, [email]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  }

  async login(username, password) {
    const sql = `SELECT id, name, surname, login FROM ${this.getTable()} WHERE login=$1 AND password=$2`;
    const { rows } = await this.db.query(sql, [username, password]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  }
}
