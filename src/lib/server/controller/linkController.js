import { CoreController } from './coreController';

export class LinkController extends CoreController {
  async getAll(userId) {
    const response = await this.datamapper.findAllFormated(userId);
    if (!response) throw new Error('Not found', { statusCode: 404 });
    return response;
  }
}
