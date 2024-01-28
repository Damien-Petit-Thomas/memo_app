import db from '$lib/db';

export const load = async () => {
  try {
    const contents = db.query('SELECT * FROM memo').then((res) => res.rows);
    return { contents };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
