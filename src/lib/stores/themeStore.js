import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let theme = 'dark';

if (browser) {
  if (
    localStorage.theme === 'dark'
  || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.setAttribute('data-theme', 'dark');
    theme = 'dark';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    theme = 'light';
  }
}

const createThemeStore = () => {
  const { subscribe, update, set } = writable(theme);

  return {
    subscribe,
    set,
    update,
    toggleTheme: () => update((state) => {
      document.documentElement.setAttribute('data-theme', state === 'dark' ? 'light' : 'dark');
      return state === 'dark' ? 'light' : 'dark';
    }),
    setTheme: (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      set(theme);
    },
  };
};

const themeStore = createThemeStore();

themeStore.subscribe((state) => {
  if (browser) localStorage.setItem('theme', state === 'dark' ? 'dark' : 'light');
});

export default themeStore;
