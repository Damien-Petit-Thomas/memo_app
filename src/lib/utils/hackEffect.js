// hackEffect.js
const letters = 'ABCDEFGHIJKLMNOOPQRSTIVWXYZ';

export default function hackEffect(selector, speed, iteration) {
  const hack = document.querySelector(selector);
  hack.dataset.value = hack.innerText;

  hack.onmouseover = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      hack.innerText = hack.innerText
        .split('')
        .map((letter, index) => {
          if (index < iterations) {
            return hack.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join('');
      if (iterations >= hack.dataset.value.length) {
        clearInterval(interval);
      }
      iterations += 1 / iteration;
    }, speed);
  };
}
