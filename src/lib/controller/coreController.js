export class CoreController {
  constructor(datamapper) {
    this.datamapper = datamapper;
  }

  async getAll() {
    const response = await this.datamapper.findAll();
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }

  async getOne(id) {
    const response = await this.datamapper.findByPk(id);
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }

  async create(data) {
    console.log('data', data)
    const response = await this.datamapper.create(data);
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }

  async update(data, id) {
    const response = await this.datamapper.update(id, data);
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }

  async delete(id) {
    const response = await this.datamapper.delete(id);
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }
}
