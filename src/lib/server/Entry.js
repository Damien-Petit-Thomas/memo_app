import db from '$lib/db';

export async function SaveEntry(req) {
  try {
    const { username, email, password } = req;
    const res = await db.query('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
    return res;
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
}
