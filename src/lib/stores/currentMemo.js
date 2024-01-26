import { writable } from 'svelte/store';

export const currentMemo = (() => {
  const { subscribe, set } = writable({});
  return {
    set,
    subscribe,
  };
}
)();
