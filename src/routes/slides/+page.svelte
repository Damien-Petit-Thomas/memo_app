<script>
  export let data;
  import Card from "$lib/components/card/Card.svelte";

  import { fullmemos } from '$lib/stores/index.js'
    import { slide } from 'svelte/transition';
  const slides = data.userSlide
 slides.map((slide) => slide.type ="slide")
</script>

<div>
  {#each slides as memo}
    <Card {memo} />
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  @media (max-width: 768px) {
    div {
      flex-direction: column;
    }
  }
</style>