import { json } from '@sveltejs/kit';
import db from '$lib/db';

export async function GET() {
  const result = await db.query('SELECT * FROM link');
  return json(result);
}
