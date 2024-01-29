import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';

const tod = new CoreDatamapper(db, 'todo');
export async function GET() {
  const response = await tod.findAll();
  return json(response);
}

export async function POST({ request }) {
  const { description } = await request.json();
  const result = await tod.create({ description });
  if (result) {
    return json(result);
  }
}

export async function PATCH({ request }) {
  const { data } = await request.json();
  const { id, done } = data;
  const response = await tod.update(id, {done});
  if (response) {
    return json(response);
  }

  return json(null, { status: 404 });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  const response = await tod.delete(id);
  if (response) {
    return json(id, { status: 200 });
  }
  return json(null, { status: 404 });
}
