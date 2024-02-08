import { writable } from 'svelte/store';

export const memos = (() => {
  const { subscribe, update, set } = writable([]);

  // Méthode pour ajouter une nouvelle tâche

  const get = async () => {
    try {
      const response = await fetch('/api/memo');
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
  const add = async (data) => {
    try {
      // Envoyer la description à la BDD pour créer un nouveau memo
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response) {
        const newmemo = await response.json();
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

    return null;
  };

  const remove = async (id) => {
    try {
      const response = await fetch('/api/memo/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response) {
        update(($memos) => $memos.filter((t) => t.id !== id));
        return true;
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
    return false;
  };

  const mark = async (data) => {
    try {
      const response = await fetch('/api/memo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const newmemo = await response.json();
        update(($memos) => $memos.map((t) => (t.id === newmemo.id ? newmemo : t)));
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
