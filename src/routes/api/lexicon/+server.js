import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';

const lexic = new CoreDatamapper(db, 'lexicon');
export async function GET() {
  const response = await lexic.findAll();
  return json(response);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const result = await lexic.create(data);
  if (result) {
    return json(result);
  }
}

export async function PATCH({ request }) {
  const { data } = await request.json();
  const response = await lexic.update(lexic.id, { data });
  if (response) {
    return json(response);
  }

  return json(null, { status: 404 });
}

export async function DELETE({ request }) {
  const { itemId } = await request.json();
  const response = await lexic.delete(itemId);
  if (response) {
    return json(itemId, { status: 200 });
  }
  return json(null, { status: 404 });
}
