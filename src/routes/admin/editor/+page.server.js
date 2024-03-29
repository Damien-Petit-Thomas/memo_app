import { redirect } from '@sveltejs/kit';
import db from '$lib/db';


export const load = async ({ locals }) => {
  const { user } = locals;
  if (!user) {
    throw redirect(302, '/auth/login');

    // return { error: 'You must be logged in to access this page' };
  }
  try {
    const content = await db.query('SELECT * FROM content_type');
    const contents = await content.rows;
    return { contents, user };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
