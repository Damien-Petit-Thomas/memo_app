import CoreDatamapper from './core.datamapper';

export default class ImageDatamapper extends CoreDatamapper {
  async findAll(id) {
    const result = await this.client.query('SELECT * FROM image WHERE user_id = $1 OR user_id IS NULL', [id]);
    return result.rows;
  }
}
