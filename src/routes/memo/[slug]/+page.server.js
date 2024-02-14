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

export const load = async () => {
  try {
    const contents = db.query('SELECT * FROM memo').then((res) => res.rows);
    return { contents };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
