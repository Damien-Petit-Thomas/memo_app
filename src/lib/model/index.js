import client from '$lib/db';

import Memo from './memo.datamapper';
import MemoTag from './memo_tag.datamapper';
import ImageDatamapper from './image.datamapper';
import CoreDatamapper from './core.datamapper';
import ContentTypeDatamapper from './content_type.datamapper';

export const dataMappers = {
  memo: new Memo(client, 'memo'),
  tag: new CoreDatamapper(client, 'tag'),
  memoTag: new MemoTag(client, 'memo_tag'),
  user: new CoreDatamapper(client, 'user'),
  link: new CoreDatamapper(client, 'link'),
  todo: new CoreDatamapper(client, 'todo'),
  style: new CoreDatamapper(client, 'style'),
  image: new ImageDatamapper(client, 'image'),
  lexicon: new CoreDatamapper(client, 'lexicon'),
  category: new CoreDatamapper(client, 'category'),
  memoContent: new CoreDatamapper(client, 'memo_content'),
  contentType: new ContentTypeDatamapper(client, 'content_type'),
};
