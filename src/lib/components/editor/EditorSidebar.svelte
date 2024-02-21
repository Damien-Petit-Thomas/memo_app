<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Grid, { GridItem } from "svelte-grid-extended";
  import reset from "$lib/assets/reset.png";
  let griditems = [];
  let itemsBackup = [];
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
      showStylesSelection = false;
      dispatch("selectItem", [item]);
    }
  }

  function handleStyleClick(e) {
    currentItem.style = e.css;
    currentItem.style_id = e.id;

    dispatch("selectItem", [currentItem]);
    showStylesSelection = false;
  }

  const itemSize = { height: 40 };

  function resetGrid() {
    griditems = structuredClone(itemsBackup);
  }

  let gridController;

  let count = 0;

  for (const item of items) {
    item.x = 0;
    item.y = count;
    item.w = 10;
    item.h = 1;
    count++;
    griditems.push(item);
    if (griditems.length === items.length) {
      itemsBackup = structuredClone(griditems);
    }
  }

  function saveLayout() {
    itemsBackup = structuredClone(griditems);
  }
</script>

<div class="wrapper">
  <section>
    <button id="saveMemo" on:click={() => dispatch("saveMemo")}>
      Sauvegarder</button
    >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="reset" on:click={resetGrid}>
      <!-- <a target="_blank" href="https://icons8.com/icon/BUtO0i9u8bcs/rendez-vous-p%C3%A9riodique">Rendez-vous périodique</a> icône par <a target="_blank" href="https://icons8.com">Icons8</a> -->
      <img src={reset} alt="reset" />
      <!-- <a target="_blank" href="https://icons8.com/icon/18765/sauvegarder">Sauvegarder</a> icône par <a target="_blank" href="https://icons8.com">Icons8</a> -->
      <!-- svelte-ignore missing-declaration -->
      <!-- <img src={save} on:click={saveLayout} alt="save layout"> -->
    </div>
    <Grid
      {itemSize}
      gap={8}
      cols={10}
      collision="push"
      bind:controller={gridController}
    >
      {#each griditems as item (item.id)}
        <!--  on met en place un delay pour ajouter un effet de transition -->
        <!--  sur l'ajout d'un item -->

        <div transition:fade={{ duration: 300 }}>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="grid-container">
            <GridItem
              class="grid-item sidebar-item"
              previewClass="prev"
              id={item.id}
              bind:x={item.x}
              bind:y={item.y}
              bind:w={item.w}
              bind:h={item.h}
            >
              <div slot="moveHandle" let:moveStart>
                <div class="move-handle" on:pointerdown={moveStart}></div>
              </div>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="item"
                aria-roledescription="item"
                on:click={() => handleCLick(item)}
              >
                {item.name}
              </div>
            </GridItem>
          </div>
        </div>
      {/each}
    </Grid>

    {#if showStylesSelection}
      <div class="card">
        {#if availableStyle.length > 0}
          <h3 class="choice-title">choix du style</h3>
          <div class="style-item-wrapper">
            {#each availableStyle as style}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="grid-item sidebar-item style-item"
                aria-roledescription="style"
                on:click={handleStyleClick(style)}
              >
                {style.name}
              </div>
            {/each}
          </div>
        {:else}
          <p class="no-styles">No styles available</p>
        {/if}
      </div>
    {/if}
  </section>
</div>

<style>


  @keyframes slide-bottom {
    0% {
      transform: translateY(-1000%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .choice-title {
    margin-bottom: 1rem;
  }

  .style-item-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .style-item {
    padding: 0.5rem 1.5rem;
  }

  .reset {
    display: flex;
    width: 15px;
    height: 15px;
  }

  .grid-container:hover {
    background-color: #00d0ff !important;
  }
  .reset img:hover {
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #565656;
  }

  :global(.grid-item.sidebar-item) {
    color: #00d0ff;
    font-weight: 700;
    background-color: #1b1f2a;
    border: 1px solid #565656;
    transition: background-color 0.3s;
  }

  :global(.grid-item.sidebar-item:hover) {
    background-color: #00d0ff !important;
    color: #1b1f2a !important;
    cursor: pointer !important;
  }

  :global(.prev) {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .item {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .move-handle {
    position: absolute;
    width: 25px;
    height: 10px;
    border-radius: 0 0 5px 0;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgb(81, 77, 77);
  }

  .move-handle:hover {
    cursor: grab;
  }

  .wrapper {
    min-width: 15%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    border-right: 1px solid #565656;
    align-items: center;
  }
  section {
    position: fixed;
    width: 15%;
    padding-top: 20px;
    height: 100vh;
  }

  button#saveMemo {
    margin-bottom: 1rem;
  }

  button:hover {
    background-color: rgb(203, 232, 219);
    color: #4a535f;
  }

  .no-styles {
    margin-top: 1rem;
    color: gray;
  }
</style>
