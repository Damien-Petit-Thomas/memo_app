import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/core.datampper.js';

const users = new CoreDatamapper(db, 'user');

export async function POST({ request }) {
  const { formvalue } = await request.json();
  const data = {
    name: formvalue.username,
    email: formvalue.email,
    password: formvalue.password,
  };
  const result = await users.create(data);
  if (result) {
    return json(result);
  }
}
