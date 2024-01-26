import { writable } from 'svelte/store';

export const tags = (() => {
  const { subscribe, set, update } = writable([]);
  const url = import.meta.env.VITE_API_URL;


  // Méthode pour ajouter une nouvelle tâche

  const get = async () => {
    try {
      const response = await fetch(`http://${url}/api/tag`);
      if (response.ok) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching tags: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const add = async (description) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau tag
      const response = await fetch(`http://${url}/api/tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...description }),
      });

      if (response.ok) {
        const newtag = await response.json();
        // Mettre à jour le store avec le nouveau tag de la BDD
        update(($tags) => [...$tags, newtag]);
      } else {
        console.error(`Error adding tag: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  // Méthode pour supprimer une tâche
  const remove = async (tag) => {
    try {
      // Envoyer la demande de suppression à la BDD
      const response = await fetch(`http://${url}/api/tag/${tag.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Mettre à jour le store en excluant la tâche supprimée
        update(($tags) => $tags.filter((t) => t.id !== tag.id));
      } else {
        console.error(`Error removing tag: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (tag) => {
    const done = !tag.done;
    const { description } = tag;
    const data = { done, description };

    try {
      const response = await fetch(`http://${url}/api/tag/${tag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        update(($tags) => [
          ...$tags.filter((t) => t !== tag),
          { ...tag, done },
        ]);
      } else {
        console.error(`Error marking tag: ${response.status}`);
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
