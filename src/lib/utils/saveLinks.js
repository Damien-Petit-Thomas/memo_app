import { link } from '../stores/link';

export const saveLinks = (content, linkList, memoid, categoryId) => {
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
      });
      linksAdded += 1;
    }
    match = linkRegex.exec(content); // Move the exec call inside the loop
  }
  if (linksAdded > 0) {
    console.log(`${linksAdded} link(s) added.`);
  } else {
    console.log('No new links found.');
  }
};
