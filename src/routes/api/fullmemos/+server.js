import { json } from '@sveltejs/kit';
import db from '$lib/db';

export async function GET({ cookies, request }) {
  const userId = cookies.get('userId');
  const result = await db.query('SELECT * FROM getAllMemosForUser($1)', [userId])
    .then((res) => res.rows);
  result[0].getallmemosforuser.forEach((memo) => {
  });
  const fullmemos = result[0].getallmemosforuser.sort((a, b) => {
    if (a.category.name < b.category.name) {
      return 1;
    }
    if (a.category.name > b.category.name) {
      return -1;
    }
    return 0;
  });

  return json(fullmemos);
}
