<script>
export let memo = null;
import { kind } from '$lib/stores/index.js';
</script>



<div class="card">
  <slot/>
  {#if memo !== null}
  
  <a href="/{$kind}/{memo.slug}">{memo.title}</a>
  {/if}
</div>




<style>
  .card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: center;
    border: 1px solid darkgrey;
    border-radius: 5px;
    height: 5rem;
    width: var(--width, 30%);
    margin: var(--margin, 1rem);
    /* padding: var(--padding, 2.5rem); */
    transition: .3s;
  }
.card > a {
  width:100%;
  padding: 1rem;
  text-decoration: none;
}

  .card:hover{
    border: 1px solid var(--color, #ddd);
    box-shadow: 0 0 10px var(--color, #ddd);
    font-weight: bold;
    color:white;
  }





  
</style>