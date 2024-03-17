<script>
  // <a href="https://www.flaticon.com/free-icons/underline" title="underline icons">Underline icons created by Pixel perfect - Flaticon</a>
  // <a href="https://www.flaticon.com/fr/icones-gratuites/italique" title="italique icônes">Italique icônes créées par Freepik - Flaticon</a>
  // <a href="https://www.flaticon.com/free-icons/bold" title="bold icons">Bold icons created by Freepik - Flaticon</a>
  import underline from "$lib/assets/underline.png";
  import { onDestroy } from "svelte";
  import italic from "$lib/assets/texte-en-italique.png";
  import bold from "$lib/assets/bold.png";
  export let currentItem;
  import { memoItems } from "$lib/stores/index";
  import { createEventDispatcher } from "svelte";
  import { fly, slide } from "svelte/transition";
  import remove from "$lib/assets/remove.svg";
  export let x;
  export let y;
  let finalx = x + 35;
  let finaly = y - 150;
  let size = 17;
  let color = "#ffffff";
  let fontfamily = "Arial";
  let animation = "aucune";
  let delay = 0;
  let repeat = 1;
  let duration = 1400;
  let showTransition = false;
  let showOptions = false;
  let showBackground = false;
  let showFont = false;
  let background;
  let opacity = 1;
  let weight = 400;
  let easeFunction = "linear";
  let decoration = "none";
  let axe = "left-to-right";

  const fonts = [
    "Arial",
    "Courier",
    "Cursive",
    "Helvetica",
    "aakar",
    "Ani",
    "AnjaliOldLipi",
    "Chandas",
    "Chilanka",
    "Courier",
    "Courier 10 Pitch",
    "DejaVu Sans",
    "DejaVu Serif",
    "Dyuthi",
    "FreeMono",
    "FreeSerif",
    "Gargi",
    "Garuda",
    "Gubbi",
    "Lohit Devanagari",
    "Manjari",
    "Meera",
    "NATS",
    "Noto Sans Emoji",
    "Noto Mono",
    "Phetsarath OT",
    "Purisa",
    "Rachana",
    "Ubuntu",
    "Uroob",
    "URW Gothic",
  ];

  const animations = [
    "aucune",
    "fade",
    "Float",
    "slide-bottom",
    "slide-left",
    "slide-right",
    "slideTop",
    "Zoom",
  ];

  const eases = [
    "linear",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "step-start",
    "step-end",
    "steps",
    "cubic-bezier(0.1, -0.6, 0.2, 0)",
  ];
  const axes = [
    {
      id: 1,
      axe: "left-to-right",
    },
    {
      id: 2,
      axe: "right-to-left",
    },
    {
      id: 3,
      axe: "top-to-bottom",
    },
    {
      id: 4,
      axe: "bottom-to-top",
    },
  ];

  const handleAxe = () => {
    const btn = document.getElementById("axe-btn");
    if (axe === "left-to-right") {
      axe = 3;
      btn.textContent = "▼";
    } else if (axe === "right-to-left") {
      axe = 4;
      btn.textContent = "▲";
    } else if (axe === "top-to-bottom") {
      axe = 2;
      btn.textContent = "◀";
    } else {
      axe = 1;
      btn.textContent = "▶";
    }
  };

  const handleTransition = (e) => {
    transition = e.detail.transition;
    duration = e.detail.duration;
    delay = e.detail.delay;
    animation = e.detail.animation;
    axe = e.detail.axe;
  };
  const dispatch = createEventDispatcher();

  $: css = `
  font-family: ${fontfamily};
  font-size: ${size}px;
  color: ${color};
  background: ${background};
  opacity: ${opacity};
  animation:  ${duration}ms ${easeFunction} ${delay}ms  ${repeat} ${animation};
  `;

  $: dispatch("css", { css });

  const repeats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "infinite"];

  $: if (Object.keys(currentItem?.customCss).length === 0) {
    count += 1;
    currentItem.customCss = baseCss;
  }

  let count = 0;

  $: if (count < 1 && Object.keys(currentItem.customCss).length > 0) {
    count += 1;
    repeat = currentItem.customCss.repeat;
    size = currentItem.customCss.fontsize;
    color = currentItem.customCss.color;
    fontfamily = currentItem.customCss.fontfamily;
    background = currentItem.customCss.background;
    opacity = currentItem.customCss.opacity;
    weight = currentItem.customCss.fontWeight;
    animation = currentItem.customCss.animation;
    duration = currentItem.customCss.duration;
    delay = currentItem.customCss.delay;
    easeFunction = currentItem.customCss.easefonction;
  }
  onDestroy(() => {
    currentItem.customCss = {
      fontfamily: fontfamily,
      fontsize: size,
      color: color,
      background: background,
      opacity: opacity,
      animation: animation,
      duration: duration || 1400,
      delay: delay || 0,
      easefonction: easeFunction || "linear",
      repeat: repeat || 1,
    };
    // il ne faut pas directement ajouter currentItem à memoItems
    //  cela va creer des doublons
    // il faut plutot modifier l'item dans memoItems

    const index = $memoItems.findIndex((item) => item.id === currentItem.id);
    $memoItems[index] = currentItem;
  });

  const baseCss = {
    fontfamily: fontfamily,
    fontsize: size,
    color: color,
    background: background,
    opacity: opacity,
    fontWeight: weight,
    animation: animation,
    duration: duration,
    delay: delay,
    easefunction: easeFunction,
    repeat: repeat,
  };
