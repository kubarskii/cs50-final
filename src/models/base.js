/**
 * @typedef {import('../lib/db.js').DBTable} DBTable
 */

export default class Base {
  /**
     * @protected
     * */
  $table = undefined;

  /**
     * @type DBTable
     * */
  db;

  /**
     * @protected
     * @abstract
     * */
  getTable() {
    throw new Error('getTable is not implemented');
  }

  /**
     * @param {(p: string) => DBTable} db
     * */
  constructor(db) {
    this.$table = this.getTable();
    this.db = db(this.$table);
  }

  async create(record) {
    this.db.create(record);
  }

  async read(id, record) {
    return this.db.read(id, record);
  }

  async update(id, record) {
    return this.db.update(id, record);
  }

  async delete(id) {
    return this.db.delete(id);
  }
}
