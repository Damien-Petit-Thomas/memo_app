import { writable } from 'svelte/store';

export const memos = (() => {
  const { subscribe, set, update } = writable([]);

  // Méthode pour ajouter une nouvelle tâche
  const url = import.meta.env.VITE_API_URL;

  const get = async () => {
    try {
      const response = await fetch(`http://${url}/api/memo`);
      if (response.ok) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching memos: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  const add = async (description) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau memo
      const response = await fetch(`http://${url}/api/memo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...description }),
      });

      if (response.ok) {
        const newmemo = response.json();
        // Mettre à jour le store avec le nouveau memo de la BDD
        update(($memos) => [...$memos, newmemo]);

        if (newmemo) {
          return newmemo;
        }
      }
      console.error(`Error adding memo: ${response.status}`);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }

    // Add a default return statement indicating no value
    return null; // or undefined, depending on your preference
  };

  // Méthode pour supprimer une tâche
  const remove = async (memoId) => {
    try {
      // Envoyer la demande de suppression à la BDD
      const response = await fetch(`http://${url}/api/memo/${memoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Mettre à jour le store en excluant la tâche supprimée
        update(($memos) => $memos.filter((t) => t.id !== memoId));
        return true;
      }
      console.error(`Error removing memo: ${response.status}`);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (memo, id) => {
    try {
      const response = await fetch(`http://${url}/api/memo/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memo),
      });

      if (response.ok) {
        const newmemo = await response.json();
        update(($memos) => $memos.map((t) => (t.id === memo.id ? newmemo : t)));
        return newmemo;
      }
      console.error(`Error marking memo: ${response.status}`);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
    return null;
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
