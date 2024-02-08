import CoreDatamapper from './core.datamapper';

export default class MemoContent extends CoreDatamapper {
  async deleteByMemoId(memoId) {
    const sql = `DELETE FROM ${this.tablename} WHERE memo_id = $1`;
    const values = [memoId];
    return this.client.query(sql, values);
  }

  async getMemoContents(memoId) {
    const sql = `SELECT * FROM ${this.tablename} WHERE memo_id = $1`;
    const values = [memoId];
    const response = await this.client.query(sql, values);
    return response.rows;
  }
}
