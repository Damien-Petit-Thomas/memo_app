// import { link } from '../stores/link';

// let insideList = false;
// let insideCodeBlock = false;
// let codeBlock = [];
// let markdownLines = []; // Déclarer ici

// function closeCodeBlock() {
//   if (insideCodeBlock) {
//     insideCodeBlock = false;
//     // Traiter le contenu du bloc de code (ici, vous pouvez le stocker, le formater, etc.)
//     const formattedCodeBlock = `<pre><code>${codeBlock.join('\n')}</code></pre>`;
//     codeBlock = [];
//     markdownLines.push(formattedCodeBlock);
//   }
// }

// function closeListAndCodeBlock() {
//   closeCodeBlock();
//   if (insideList) {
//     insideList = false;
//     markdownLines.push('</ul>');
//   }
// }

// function transformLine(line, linkList, id) {
//   // Logique de transformation pour les autres types de lignes
//   const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
//   if (linkMatch) {
//     const linkText = linkMatch[1];
//     const linkUrl = linkMatch[2];
//     if (linkList.find((links) => links.url === linkUrl)) {
//       return `<a href="${linkUrl}">${linkText}</a>`;
//     }
//     link.add({ name: linkText, url: linkUrl, memo_id: id });
//     return `<a href="${linkUrl}">${linkText}</a>`;
//   }

//   const linkMatch2 = line.match(/(https?:\/\/[^\s]+)/);
//   if (linkMatch2) {
//     const linkText = linkMatch2[1];
//     if (linkList.find((links) => links.url === linkText)) {
//       return `<a href="${linkText}">${linkText}</a>`;
//     }
//     link.add({ name: linkText, url: linkText, memo_id: id });
//     return `<a href="${linkText}">${linkText}</a>`;
//   }

//   const boldMatch = line.match(/\*\*(.+?)\*\*/);
//   if (boldMatch) {
//     const boldText = boldMatch[1];
//     return `<span style="font-weight: bold">${boldText}</span>`;
//   }

//   const italicMatch = line.match(/\*(.+?)\*/);
//   if (italicMatch) {
//     const italicText = italicMatch[1];
//     return `<span style="font-style: italic">${italicText}</span>`;
//   }

//   const codeMatch = line.match(/`(.+?)`/);
//   if (codeMatch) {
//     const codeText = codeMatch[1];
//     return `<code>${codeText}</code>`;
//   }

//   // sinon, on la laisse telle quelle
//   return line;
// }

// export const textToMarkdown = (text, id, linkList) => {
//   // on démarre un minuteur pour mesurer le temps de traitement
//   console.time('textToMarkdown');
//   // on crée un tableau de lignes
//   const lines = text.split('\n');
//   markdownLines = []; // Utiliser la version globale

//   // on crée un tableau de lignes markdown
//   lines.forEach((line) => {
//     // si la ligne commence par un #, on la transforme en titre
//     const headingMatch = line.match(/^(#{1,6})\s*(.+)$/);
//     if (headingMatch) {
//       const headingLevel = headingMatch[1].length;
//       const headingText = headingMatch[2];
//       closeListAndCodeBlock();
//       return `</p><h${headingLevel}>${headingText}</h${headingLevel}><p>`;
//     }

//     // si la ligne commence par un -, on la transforme en liste non ordonnée
//     if (line.startsWith('- ')) {
//       closeCodeBlock();
//       if (!insideList) {
//         insideList = true;
//         return `<ul><li>${line.slice(2)}</li>`;
//       }
//       return `<li>${line.slice(2)}</li>`;
//     }

//     if (insideList) {
//       insideList = false;
//       return `</ul><p>${line}</p>`;
//     }

//     // si la ligne commence par ``` ou se trouve dans un bloc de code
//     const codeBlockMatch = line.match(/^```(.*)$/);
//     if (codeBlockMatch) {
//       closeListAndCodeBlock();
//       insideCodeBlock = !insideCodeBlock;
//       return '';
//     }

//     // si la ligne est dans un bloc de code
//     if (insideCodeBlock) {
//       codeBlock.push(line);
//       return '';
//     }

//     // Reste des transformations
//     markdownLines.push(transformLine(line, linkList, id));
//   });
//   // Si besoin, ajouter des lignes à `markdownLines` comme suit :

//   // Gérer le dernier bloc de code
//   closeCodeBlock();
//   closeListAndCodeBlock();

//   // on retourne le markdown
//   console.timeEnd('textToMarkdown');
//   return markdownLines.join('\n');
// };
import { link } from '../stores/link';

function saveLink(linkText, linkUrl, id, linkList = []) {
  if (!linkList.includes(linkUrl)) {
    linkList.push(linkUrl);
    link.add({ name: linkText, url: linkUrl, memo_id: id });
  } else {
    console.log('link already exists');
  }
}

export const detectLinks = (text, id, linkList) => {
  const lines = text.split('\n');

  lines.forEach((line) => {
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      saveLink(linkText, linkUrl, id, linkList);
    }
  });
};
