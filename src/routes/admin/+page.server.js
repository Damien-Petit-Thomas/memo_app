import { redirect } from '@sveltejs/kit';
import { clearAuthToken } from '$lib/services/auth.service.js';

export const actions = {
  logout: async ({ cookies }) => {
    clearAuthToken({ cookies });
    throw redirect(302, '/auth/login');
  },
};
