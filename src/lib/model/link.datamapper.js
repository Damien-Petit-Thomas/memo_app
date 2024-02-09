import CoreDatamapper from './core.datamapper';

export default class LinkDatamapper extends CoreDatamapper {
  async findAllFormated() {
    const sql = 'SELECT * FROM getAllLinks()';
    const response = await this.client.query(sql);
    return response.rows;
  }
};
