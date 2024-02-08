import { writable } from 'svelte/store';



export const categories = (() => {
  const { subscribe, update, set } = writable([]);
  const get = async () => {
    try {
      const response = await fetch('/api/category');
      if (response.ok) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching categories: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const add = async (data) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau category
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const newcategory = await response.json();
        // Mettre à jour le store avec le nouveau category de la BDD
        update(($categories) => [...$categories, newcategory]);
      } else {
        console.error(`Error adding category: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  // Méthode pour supprimer une tâche
  const remove = async (id) => {
    try {
    // Envoyer la demande de suppression à la BDD
      const response = await fetch('/api/category', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Mettre à jour le store en excluant la tâche supprimée
        update(($categories) => $categories.filter((t) => t.id !== id));
      } else {
        console.error(`Error removing category: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (category) => {
    const { description } = category;
    const data = { description };

    try {
      const response = await fetch('/api/category', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        update(($categories) => [
          ...$categories.filter((t) => t !== category),
          { ...category, description },
        ]);
      } else {
        console.error(`Error marking category: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  return {
    set,
    update,
    subscribe,
    add,
    remove,
    mark,
    get,
  };
})();
