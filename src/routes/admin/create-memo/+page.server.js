import { redirect, fail } from '@sveltejs/kit';
import { clearAuthToken } from '$lib/services/auth.service.js';
import db from '$lib/db';

export const actions = {
  logout: async ({ cookies }) => {
    clearAuthToken({ cookies });
    throw redirect(302, '/auth/login');
  },
};

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
