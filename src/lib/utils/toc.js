export const generateToc = (content) => {
  const lines = content.split('\n');
  const toc = [];
  const tocRegex = /^#{1,6} (.*)$/;

  lines.forEach((line) => {
    const match = line.match(tocRegex);
    if (match) {
      const title = match[1];
      const level = match[0].match(/#/g).length;
      const link = '#title.toLowerCase().replace(/[^a-z0-9]+/g, \'-\')';
      toc.push({ title, level, link });
    }
  });
  return toc;
};
