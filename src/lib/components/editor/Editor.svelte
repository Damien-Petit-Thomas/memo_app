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


  $: title = {
    content: $currentMemo?.title || "titre",
    name: "title",
  };

  function handleValue(item) {
    return item.content !== undefined
      ? item.content
      : (item.content = item.name);
  }
  $: if (getLayout) {
    memoItems.set(items);
  }

  $: items.forEach((item) => {
    if (item.itemHeight / item.h > 18) {
      while (item.itemHeight / item.h > 18) {
        console.log("ratio", Math.round(item.itemHeight / item.h));
        item.h += 1;
      }
    }
    if ((item.itemWidth / item.w < 20)  && item.w < 40) {
      while (item.itemWidth / item.w < 25 && item.w < 40) {
        item.w += 1;
        console.log(item.w)
        console.log(item.itemWidth)
      }
    }
  });
  function addNewItem(item) {
    const w = 40;
    const h = 2;
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

  let itemSize = { height: 20 };



</script>

<div class="wrapper">
  <EditableItem item={title} value={handleValue(title)} {isDeleted} />
  <!-- <button class="btn" on:click={addNewItem}>Add New Item</button>
  <button class="btn" on:click={resetGrid}>Reset Grid</button> -->
  <Grid
    class="grid"
    {itemSize}
    gap={2}
    cols={40}
    rows={0}
    collision="none"
    bind:controller={gridController}
  >
    {#each items as item (item.id)}
      <div transition:fade={{ duration: 300 }}>
        <GridItem
          class="grid-item item-editor"
          activeClass="active"
          previewClass="preview editor"
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
          bind:offsetHeight={item.itemHeight}>
          <EditableItem {item} value={handleValue(item)}       
          />
        </div>
        {item.itemWidth} {item.w}  {item.itemHeight} {item.h}
        </GridItem>
      </div>
    {/each}
  </Grid>
</div>

<style>



.item{
  background-color: rgba(0, 0, 0, 0.133);
  border: 1px solid transparent;
}

.item:hover{
  border: 1px dashed brown;
}


:global(.preview.editor) {
  border: 5px solid #2196f3;
  background-color: rebeccapurple !important;
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
    /* background-color: rgb(29, 32, 32); */
    padding-bottom: 1rem;
  }
</style>
