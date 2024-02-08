import CoreDatamapper from './core.datamapper';

export default class MemoDatamapper extends CoreDatamapper {
  async getOne(memoId) {
    const sql = 'SELECT * FROM getMemo($1) ';
    const values = [memoId];
    const response = await this.client.query(sql, values);
    return response.rows;
  }

  async getMemoBySlug(slug) {
    const sql = 'SELECT * FROM getMemoBySlug($1) ';
    const values = [slug];
    const response = await this.client.query(sql, values);
    return response.rows;
  }

  async getAllMemo() {
    const sql = 'SELECT * FROM getAllMemos() ';
    const response = await this.client.query(sql);
    return response.rows;
  }
};
