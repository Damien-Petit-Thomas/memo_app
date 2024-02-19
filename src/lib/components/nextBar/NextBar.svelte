<script>
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { fullmemos } from "$lib/stores/index.js";
  import Card from "$lib/components/card/Card.svelte";
  import next from "$lib/assets/next.png";
  export let totalPage;
  export let currentPage;

  const dispatch = createEventDispatcher();

  $: dispatch("changePage", currentPage);


</script>

<div class="container_nextbar">
  {#if currentPage > 1}
    <div
      class="container container-preview"
      transition:fade
    >
      
      <img
        on:click={() => (currentPage -= 1)}
        class="preview"
        src={next}
        alt="fleche droite"
      />

      <span>{currentPage}/{totalPage}</span>
    </div>
  {/if}

  {#if currentPage < (totalPage - 1)}
    <div  transition:fade class="container container-next">
      <span>{currentPage + 1}/{totalPage}</span>
      <img on:click={() => (currentPage += 1)} src={next} alt="fleche droite" />
    </div>
  {/if}
</div>

<style>
  .container {
    vertical-align: baseline;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 10px;
    background-color: #c2c2c2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    width: 100px;
    height: 50px;
    color: #333;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #f5f5f5;
  }

  .container-preview {
    margin-right: auto;
  }

  .container-next {
    margin-left: auto;
  }

  .container_nextbar {
    background-color: #1b1f2a;
    display: flex;

    width: 100%;
  }

  img {
    /* on assombrit l'image */
    filter: brightness(0.5);
    width: 40px;
  }

  img:hover {
    cursor: pointer;
    /* on remet l'image à la normale */
    filter: brightness(0.6);
  }

  img:active {
    /* on assombrit l'image */
    filter: brightness(0.3);
  }

  img.preview {
    /* on tourne l'image de 180° */
    transform: rotate(180deg);
  }
</style>
