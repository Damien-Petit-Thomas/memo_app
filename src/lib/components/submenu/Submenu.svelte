<script>
  // <a href="https://www.flaticon.com/free-icons/underline" title="underline icons">Underline icons created by Pixel perfect - Flaticon</a>
  // <a href="https://www.flaticon.com/fr/icones-gratuites/italique" title="italique icônes">Italique icônes créées par Freepik - Flaticon</a>
  // <a href="https://www.flaticon.com/free-icons/bold" title="bold icons">Bold icons created by Freepik - Flaticon</a>
import underline from "$lib/assets/underline.png";
import italic from "$lib/assets/texte-en-italique.png";
import bold from "$lib/assets/bold.png";

  import { createEventDispatcher } from "svelte";
  import {fly, slide } from "svelte/transition";
  import remove from "$lib/assets/remove.svg";
  export let x;
  export let y;
  let finalx = x + 35;
  let finaly = y - 150;
  let size = 17;
  let color = "#00d0ff";
  let fontfamily = "Arial";
  let transition;
  let delay =0;
  let repeat = 1;
  let duration = 400;
  let showTransition = false;
  let showOptions = false;
  let showBackground = false;
  let showFont = false;
  let background = "#00d0ff";
  let opacity = 1;
  let weight = 400;
  let decoration = "none";

  const fonts = [
  "Arial",
  "Arial Black",
  "Avant Garde Gothic",
  "Baskerville",
  "Bodoni",
  "Brush Script",
  "Brush Script MT",
  "Calibri",
  "Century Gothic",
  "Clarendon",
  "Comic Sans MS",
  "Consolas",
  "Courier",
  "Courier New",
  "Cursive",
  "Futura",
  "Garamond",
  "Georgia",
  "Gill Sans",
  "Gotham",
  "Helvetica",
  "Impact",
  "Inconsolata",
  "Lobster",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Monaco",
  "Optima",
  "Pacifico",
  "Palatino",
  "Palatino Linotype",
  "Rockwell",
  "Snell Roundhand",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Univers",
  "Verdana",
  "Walbaum",
];

const transitions = [
  "aucune",
  "fly",
  "slide",
  "fade",
  "blur",
  "scale",
  "crossfade",
  "flip",
]




  const dispatch = createEventDispatcher();

 $:  css = `font-family: ${fontfamily}; font-size: ${size}px; color: ${color}`;


$: dispatch('css', { css });

</script>

<div
transition:fly={{x:-200,   duration: 200}}
style="
position: fixed;
top: {finaly}px;
left: {finalx}px;"
class="container"
><div class="remove-container">
  
  <button class="remove"
  on:click={() => dispatch('remove')}
  ><img src={remove} alt="remove button"></button>
  <button class="close"
  on:click={() => dispatch('close')}
  >X</button>
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
    <option value="fontFamily">police</option>
    {#each fonts as font}
      <option value={font}>{font}</option>
    {/each}
  </select>
  <button
  on:click={() => showOptions = !showOptions}
  >options
</button>
  {#if showOptions}
  <div transition:slide class="options">
    <button
    on:click={() => showTransition = !showTransition}
    >transition</button>
    {#if showTransition}
    <div transition:slide class="transition-container">
      <div class="transition-section">
        <select
        name="transition" id="transition" bind:value={transition}>
            {#each transitions as transition}
              <option value={transition}>{transition}</option>
            {/each}
        </select>
        <button
        on:click={() => dispatch('transition', {transition, duration, delay})}
        class="transition-btn">valider</button>
      </div>
      <div class="transition-section">
        <label for="time">temps en ms </label>
          <input type="number" bind:value={duration}  >
       
      </div>
      <div class="transition-section">
        <label for="delay">
          delai en ms  </label>
          <input type="number" bind:value={delay}  >
      
      </div>
      <!-- <div class="transition-section">
        <label for="repeat">répétitions</label>
       <input type="number" bind:value={repeat}>
      </div> -->
    </div>
    {/if}
    <button
    on:click={() => showBackground = !showBackground}
    >background</button>
    {#if showBackground}
    <div   transition:slide>
      <input type="color" bind:value={background} />
      <label for="opacity">
        opacité
        <input type="range" min="0" max="1" step="0.1" bind:value={opacity} >
      </label>
    </div>
    {/if}
    <button
    on:click={() => showFont = !showFont}
    >police</button>
    {#if showFont}
    <div  class="police" transition:slide>
      <label for="weight">
        <button            class="police-btn"><img src={bold} alt="bold button"></button>
      </label>
      <label for="style">
        <button class="police-btn" ><img src={italic} alt="italic button"></button>
      </label>
      <label for="decoration">
        <button class="police-btn" ><img src={underline} alt="underline button"></button>
      </label>
    </div>
    {/if}
  </div>
  {/if}
  
</div>

<style>

  .transition-section {
    
    display: flex;
    justify-content: space-between;
    gap: 5px;
  } 
  
  .police{
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
  }
  
  .transition-container {
    border: 1px solid #565656;
    border-radius: 5px;
    margin: .2rem;
    padding: 1rem .5rem 1rem .5rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .remove-container, .color-size {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  button.remove, .police-btn {
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

.police-btn:hover, .transition-btn:hover {
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


button{
  margin: 0;
  background: none;
  border: none;
  color: #00d0ff;
  font-size: 1rem;
  cursor: pointer;
}


.container {
  width: 300px;
  background-color: #1b1f2a;
  border: 1px solid #565656;
  color: #00d0ff;
  padding: .5rem;
    padding-top: .1rem;
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
    gap: .2rem;
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
