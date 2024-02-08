const CoreDatamapper = require('./core.datamapper');

module.exports = class CategoryDatamapper extends CoreDatamapper {
  async delete(id) {
    const sql = `DELETE FROM ${this.tablename} WHERE id = $1`;
    const values = [id];
    const response = await this.client.query(sql, values);
    return response.rows;
  }
};
