import CoreDatamapper from './core.datamapper';


export default class User extends CoreDatamapper {
  async getByEmail(email) {
    const sql = `SELECT * FROM ${this.tablename} WHERE email = $1`;
    const values = [email];
    const response = await this.client.query(sql, values);
    return response.rows[0];
  }
}