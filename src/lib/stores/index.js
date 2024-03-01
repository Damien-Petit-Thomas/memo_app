import { writable } from 'svelte/store';
import CoreStore from './core.store';

const title = writable('');
const reloadNeeded = writable(false);
const memoItems = writable([]);
const currentMemo = (writable({}));
const images = (writable([
  {
    original:
        'https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_960_720.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2016/11/21/13/28/wood-1845389_960_720.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2016/11/21/13/28/wood-1845389_960_720.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2022/11/08/01/34/background-7577472_960_720.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2022/11/08/01/34/background-7577472_960_720.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2016/08/03/09/48/banners-1566213_960_720.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2016/08/03/09/48/banners-1566213_960_720.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2019/04/10/11/56/watercolor-4116932_960_720.png',
    thumbnail:
        'https://cdn.pixabay.com/photo/2019/04/10/11/56/watercolor-4116932_960_720.png',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2021/10/29/13/41/template-6751973_960_720.png',
    thumbnail:
        'https://cdn.pixabay.com/photo/2021/10/29/13/41/template-6751973_960_720.png',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2016/07/03/07/03/presentation-1494380_640.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2016/07/03/07/03/presentation-1494380_640.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2016/07/03/07/10/background-1494381_640.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2016/07/03/07/10/background-1494381_640.jpg',
  },
  {
    original:
        'https://cdn.pixabay.com/photo/2021/10/29/07/19/background-6751263_640.jpg',
    thumbnail:
        'https://cdn.pixabay.com/photo/2021/10/29/07/19/background-6751263_640.jpg',
  },

]));
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

const todos = new CoreStore('/api/todo');
const categories = new CoreStore('/api/category');
const tags = new CoreStore('/api/tag');
const lexicon = new CoreStore('/api/lexicon');
const memos = new CoreStore('/api/memo');
const link = new CoreStore('/api/link');

export {
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
};
