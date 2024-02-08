import CoreDatamapper from './core.datamapper';

export default class LinkDatamapper extends CoreDatamapper {
  async findAllFormated() {
    console.log('LinkDatamapper findAllFormated');
    const sql = 'SELECT * FROM getAllLinks()';
    const response = await this.client.query(sql);
    console.log(response.rows);
    return response.rows;
  }
};
