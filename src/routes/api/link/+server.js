import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';

const link = new CoreDatamapper(db, 'link');

export async function GET() {
  const response = await link.findAll();
  return json(response);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const result = await link.create(data);
  if (result) {
    return json(result);
  }
}
