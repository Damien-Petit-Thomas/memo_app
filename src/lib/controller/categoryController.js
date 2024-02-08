import { CoreController } from './coreController';
import { createSlug } from '$lib/utils/createSlug';

export class CategoryTagController extends CoreController {
  // constructor(model) {
  //   super(model);
  // }

  async create(data) {
    if (data.name && data.color) {
      const newData = { ...data };
      newData.slug = createSlug(data.name);
      const newCategory = await this.datamapper.create(newData);
      return newCategory;
    }
    return null;
  }

  async update(req, res) {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = createSlug(req.body.name);
    }
    const findCategory = await this.datamapper.findByPk(id);
    if (!findCategory) throw new Error('category not found', { statusCode: 404 });
    const updatedCategory = await this.datamapper.update(id, req.body);
    res.status(200).json(updatedCategory);
  }
}
