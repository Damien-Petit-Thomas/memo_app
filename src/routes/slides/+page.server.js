import { redirect } from '@sveltejs/kit';
import db from '$lib/db';

export const load = async ({ locals }) => {
  const { user } = locals;
  if (!user) {
    throw redirect(302, '/auth/login');

    // return { error: 'You must be logged in to access this page' };
  }
  try {
    const dataSlide = await db.query('SELECT * FROM slide where user_id = $1', [user.id]);
    const userSlide = await dataSlide.rows;
    return { userSlide, user };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
