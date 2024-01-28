import { json } from '@sveltejs/kit';
import db from '$lib/db';

export async function GET() {
  const result = await db.query('SELECT * FROM style');
  return json(result.rows);
}
