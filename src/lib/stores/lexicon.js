import { writable } from 'svelte/store';

export const lexicon = (() => {
  const { subscribe, update, set } = writable([]);

  // Méthode pour ajouter une nouvelle tâche
  const url = import.meta.env.VITE_API_URL;

  const get = async () => {
    try {
      const response = await fetch(`http://${url}/api/lexicon`);
      if (response.ok) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching words: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const add = async (description) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau lexicon
      const response = await fetch(`http://${url}/api/lexicon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...description }),
      });

      if (response.ok) {
        const newlexicon = await response.json();
        // Mettre à jour le store avec le nouveau lexicon de la BDD
        update(($words) => [...$words, newlexicon]);
      } else {
        console.error(`Error adding lexicon: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  // Méthode pour supprimer une tâche
  const remove = async (lexical) => {
    try {
      // Envoyer la demande de suppression à la BDD
      const response = await fetch(`http://${url}/api/lexicon/${lexical.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Mettre à jour le store en excluant la tâche supprimée
        update(($words) => $words.filter((t) => t.id !== lexical.id));
      } else {
        console.error(`Error removing lexicon: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (lexical) => {
    try {
      const response = await fetch(`http://${url}/api/lexicon/${lexical.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lexical),
      });

      if (response.ok) {
        update(($words) => [
          ...$words.filter((t) => t !== lexicon),
          { ...lexicon, lexical },
        ]);
      } else {
        console.error(`Error marking lexicon: ${response.status}`);
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
