import { writable } from 'svelte/store';

class CoreStore {
  constructor(apiEndpoint) {
    const { subscribe, set, update } = writable([]);

    const get = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const data = await response.json();
          set(data);
        } else {
          console.error(`Error fetching data: ${response.status}`);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    };

    const add = async (data) => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data }),
        });

        if (response.ok) {
          const newItem = await response.json();
          update((items) => [...items, newItem]);
          return newItem;
        }
        console.error(`Error adding item: ${response.status}`);
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
      return false;
    };

    const remove = async (id) => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          update((items) => items.filter((item) => item.id !== id));
          return true;
        }
        console.error(`Error removing item: ${response.status}`);
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
      return false;
    };
    const mark = async (imputData) => {
      const { id } = imputData;
      const data = { ...imputData };
      delete data.id;
      delete data.updated_at;
      try {
        const response = await fetch(apiEndpoint, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data, id }),
        });

        if (response.ok) {
          update((items) => items.map((i) => (i.id === id ? { ...i, ...data } : i)));
          const updatedItem = await response.json();
          return updatedItem;
        }
        console.error(`Error updating item: ${response.status}`);
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    };

    get(); // Appelle get() lors de la création de l'instance pour charger les données initiales

    this.subscribe = subscribe;
    this.set = set;
    this.update = update;
    this.get = get;
    this.add = add;
    this.remove = remove;
    this.mark = mark;
  }
}

export default CoreStore;
