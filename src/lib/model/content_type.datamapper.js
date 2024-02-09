import CoreDatamapper from './core.datamapper';

export default class ContentTypeDatamapper extends CoreDatamapper {
  async findByPk(id) {
    const sql = 'SELECT * FROM getContentTypesWithStyles($1) ';
    const values = [id];
    const response = await this.client.query(sql, values);
    return response.rows[0].getcontenttypeswithstyles;
  }
}
