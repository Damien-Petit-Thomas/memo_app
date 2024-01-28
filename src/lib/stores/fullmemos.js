import { writable } from 'svelte/store';

export const fullmemos = (() => {
  const { subscribe, set, update } = writable([]);

  const get = async () => {
    try {
      const response = await fetch('/api/fullmemos');
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
  return {
    set,
    subscribe,
    get,
  };
})();
