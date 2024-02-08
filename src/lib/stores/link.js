import { writable } from 'svelte/store';

export const link = (() => {
  const { subscribe, update, set } = writable([]);
  // Méthode pour ajouter une nouvelle tâche
  const get = async () => {
    try {
      const response = await fetch('/api/link');
      if (response) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching words: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const add = async (data) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau link
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const newlink = await response.json();
        // Mettre à jour le store avec le nouveau link de la BDD
        update(($words) => [...$words, newlink]);
      } else {
        console.error(`Error adding link: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  // Méthode pour supprimer une tâche
  const remove = async (id) => {
    try {
      // Envoyer la demande de suppression à la BDD
      const response = await fetch('/api/link/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Mettre à jour le store en excluant la tâche supprimée
        update(($words) => $words.filter((t) => t.id !== id));
      } else {
        console.error(`Error removing link: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (lexical) => {
    try {
      const response = await fetch('/api/link/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lexical),
      });

      if (response.ok) {
        update(($words) => [
          ...$words.filter((t) => t !== link),
          { ...link, lexical },
        ]);
      } else {
        console.error(`Error marking link: ${response.status}`);
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
