<script>
  import { createEventDispatcher } from "svelte";
  import {fly } from "svelte/transition";
  import remove from "$lib/assets/remove.svg";
  export let x;
  export let y;
  let finalx = x - 200;
  let finaly = y + 50;
  let size = 17;
  let color = "#00d0ff";
  let fontfamily = "Arial";
  let transition;

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
  <select
  on:click={() => dispatch('transition', transition)}
  name="transition" id="transition" bind:value={transition}>
      {#each transitions as transition}
        <option value={transition}>{transition}</option>
      {/each}
  </select>
  

</div>

<style>

 
  .remove-container, .color-size {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  button.remove{
    background-color: transparent;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 0;
  }


  button.close{
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
    padding: .2rem;
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
    width: 50px;
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
