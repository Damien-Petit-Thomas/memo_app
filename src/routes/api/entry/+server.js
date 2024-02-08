import { json } from '@sveltejs/kit';
import db from '$lib/db';
import CoreDatamapper from '$lib/model/datampper.js';

const users = new CoreDatamapper(db, 'user');

export async function POST({ request }) {
  const { formvalue } = await request.json();
  console.log('formvalue', formvalue);
  const data = {
    name: formvalue.username,
    email: formvalue.email,
    password: formvalue.password,
  };
  console.log('data', data)
  const result = await users.create(data);
  if (result) {
    return json(result);
  }
}
