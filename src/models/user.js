import Base from './base';

export default class User extends Base {
  /**
    * @protected
    * */
  getTable() {
    return 'users';
  }

  async read(login, password) {
    const sql = 'SELECT * FROM users WHERE login=$1 AND password=$2';
    const { rows } = await this.db.query(sql, [login, password]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  }
}
