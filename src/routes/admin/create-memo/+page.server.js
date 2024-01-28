import db from '$lib/db';

export const load = async () => {
  try {
    const content = await db.query('SELECT * FROM content_type');
    const contents = await content.rows;
    return { contents };
  } catch (error) {
    return { error: 'Unable to fetch currencies' };
  }
};
