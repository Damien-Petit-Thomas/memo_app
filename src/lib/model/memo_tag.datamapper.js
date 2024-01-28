import CoreDatamapper from './datampper';

export default class MemoTag extends CoreDatamapper {
  tablename = 'memo_tag';

  async delete(memoId, tagId) {
    const query = `DELETE FROM ${this.tablename} WHERE memo_id = $1 AND tag_id = $2`;
    const values = [memoId, tagId];
    const result = await this.client.query(query, values);
    return !!result.rowCount;
  }

  async getMemoTags(memoId) {
    const query = `SELECT tag_id FROM ${this.tablename} WHERE memo_id = $1 ORDER BY tag_id`;
    const value = [memoId];
    const result = await this.client.query(query, value);
    // on ne retourne que les id des tags
    return result.rows.map((row) => row.tag_id);
  }

  async insert(memoId, tagId) {
    const quary = `INSERT INTO ${this.tablename} (memo_id, tag_id) VALUES ($1, $2) RETURNING *`;
    const values = [memoId, tagId];
    const result = await this.client.query(quary, values);
    return result.rows[0];
  }
}
