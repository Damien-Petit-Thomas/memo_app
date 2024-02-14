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

export async function load({ locals }) {
  const { user } = locals;
  let fullmemos = [];
  try {
    const [
      todos,
      categories,
      tags,
      memos,
      lexicon,
      links,
      styles,
      // fullmemosResult,
    ] = await Promise.all([
      db.query('SELECT * FROM todo WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM category WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM tag WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM memo WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM lexicon WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM link WHERE user_id = $1', [user.id]).then((res) => res.rows),
      db.query('SELECT * FROM style').then((res) => res.rows),
      // db.query('SELECT * FROM getAllMemos()').then((res) => res.rows),
    ]);

    // if (fullmemosResult[0].getallmemos?.length > 0) {
    //   fullmemos = fullmemosResult[0].getallmemos.sort((a, b) => {
    //     if (a.category.name < b.category.name) {
    //       return 1;
    //     }
    //     if (a.category.name > b.category.name) {
    //       return -1;
    //     }
    //     return 0;
    //   });
    // }

    return {
      user,
      todos,
      categories,
      tags,
      memos,
      // fullmemos,
      lexicon,
      links,
      styles,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error.message);
    throw error;
  }
}
