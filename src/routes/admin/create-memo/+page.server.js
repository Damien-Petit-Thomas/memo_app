import { redirect, fail } from '@sveltejs/kit';
import db from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async ({ cookies }) => {
    const cookieOptions = {
      path: '/',
    };
    cookies.delete('AuthorizationToken', cookieOptions);
    throw redirect(302, '/auth/login');
  },
};

export const load = async ({ locals }) => {
  const { user } = locals;
  console.log(locals);
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
