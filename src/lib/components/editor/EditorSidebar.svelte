<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let items;
  export let styles;
  let showStylesSelection = false;
  let availableStyle = [];
  let currentItem;
  function showStyles(item) {
    availableStyle = styles.filter((style) =>
      item.available_style.includes(style.id),
    );
    showStylesSelection = true;
  }

  function handleCLick(item) {
    if (item.available_style !== null) {
      currentItem = item;
      showStyles(item);
    } else {
      dispatch("selectItem", [item]);
    }
  }

  function handleStyleClick(e) {
    currentItem.style = e.css;
    currentItem.style_id = e.id;

    dispatch("selectItem", [currentItem]);
    showStylesSelection = false;
  }
</script>

<section>
  <button id="saveMemo" on:click={() => dispatch("saveMemo")}
    >Sauvegarder</button
  >
  <div class="content-type-container">
    {#each items as item (item.id)}
    {#if item.name !== "warning" && item.name !== "summary"}
        <button on:click={() => handleCLick(item)}>
          {item.name}
        </button>
    {/if}
    {/each}
  </div>

  {#if showStylesSelection}
    <div class="card">
      {#if availableStyle.length > 0}
        <h3>choix du style</h3>
        {#each availableStyle as style}
          <div class="style-item">
            <button on:click={handleStyleClick(style)}>{style.name}</button>
          </div>
        {/each}
      {:else}
        <p class="no-styles">No styles available</p>
      {/if}
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    gap: 5rem;
  }

  .content-type-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    widows: 100%;
  }

  button#saveMemo {
    margin-bottom: 1rem;
  }

  button:hover {
    background-color: rgb(203, 232, 219);
    color: #4a535f;
  }

  .style-item {
    margin-bottom: 0.5rem;
  }

  .no-styles {
    margin-top: 1rem;
    color: gray;
  }
</style>
