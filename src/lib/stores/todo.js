import { writable } from 'svelte/store';

const url = import.meta.env.VITE_API_URL;
export const todos = (() => {
  const { subscribe, set, update } = writable([]);
  // si le store est vide, on va chercher les données dans la BDD
  const get = async () => {
    try {
      const response = await fetch(`http://${url}/api/todo`);
      if (response.ok) {
        const data = await response.json();
        update(() => data);
      } else {
        console.error(`Error fetching categories: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const add = async (description) => {
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        update(($todos) => [...$todos, newTodo]);
      } else {
        console.error(`Error adding todo: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const remove = async (id) => {
    console.log(id);
    try {
      const response = await fetch('/api/todo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        update(($todos) => $todos.filter((t) => t.id !== id));
      } else {
        console.error(`Error removing todo: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const mark = async (todo) => {
    const done = !todo.done;
    const { id } = todo;
    const data = { done, id };

    try {
      const response = await fetch('/api/todo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        update(($todos) => $todos.map((t) => (t.id === todo.id ? { ...t, done } : t)));
      } else {
        console.error(`Error updating todo: ${response.status}`);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return {
    get,
    set,
    update,
    subscribe,
    add,
    remove,
    mark,
  };
})();
