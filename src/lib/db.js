import pg from 'pg';
import { config } from '../../db/config';

const pool = new pg.Pool(config);

/**
 * @typedef {object} DBTable
 * @property {(sql: string, args: string[]) => any} query method to crete db queries
 * @property {(id: string, fields: string[]) => any} read login data from table
 * @property {(record: Record<string, string>) => any} create write data to table
 * @property {(id: string, fields: Record<string, string>) => any} update update data in table
 * @property {(id: string) => any} delete delete data from table
 * */

/**
 * @param {string} table table name to make requests to
 * @return DBTable
 * */
const db = (table) => ({

  /**
     * Create any request to DB
     * @param {string} sql
     * @param {string[]} [args]
     * */
  async query(sql, args) {
    return pool.query(sql, args);
  },

  async read(id, fields = ['*']) {
    const names = fields.join(', ');
    const sql = `SELECT ${names}
                     FROM ${table}`;
    if (!id) return pool.query(sql);
    return pool.query(`${sql} WHERE id = $1`, [id]);
  },

  async create({ ...record }) {
    const keys = Object.keys(record);
    const nums = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }
    const fields = `"${keys.join('", "')}"`;
    const params = nums.join(', ');
    const sql = `INSERT INTO "${table}" (${fields})
                     VALUES (${params}) RETURNING *`;
    return pool.query(sql, data);
  },

  async update(id, { ...record }) {
    const keys = Object.keys(record);
    const updates = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      updates[i] = `${key} = $${++i}`;
    }
    const delta = updates.join(', ');
    const sql = `UPDATE ${table}
                     SET ${delta}
                     WHERE id = $${++i}`;
    data.push(id);
    return pool.query(sql, data);
  },

  async delete(id) {
    const sql = `DELETE
                     FROM ${table}
                     WHERE id = $1`;
    return pool.query(sql, [id]);
  },
});

export default db;
