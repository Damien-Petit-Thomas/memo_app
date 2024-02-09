import CoreStore from './core.store';

const todos = new CoreStore('/api/todo');
const categories = new CoreStore('/api/category');
const tags = new CoreStore('/api/tag');
const lexicon = new CoreStore('/api/lexicon');
const memos = new CoreStore('/api/memo');

export {
  todos, categories, tags, lexicon, memo,
};
