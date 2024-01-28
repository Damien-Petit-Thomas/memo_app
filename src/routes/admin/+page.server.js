import db from '$lib/db';
import todo from '$lib/stores/todo';

export const actions = {
  create: async ({ request }) => {
    try {
      const data = await request.formData();

      // Exécutez la requête SQL avec la correction
      const result = await db.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [data.get('description')]);
      if (result.rowCount === 1) {
        const newTodo = result.rows[0];
        todo.update((todos) => [...todos, newTodo]);
      }
      return result.rows[0];
      // Mettez à jour le store avec le résultat de la requête
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans la base de données :', error.message);
      // Gérez l'erreur de manière appropriée, par exemple, renvoyez une réponse d'erreur au client.
    }
    return null;
  },
};
