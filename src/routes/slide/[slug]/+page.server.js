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
    const dataSlide = await db.query('SELECT * FROM slide where user_id = $1', [user.id]);
    const userSlide = await dataSlide.rows;
    return { userSlide, contents, user };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