</script>

<svelte:document />
<div
  transition:fly={{ x: -200, duration: 200 }}
  style="
position: fixed;
top: {finaly}px;
left: {finalx}px;"
  class="container"
>
  <div class="remove-container">
    <button class="remove" on:click={() => dispatch("remove")}
      ><img src={remove} alt="remove button" /></button
    >
    <button
      class="close"
      on:click={() => {
        dispatch("close");
      }}>X</button
    >
  </div>
  <div class="color-size">
    <div class="size">
      <label for="size">taile</label>
      <input type="range" id="size" min="1" max="300" bind:value={size} />
      <input type="text" bind:value={size} />
    </div>
    <input type="color" bind:value={color} />
  </div>
  <select name="font" id="font" bind:value={fontfamily}>
    {#each fonts as font}
      <option value={font}>{font}</option>
    {/each}
  </select>
  <button on:click={() => (showOptions = !showOptions)}>options </button>
  {#if showOptions}
    <div transition:slide class="options">
      <button on:click={() => (showTransition = !showTransition)}
        >animation</button
      >
      {#if showTransition}
        <div transition:slide class="transition-container">
          <div class="transition-section">
            <label for="transition">nom</label>
            <select name="transition" id="transition" bind:value={animation}>
              {#each animations as animation}
                <option value={animation}>{animation}</option>
              {/each}
            </select>
            <!-- <button
              on:click={() =>
                dispatch("transition", {
                  animation,
                  duration,
                  delay,
                  animation,
                  axe,
                })}
              class="transition-btn">valider</button
            > -->
          </div>
          <div class="transition-section">
            <label for="time">temps en ms </label>
            <input type="number" bind:value={duration} />
          </div>
          <div class="transition-section">
            <label for="delay"> delai en ms </label>
            <input type="number" bind:value={delay} />
          </div>
          <div class="transition-section">
            <label for="repeat">répétitions</label>
            <select name="animation" id="animation" bind:value={repeat}>
              {#each repeats as repeat}
                <option value={repeat}>{repeat}</option>
              {/each}
            </select>
          </div>
          <div class="transition-section">
            <label for="animation"> timing function </label>
            <select name="animation" id="animation" bind:value={easeFunction}>
              {#each eases as ease}
                <option value={ease}>{ease}</option>
              {/each}
            </select>
          </div>
          {#if animation === "fly" || animation === "slide"}
            <div transition:slide class="transition">
              orientation
              <button id="axe-btn" on:click={handleAxe}> ▶ </button>
            </div>
          {/if}
        </div>
      {/if}
      <button on:click={() => (showBackground = !showBackground)}
        >background</button
      >
      {#if showBackground}
        <div transition:slide>
          <input type="color" bind:value={background} />
          <label for="opacity">
            opacité
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              bind:value={opacity}
            />
          </label>
        </div>
      {/if}
      <button on:click={() => (showFont = !showFont)}>police</button>
      {#if showFont}
        <div class="police" transition:slide>
          <label for="weight">
            <button class="police-btn"
              ><img src={bold} alt="bold button" /></button
            >
          </label>
          <label for="style">
            <button class="police-btn"
              ><img src={italic} alt="italic button" /></button
            >
          </label>
          <label for="decoration">
            <button class="police-btn"
              ><img src={underline} alt="underline button" /></button
            >
          </label>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .transition-section,
  .transition {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
  }

  .police {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
  }

  .transition-container {
    border: 1px solid #565656;
    border-radius: 5px;
    margin: 0.2rem;
    padding: 1rem 0.5rem 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .remove-container,
  .color-size {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  button.remove,
  .police-btn {
    background-color: transparent;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 0;
  }

  .police-btn {
    border: 2px solid #00d0ff;
    border-radius: 50%;
  }

  .police-btn:hover,
  .transition-btn:hover {
    background-color: #00d0ff;
    color: #1b1f2a;
  }

  .remove-container {
    width: 100%;
    justify-content: space-between;
  }

  .remove {
    background-color: transparent;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 0;
  }

  .close {
    background-color: transparent;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 0;
  }

  button {
    margin: 0;
    background: none;
    border: none;
    color: #00d0ff;
    font-size: 1rem;
    cursor: pointer;
  }

  .container {
    width: 350px;
    background-color: #1b1f2a;
    border: 1px solid #565656;
    color: #00d0ff;
    padding: 0.5rem;
    padding-top: 0.1rem;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: space-between;
    justify-content: space-between;
    z-index: 1000;
  }
  .size {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
  }

  input {
    outline: none;
    width: 70px;
    height: 20px;
    border: none;
    background: none;
    color: white;
    text-align: center;
  }

  input[type="color"] {
    width: 120px;
    height: 40px;
    border: none;
    text-align: center;
  }
</style>
