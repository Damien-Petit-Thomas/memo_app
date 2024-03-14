import { writable } from 'svelte/store';
import CoreStore from './core.store';

const title = writable('');
const reloadNeeded = writable(false);
const memoItems = writable([]);
const currentMemo = (writable({}));
const currentSlide = writable([]);
const mainSlideId = writable({});
const maj = writable(false);
const kind = writable('memo');
const fullmemos = (() => {
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

const userslide = new CoreStore('/api/slide');
const images = new CoreStore('/api/image');
const todos = new CoreStore('/api/todo');
const categories = new CoreStore('/api/category');
const tags = new CoreStore('/api/tag');
const lexicon = new CoreStore('/api/lexicon');
const memos = new CoreStore('/api/memo');
const link = new CoreStore('/api/link');

export {
  kind,
  userslide,
  currentSlide,
  images,
  todos,
  categories,
  tags,
  lexicon,
  memos,
  link,
  title,
  reloadNeeded,
  memoItems,
  currentMemo,
  fullmemos,
  mainSlideId,
  maj,
};
