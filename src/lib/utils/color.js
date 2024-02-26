export default function getNewColor(couleurHex, facteurPaleur) {
  let r = parseInt(couleurHex.slice(1, 3), 16);
  let v = parseInt(couleurHex.slice(3, 5), 16);
  let b = parseInt(couleurHex.slice(5, 7), 16);

  r += facteurPaleur;
  v += facteurPaleur;
  b += facteurPaleur;

  r = Math.min(255, r);
  v = Math.min(255, v);
  b = Math.min(255, b);

  const nouvelleCouleurHex = `#${(1 << 24 | r << 16 | v << 8 | b).toString(16).slice(1)}`;
  return nouvelleCouleurHex;
}
