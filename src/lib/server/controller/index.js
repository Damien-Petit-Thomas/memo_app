import { CoreController } from './coreController';
import { CategoryTagController } from './categoryController';
import { MemoController } from './memoController';
import { LinkController } from './linkController';
import { UserController } from './userController';
import {
  dataMappers,
} from '../../model/index';

const apiController = {
  home(req, res) {
    res.send('Hello World!');
  },
};

export const controllers = {
  apiController,
  memoController: new MemoController(dataMappers.memo),
  userController: new UserController(dataMappers.user),
  linkController: new LinkController(dataMappers.link),
  todoController: new CoreController(dataMappers.todo),
  imageController: new CoreController(dataMappers.image),
  styleController: new CoreController(dataMappers.style),
  tagController: new CategoryTagController(dataMappers.tag),
  lexiconController: new CoreController(dataMappers.lexicon),
  memoContentController: new CoreController(dataMappers.memoContent),
  categoryController: new CategoryTagController(dataMappers.category),
  typeOfContentController: new CoreController(dataMappers.contentType),

};
