import { writable } from 'svelte/store';

export const todos = (() => {
  const { subscribe, set, update } = writable([]);
  // si le store est vide, on va chercher les données dans la BDD

  return {
    set,
    update,
    subscribe,
  };
})();
