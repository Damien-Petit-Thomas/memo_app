/* eslint-disable max-len */
import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';
import { createSlug } from '$lib/utils/createSlug.js';
import Memotag from '$lib/model/memo_tag.datamapper.js';
import MemoContent from '$lib/model/memo_content.datamapper.js';

const memoContent = new MemoContent(db, 'memo_content');
const memoTag = new Memotag(db, 'memo_tag');
const memo = new CoreDatamapper(db, 'memo');

export async function GET() {
  const response = await memo.findAll();
  return json(response);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const {
    title, contents, categoryId, tagsIds,
  } = data;
  const inputdata = { title, category_id: categoryId };
  inputdata.slug = createSlug(title);
  let newMemoId;
  try {
    const newMemo = await memo.create(inputdata);
    newMemoId = newMemo.id;
    if (!newMemoId) {
      throw new Error('newMemoId is null');
    }
    if (tagsIds) {
      const newMemoTags = await Promise.all(
        tagsIds.map((tagId) => memoTag.create({ memo_id: newMemo.id, tag_id: tagId })),
      );

      if (!newMemoTags) {
        throw new Error('newMemoTags is null');
      }
    }
    //  step 3 : pour chaque memo_content  l'ajouter dans la table memo_content
    if (!contents) throw new Error('contents is null');
    for (let i = 0; i < contents.length; i += 1) {
      const item = contents[i];
      if (item.styleId === undefined) item.styleId = 3;

      // eslint-disable-next-line no-await-in-loop
      await memoContent.create({
        memo_id: newMemo.id, content: item.content, type_id: item.type_id, position: item.position, style_id: item.styleId,
      });
    }

    newMemo.tags = tagsIds;
    return json(newMemo);
  } catch (error) {
    // si il y a une erreur on supprime le memo
    if (newMemoId) {
      await memo.delete(newMemoId);
    }
    console.error(error);
    json(null, { status: 500 });
  }
}

export async function PATCH({ request }) {
  const { data } = await request.json();
  const {
    title, contents, categoryId, tagsIds, id,
  } = data;
  if (!id) {
    throw new Error('id is null');
  }
  const newMemo = {
    title, category_id: categoryId, id, tags: tagsIds,
  };
  const inputdata = { title, category_id: categoryId };
  inputdata.slug = createSlug(inputdata.title);
  try {
    const findMemo = await memo.findByPk(id);
    if (!findMemo) throw new Error('Memo not found', { statusCode: 404 });

    const existingTags = await memoTag.getMemoTags(findMemo.id);

    if (title !== findMemo.title || categoryId !== findMemo.category_id) {
      await memo.update(id, inputdata);
    }

    if (tagsIds && JSON.stringify(tagsIds) !== JSON.stringify(existingTags)) {
      const tagsToRemove = existingTags.filter((tag) => !tagsIds.includes(tag));
      const tagsToAdd = tagsIds.filter((tag) => !existingTags.includes(tag));
      await Promise.all(tagsToRemove.map((tag) => memoTag.delete(findMemo.id, tag)));
      await Promise.all(tagsToAdd.map((tag) => memoTag.insert(findMemo.id, tag)));
    }

    if (contents && JSON.stringify(contents) !== JSON.stringify(findMemo.contents)) {
      // on supprime tous les memo_content du memo
      await memoContent.deleteByMemoId(id);

      //! todo : ajouter une colonne order dans la table memo_content pour pouvoir les trier et utiliser Promise.all
      for (let i = 0; i < contents.length; i += 1) {
        const item = contents[i];
        if (item.styleId === undefined) item.styleId = 3;

        await memoContent.create({
          memo_id: findMemo.id, content: item.content, type_id: item.type_id, position: item.position, style_id: item.styleId,
        });
      }
    }
    return json(newMemo);
  } catch (error) {
    console.error(error);
    json(null, { status: 500 });
  }
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  const response = await memo.delete(id);
  if (response) {
    return json(id, { status: 200 });
  }
  return json(null, { status: 404 });
}
