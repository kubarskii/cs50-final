import Base from './base';

export default class Notification extends Base {
  /**
     * @protected
     * */
  getTable() {
    return 'notifications';
  }

  async getCredentialsByUserId(userId) {
    const sql = `
            SELECT *
            FROM notifications
            WHERE user_id = $1
        `;
    const { rows } = await this.db.query(sql, [userId]);

    return rows.map((row) => ({
      endpoint: row.endpoint,
      expirationTime: row.expiration_time,
      keys: {
        p256dh: row.p256dh,
        auth: row.auth,
      },
    }));
  }

  async isSubscriptionExists(userId, endpoint) {
    const sql = `
            SELECT *
            FROM notifications
            WHERE user_id = $1
              AND endpoint = $2
        `;
    const { rows } = await this.db.query(sql, [userId, endpoint]);
    return !!rows.length;
  }
}
