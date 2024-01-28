import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';
import { createSlug } from '$lib/utils/createSlug.js';

const cate = new CoreDatamapper(db, 'category');
export async function GET() {
  const response = await cate.findAll();
  return json(response);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const slug = createSlug(data.name);
  data.slug = slug;
  const result = await cate.create(data);
  if (result) {
    return json(result);
  }
}

export async function PATCH({ request }) {
  const { category } = await request.json();
  const response = await cate.update(category.id, { category });
  if (response) {
    return json(response);
  }

  return json(null, { status: 404 });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  const response = await cate.delete(id);
  if (response) {
    return json(id, { status: 200 });
  }
  return json(null, { status: 404 });
}
