<script>
  import { createEventDispatcher } from "svelte";
  import validation from "$lib/assets/verifier.png";
  export let x;
  export let y;
  let finalx = x - 200;
  let finaly = y + 100;
  let size = 17;
  let color = "#FFFFFF";
  let fontfamily = "Arial";

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




  const dispatch = createEventDispatcher();

 $:  css = `font-family: ${fontfamily}; font-size: ${size}px; color: ${color}`;


$: dispatch('css', { css });

</script>

<div
style="
position: fixed;
top: {finaly}px;
left: {finalx}px;"
class="caontainer"
>
  <div class="size">
    <label for="size">taile</label>
    <input type="range" id="size" min="1" max="300" bind:value={size} />

    <input type="text" bind:value={size} />
  </div>
  <input type="color" bind:value={color} />
  <select name="font" id="font" bind:value={fontfamily}>
    <option value="fontFamily">police</option>
    {#each fonts as font}
      <option value={font}>{font}</option>
    {/each}
  </select>

</div>

<style>
  .caontainer {
    background-color: #1b1f2a;
    border: 1px solid #565656;
    color: #00d0ff;
    padding: 1rem;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .size {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  input[type="text"] {
    width: 50px;
    height: 20px;
    border: none;
    background: none;
    color: white;
    text-align: center;
  }



</style>
