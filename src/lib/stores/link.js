import { writable } from 'svelte/store';

export const link = (() => {
  const { subscribe, update, set } = writable([]);
 

  return {

    set,
    update,
    subscribe,
  };
})();
