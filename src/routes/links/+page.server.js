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
