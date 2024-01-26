import { writable } from 'svelte/store';



function createPreviewStore() {
  const { subscribe, set, update } = writable({
    id: null,
    title: '',
    contents: [],
  });

  return {
    subscribe,
    add: (data) => {
      update((store) => {
        Object.keys(data).forEach((key) => {
          store[key] = data[key];
        });
        return store; // Vous devez renvoyer le store mis à jour
      });
    },
    remove: (data) => update((store) => store.filter((t) => t.id !== data.id)),
    update: (data) => set(data),
    addContent: (data) => update((store) => {
      store.contents.push(data);
      return store;
    }),
  };
}

export const preview = createPreviewStore();
