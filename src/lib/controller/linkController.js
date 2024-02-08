import { CoreController } from './coreController';

export class LinkController extends CoreController {
  async getAll() {
    const response = await this.datamapper.findAllFormated();
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }
}
