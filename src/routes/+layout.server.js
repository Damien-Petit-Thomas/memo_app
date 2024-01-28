import db from '$lib/db';

export async function load({ cookies }) {
  cookies.set('test', 'test', { path: '/' });
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
      fullmemosResult,
    ] = await Promise.all([
      db.query('SELECT * FROM todo').then((res) => res.rows),
      db.query('SELECT * FROM category').then((res) => res.rows),
      db.query('SELECT * FROM tag').then((res) => res.rows),
      db.query('SELECT * FROM memo').then((res) => res.rows),
      db.query('SELECT * FROM lexicon').then((res) => res.rows),
      db.query('SELECT * FROM link').then((res) => res.rows),
      db.query('SELECT * FROM style').then((res) => res.rows),
      db.query('SELECT * FROM getAllMemos()').then((res) => res.rows),
    ]);

    if (fullmemosResult[0].getallmemos?.length > 0) {
      fullmemos = fullmemosResult[0].getallmemos.sort((a, b) => {
        if (a.category.name < b.category.name) {
          return 1;
        }
        if (a.category.name > b.category.name) {
          return -1;
        }
        return 0;
      });
    }

    return {
      todos,
      categories,
      tags,
      memos,
      fullmemos,
      lexicon,
      links,
      styles,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error.message);
    throw error;
  }
}
