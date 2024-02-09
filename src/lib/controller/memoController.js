/* eslint-disable max-len */
import { json } from '@sveltejs/kit';
import { dataMappers } from '$lib/model/index.js';
import { createSlug } from '../utils/createSlug';
import { CoreController } from './coreController';

export class MemoController extends CoreController {
  async create(data) {
    const {
      title, contents, categoryId, tagsIds,
    } = data;
    if (!title) {
      throw new Error('title is null');
    }
    const inpudata = { title, category_id: categoryId };
    inpudata.slug = createSlug(inpudata.title);
    let newMemoId;
    try {
      // Step 1: Create the memo
      const newMemo = await this.datamapper.create(inpudata);
      newMemoId = newMemo.id;
      if (!newMemo) {
        throw new Error('Memo not found', { statusCode: 404 });
      }

      // Step 2: Create associated memo tags
      if (tagsIds) {
        const newMemoTags = await Promise.all(
          tagsIds.map((tagId) => dataMappers.memoTag.create({ memo_id: newMemo.id, tag_id: tagId })),
        );

        if (!newMemoTags) {
          throw new Error('MemoTag not found', { statusCode: 404 });
        }
      }
      //  step 3 : pour chaque memo_content  l'ajouter dans la table memo_content
      if (!contents) throw new Error('memo must have content', { statusCode: 404 });
      for (let i = 0; i < contents.length; i += 1) {
        const item = contents[i];
        if (item.styleId === undefined) item.styleId = 3;

        // eslint-disable-next-line no-await-in-loop
        await dataMappers.memoContent.create({
          // eslint-disable-next-line max-len
          memo_id: newMemo.id, content: item.content, type_id: item.type_id, position: item.position, style_id: item.styleId,
        });
      }

      return (newMemo);
    } catch (error) {
      // si il y a une erreur on supprime le memo
      if (newMemoId) {
        await this.datamapper.delete(newMemoId);
      }
      console.error(error);
      return json(null, { status: 500 });
    }
  }

  async getMemoBySlug(req, res) {
    const { slug } = req.params;
    const findMemo = await this.datamapper.getMemoBySlug(slug);
    res.status(200).json(findMemo);
  }

  async getAllMemo(req, res) {
    const memos = await this.datamapper.getAllMemo();

    // on trie les memos par ordre alphabétique
    memos[0].getallmemos.sort((a, b) => {
      if (a.category.name < b.category.name) {
        return 1;
      }
      if (a.category.name > b.category.name) {
        return -1;
      }
      return 0;
    });

    res.status(200).json(memos[0].getallmemos);
  }

  async update(data, id) {
    const {
      title, contents, categoryId, tagsIds, 
    } = data;
    if (!id) {
      throw new Error('id is null');
    }
    if (!title) {
      throw new Error('title is null');
    }
    const newMemo = {
      title, category_id: categoryId, id, tags: tagsIds,
    };
    const inputdata = { title, category_id: categoryId };
    inputdata.slug = createSlug(inputdata.title);
    try {
      const findMemo = await this.datamapper.findByPk(id);
      if (!findMemo) throw new Error('Memo not found', { statusCode: 404 });

      const existingTags = await dataMappers.memoTag.getMemoTags(findMemo.id);

      if (title !== findMemo.title || categoryId !== findMemo.category_id) {
        await this.datamapper.update(id, inputdata);
      }

      if (tagsIds && JSON.stringify(tagsIds) !== JSON.stringify(existingTags)) {
        const tagsToRemove = existingTags.filter((tag) => !tagsIds.includes(tag));
        const tagsToAdd = tagsIds.filter((tag) => !existingTags.includes(tag));
        await Promise.all(tagsToRemove.map((tag) => dataMappers.memoTag.delete(findMemo.id, tag)));
        await Promise.all(tagsToAdd.map((tag) => dataMappers.memoTag.insert(findMemo.id, tag)));
      }

      if (contents && JSON.stringify(contents) !== JSON.stringify(findMemo.contents)) {
        // on supprime tous les memo_content du memo
        await dataMappers.memoContent.deleteByMemoId(id);

        for (let i = 0; i < contents.length; i += 1) {
          const item = contents[i];
          if (item.styleId === undefined) item.styleId = 3;

          // eslint-disable-next-line no-await-in-loop
          await dataMappers.memoContent.create({
            memo_id: findMemo.id, content: item.content, type_id: item.type_id, position: item.position, style_id: item.styleId,
          });
        }
        return json(newMemo);
      }
    } catch (error) {
      console.error(error);
      return json(null, { status: 500 });
    }
    return null;
  }
}
