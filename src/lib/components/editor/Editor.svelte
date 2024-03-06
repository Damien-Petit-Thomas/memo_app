<script>
  import option from "$lib/assets/parametre.png";
  import { fade } from "svelte/transition";
  import Grid, { GridItem } from "svelte-grid-extended";
  import Submenu from "$lib/components/submenu/Submenu.svelte";
  import EditableItem from "$lib/components/editor/EditorEditableItem.svelte";
  import {
    memoItems,
    currentMemo,
    images,
    maj,
    currentSlide,
  } from "$lib/stores/index.js";
  export let isDeleted = false;
  let items = [];
  export let getLayout = false;
  let gridController;
  let position = 0;
  let content;
  let showSubmenu = false;
  export let isSlide = false;
  export let backUrlId;
  export let newItem = {};
  export let page = 1;

  $: if (newItem.id) {
    addNewItem(newItem);
  }
  let count = 0;
  $: if ($currentMemo?.layout && count === 0) {
    console.log('currentMemo', $currentMemo)
    count += 1;
    // on classe les par content.position de la plus petite à la plus grande
    $currentMemo.layout.sort((a, b) => a.position - b.position);
    $currentMemo.contents.sort((a, b) => a.position - b.position);
    position = $currentMemo.layout[$currentMemo.layout.length - 1].position + 1;
    for (let i = 0; i < $currentMemo.layout.length; i += 1) {
      items[i] = { ...$currentMemo.layout[i], ...$currentMemo.contents[i] };
    }
    memoItems.set(items);
  }


  $: if ($maj) {
    console.log('maj', $maj)
    items = $memoItems;
    maj.set(false);
  }

  let x;
  let y;
  let xo;
  let yo;
  let currentId;
  const submenu = (id, event) => {
    //  on veut la position de la souris par rapport à la fenêtre et par rapport à l'élément
    x = event.target.getBoundingClientRect().left;
    y = event.target.getBoundingClientRect().top;
    xo = event.clientX;
    yo = event.clientY;
    currentId = id;
    return (showSubmenu = !showSubmenu);
  };

  let itemWidth;
  let itemHeight;

  const itemsBackup = structuredClone(items);
  function resetGrid() {
    items = structuredClone(itemsBackup);
  }
  function remove(id) {
    memoItems.update((items) => items.filter((item) => item.id !== id));
    items = items.filter((i) => i.id !== id);
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
        item.h += 1;
      }
    }
    if (item.itemWidth / item.w < 20 && item.w < 40) {
      while (item.itemWidth / item.w < 25 && item.w < 40) {
        item.w += 1;
      }
    }
  });

  
  function addNewItem(item) {
    const w = 40;
    const h = 2;
    const newPosition = gridController.getFirstAvailablePosition(w, h);
    items = newPosition
      ? [
          ...items,
          { x: newPosition.x, y: newPosition.y, w, h, position, ...item },
        ]
      : items;
    memoItems.update((items) => [
      ...items,
      {
        x: newPosition.x,
        y: newPosition.y,
        w,
        h,
        content,
        position,
        itemHeight,
        itemWidth,
        ...item,
      },
    ]);

    position += 1;
  }

  let itemSize = { height: 20 };

  const handleCss = (e) => {
    items = items.map((item) => {
      if (item.id === currentId) {
        item.style.css = e.detail.css;
      }
      return item;
    });
  };

  $: backgroundUrl =
    backUrlId !== undefined
      ? $images.filter((image) => image.id === backUrlId)[0].original
      : "";
</script>

{#if showSubmenu}
  <Submenu on:css={handleCss} {x} {y} />
{/if}

<div
  class={isSlide ? "slide-wrapper" : "wrapper"}
  style="background-image: url({backgroundUrl})"
>
  {#if !isSlide}
    <EditableItem {page} item={title} value={handleValue(title)} {isDeleted} />
  {/if}
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
          activeClass={isSlide ? "active-slide" : "active"}
          previewClass={isSlide ? "preview-slide" : "preview"}
          id={item.id}
          bind:x={item.x}
          bind:y={item.y}
          bind:w={item.w}
          bind:h={item.h}
        >
          <div slot="moveHandle" let:moveStart>
            <div class="move-handle" on:pointerdown={moveStart}></div>
          </div>
          {#if !isSlide}
            <button
              on:pointerdown={(e) => e.stopPropagation()}
              on:click={() => remove(item.id)}
              class="remove">✕</button
            >
          {:else}
            <button
              on:pointerdown={(e) => e.stopPropagation()}
              on:click={(e) => submenu(item.id, e)}
              class="submenu"><img src={option} alt="sub-menu" /></button
            >
          {/if}
          <div
            class="item"
            bind:offsetWidth={item.itemWidth}
            bind:offsetHeight={item.itemHeight}
          >
            <EditableItem {item} value={handleValue(item)} />
          </div>
        </GridItem>
      </div>
    {/each}
  </Grid>
</div>

<style>
  .item {
    background-color: rgba(0, 0, 0, 0.133);
    border: 1px solid transparent;
  }

  .item:hover {
    /* background:rgb(139, 139, 139); */
    border: 1px dashed brown;
  }

  :global(.preview-slide) {
    background-color: rgb(102, 85, 119) !important;
  }

  :global(.preview) {
    background-color: rgb(102, 85, 119) !important;
  }
  .move-handle {
    position: absolute;
    width: 100%;
    height: 5px;
    border-radius: 0 0 5px 0;
    top: 10;
    right: 0;
    z-index: 1;
    background-color: transparent;
  }
  .move-handle:hover {
    background-color: #2196f3;
    cursor: move;
  }
  :global(.grid-item.item-editor) {
    height: fit-content !important;
    position: relative;
    cursor: text !important;
  }

  :global(.active) {
    border-color: #2196f3;
  }

  .remove {
    cursor: pointer;
    position: absolute;
    background-color: transparent;
    right: 0;
    top: -10px;
    z-index: 100;
  }

  .remove:hover {
    color: #f00;
  }

  .submenu {
    cursor: pointer;
    position: absolute;
    background-color: transparent;
    right: 0;
    top: -10px;
    z-index: 100;
  }

  .submenu img {
    width: 20px;
    height: 20px;
  }

  .submenu:hover img {
    filter: invert(50%);
  }

  .submenu:hover {
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

  .slide-wrapper {
    background-size: cover;
    background-position: center;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 70%;
    padding-bottom: 1rem;
  }
</style>
