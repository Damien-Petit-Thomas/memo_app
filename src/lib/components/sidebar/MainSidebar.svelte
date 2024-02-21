<!-- Sidebar.svelte -->

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { memos, categories} from '$lib/stores/index.js';
  export let data;
  const userId = data?.user.id;
  let categoryStates = {};
  const dispatch = new createEventDispatcher();
  onMount(async () => {
    if ($categories.length === 0) {
      await categories.get(userId);
    }
    if ($memos.length === 0) {
      memos.get(userId);
    }
    $categories.sort((a, b) => a.name.localeCompare(b.name));
    $categories.forEach((category) => {
      categoryStates[category.id] = false;
    });
  });
  
  
 
  const getMemos = async () => {
    const response = await fetch('/api/memo');
    return response.json();
  };

  function toggleMemo(category) {
    categoryStates[category.id] = !categoryStates[category.id];
    dispatch('showMemos', category  );
  }
</script>
<div class="wrapper">
  <section class="sidebar">
    {#each $categories as category (category)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
      class="category"
      on:click={() => toggleMemo(category)}
      style="border-left: {category.color} solid 6px;"
      >
        <h2>
          {#if category.name.length > 15}
            {category.name.slice(0, 15)}...
          {:else}
            {category.name}
          {/if}
          
          <button class:expanded={categoryStates[category.id]} >
            ▶
          </button>
  
        </h2>
        {#if categoryStates[category.id]}
        <div transition:fade class="memo" class:expanded={categoryStates[category.id]}  >
          {#each $memos.filter(memo => memo.category_id === category.id) as memo}
            <div>
              {#if memo.title.length > 15}
                
                <a href="/memo/{memo.slug}">{memo.title.slice(0, 15)}...</a>
              {:else}
              <a href="/memo/{memo.slug}">{memo.title}</a>
              {/if}
            </div>
          {/each}
        </div>
  
        {/if}
      </div>
    {/each}
  </section>
</div>






<style>
  .wrapper {
  background: #1b1f2a;
    overflow: scroll;
    min-width: 15%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .sidebar {
    width:15vw;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    height: fit-content;
  }
  button {
    float: right;
    background-color: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform 0.4s ease-in-out;
    margin: 0;
    padding: 0;
  }

  button.expanded {
    transform: rotate(90deg);
  }

h2 {
  font-size: 1rem;
}

  .category {
    max-width: 95%;
    cursor: pointer;
    padding: 6px 8px 6px 16px;
    text-decoration: none;
    color: #818181;
    display: block;
  }


  .category:hover {
    color: #f1f1f1;
  }

  .memo {
    padding-left: 16px;
    max-height: 0;
    transition: max-height 0.4s ease-in-out;
  }

  .memo.expanded {
    max-height: 1000px; /* Adjust this value based on your content */
  }

  .memo > div {
    margin-bottom: 8px; /* Spacing between memo items */
  }
</style>
