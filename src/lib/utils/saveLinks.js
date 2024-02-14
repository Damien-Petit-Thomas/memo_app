import { link } from '../stores/index.js';

export const saveLinks = (content, linkList, memoid, categoryId, userId) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match = linkRegex.exec(content);
  let linksAdded = 0;
  while (match !== null) {
    const linkText = match[1];
    const linkUrl = match[2];
    if (!linkList.includes(linkUrl)) {
      link.add({
        name: linkText,
        url: linkUrl,
        memo_id: memoid,
        category_id: categoryId,
        user_id: userId,
      });
      linksAdded += 1;
    }
    match = linkRegex.exec(content);
  }
  return linksAdded;
};
