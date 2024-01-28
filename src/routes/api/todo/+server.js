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
  const { todo } = await request.json();
  const done = !todo.done;
  const response = await tod.update(todo.id, { done });
  if (response) {
    return json(response);
  }

  return json(null, { status: 404 });
}

export async function DELETE({ request }) {
  const { todoId } = await request.json();
  const response = await tod.delete(todoId);
  if (response) {
    return json(todoId, { status: 200 });
  }
  return json(null, { status: 404 });
}
