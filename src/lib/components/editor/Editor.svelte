<script>
  import { fade } from "svelte/transition";
  import Grid, { GridItem } from "svelte-grid-extended";

  import EditableItem from "$lib/components/editor/EditorEditableItem.svelte";
  import { memoItems, currentMemo } from "$lib/stores/index.js";
  export let isDeleted = false;
  let items = [];
  export let getLayout = false;
  let gridController;
  let done = false;
  export let newItem = {};
  $: if (newItem.id) {
    addNewItem(newItem);
  }

  if ($currentMemo.layout) {
    for (let i = 0; i < $currentMemo.layout.length; i += 1) {
      items[i] = { ...$currentMemo.layout[i], ...$currentMemo.contents[i] };
    }
    done = true;
  }

  $: if (done) {
    memoItems.set(items);
  }
  let itemWidth;
  let itemHeight;


  const itemsBackup = structuredClone(items);
  function resetGrid() {
    items = structuredClone(itemsBackup);
  }
  function remove(id) {
    items = items.filter((i) => i.id !== id);
    memoItems.update((items) => items.filter((item) => item.id !== id));
  }

  const itemSize = { height: 50 };

  $: title = {
    content: $currentMemo?.title || "titre",
    name: "title",
  };

  function handleValue(item) {
    return item.content !== undefined
      ? item.content
      : (item.content = item.name);
  }

  function addNewItem(item) {
    const w = 100;
    const h = 1;
    const newPosition = gridController.getFirstAvailablePosition(w, h);
    items = newPosition
      ? [...items, { x: newPosition.x, y: newPosition.y, w, h, ...item }]
      : items;
    memoItems.update((items) => [
      ...items,
      {
        x: newPosition.x,
        y: newPosition.y,
        w,
        h,
        itemHeight,
        itemWidth,
        ...item,
      },
    ]);
  }

  $: if (getLayout) {
    memoItems.set(items);
  }

  $: items.forEach((item) => {
    if(item.type.name ==='image') return;
    if (item.itemHeight / item.h > 50) {
      while (item.itemHeight / item.h > 50) {
        item.h += 1;
        console.log(item.h)
      }
    }
    if (item.w === 0) item.w = 1;
    if (item.itemWidth / item.w > 100 && item.w < 10) {
      while (item.itemWidth / item.w > 100 && item.w < 10) {
        item.w += 1;
        console.log(item.w)
        console.log(item)
      }
    }
  });
</script>

<div class="wrapper">
  <EditableItem item={title} value={handleValue(title)} {isDeleted} />
  <!-- <button class="btn" on:click={addNewItem}>Add New Item</button>
  <button class="btn" on:click={resetGrid}>Reset Grid</button> -->
  <Grid
    {itemSize}
    gap={2}
    cols={100}
    rows={100}
    collision="push"
    bind:controller={gridController}
  >
    {#each items as item (item.id)}
      <div transition:fade={{ duration: 300 }}>
        <GridItem
          class="grid-item item-editor"
          activeClass="active"
          id={item.id}
          bind:x={item.x}
          bind:y={item.y}
          bind:w={item.w}
          bind:h={item.h}

        >
        <div slot="moveHandle" let:moveStart>
          <div class="move-handle" on:pointerdown={moveStart}></div>
        </div>
          <button
            on:pointerdown={(e) => e.stopPropagation()}
            on:click={() => remove(item.id)}
            class="remove"
          >✕</button>
        
          <div
            class="item"
            bind:offsetWidth={item.itemWidth}
            bind:offsetHeight={item.itemHeight}
          >
            <div class="wrapper2">
              <EditableItem {item} value={handleValue(item)} />
            </div>
          </div>
        </GridItem>
      </div>
    {/each}
  </Grid>
</div>

<style>

.wrapper2{
  white-space: pre-wrap;
  height: fit-content;
}



  .item {
  }



  .move-handle {
    position: absolute;
    width: 100%;
    height: 5px;
    border-radius: 0 0 5px 0;
    top: 0;
    right: 0;
    z-index: 1;
    background-color: transparent;
  }  
  .move-handle:hover {
    background-color: #2196f3;;
    cursor: move;
  }
  :global(.grid-item.item-editor) {
   
    height: fit-content !important;
    position: relative;
    cursor: text !important;
  }

  :global(.active) {
    border-color: #2196f3;
    background: transparent;
  }

  .remove {
    cursor: pointer;
    position: absolute;
    background-color: transparent;
    right: 0;
    top: 0;
    z-index: 100;
  }

  .remove:hover {
    color: #f00;
  }

  .wrapper {
    border-left: 1px solid #818181;
    border-right: 1px solid #818181;
    height: 1000vh;
    display: flex;
    flex-direction: column;
    min-width: 70%;
    background-color: rgb(29, 32, 32);
    padding-bottom: 1rem;
  }
</style>
