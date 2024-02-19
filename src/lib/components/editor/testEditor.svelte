<script>
  import { fade } from "svelte/transition";
  import Grid, { GridItem } from "svelte-grid-extended";
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import EditableItem from "$lib/components/editor/EditorEditableItem.svelte";
  import { memoItems, currentMemo } from "$lib/stores/index.js";
  export let isDeleted = false;
  let items = [];
  let initialLayout = [];
  export let getLayout = false;
  let gridController;
  let done = false;
  export let newItem = {};
// quand newItem est nouveau on appelle le fonction addNewItem
  $: if (newItem.id) {
    addNewItem(newItem);
  }

if($currentMemo.layout ) {
  for(let i =0; i < $currentMemo.layout.length; i+=1) {
    items[i] = {...$currentMemo.layout[i],  ...$currentMemo.contents[i]}

  }
  done = true;
}

$: if (done){
  memoItems.set(items);
}




	const itemsBackup = structuredClone(items);
	function resetGrid() {
		items = structuredClone(itemsBackup);
	}
	function remove(id) {
		items = items.filter((i) => i.id !== id);
    memoItems.update((items) => items.filter((item) => item.id !== id));
  }

const itemSize = { height: 120 };



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
		const w = 10;
		const h= 1;
		const newPosition = gridController.getFirstAvailablePosition(w, h);
		items = newPosition
			? [...items, {  x: newPosition.x, y: newPosition.y, w, h, ...item }]
			: items;
      memoItems.update((items) => [...items, {  x: newPosition.x, y: newPosition.y, w, h, ...item }]);
	}

  $: if (getLayout) {
    memoItems.set(items);
  }
</script>
<div class="wrapper">
  <EditableItem item={title} value={handleValue(title)} {isDeleted} />
  <!-- <button class="btn" on:click={addNewItem}>Add New Item</button>
  <button class="btn" on:click={resetGrid}>Reset Grid</button> -->
  <Grid {itemSize} cols={10} collision="push" bind:controller={gridController}>
	{#each items as item (item.id)}
		<div transition:fade={{ duration: 300 }}>
			<GridItem 
      class="grid-item"
      activeClass="active"
      id={item.id} bind:x={item.x} bind:y={item.y} bind:w={item.w} bind:h={item.h}>
				<button
					on:pointerdown={(e) => e.stopPropagation()}
					on:click={() => remove(item.id)}
					class="remove"
				>
					✕
				</button>
				<div class="item">
          <EditableItem
          {item}
          value={handleValue(item)}
          />
        </div>
			</GridItem>
		</div>
	{/each}
</Grid>


</div>

<style>

.item{
  height: fit-content;
}


 :global(.grid-item) {
    background-color:transparent !important; 
    border-bottom: 1px solid #818181;
    position: relative;
    width: fit-content;
  }
  :global(.grid-item) {
    cursor:text !important;
  }

:global(.active) {
    border-color: #2196f3;
    background: transparent;
  }


	.remove {
		cursor: pointer;
		position: absolute;
    background-color: transparent;
		right: 10px;
		top: 3px;
	}

.remove:hover {
    color: #f00;
  }



	.btn {
		margin-top: 10px;
		margin-left: 10px;
		right: 2px;
		top: 1px;
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
  .editor {
    height: 1000vh;
    display: flex;
    flex-direction: column;
    min-width: 70%;
    background-color: rgb(29, 32, 32);
  }
  .handle {
    /* position: absolute; */
    left: 50%;
    width: 1em;
    height: 0.25em;
    margin: 0 auto;
    background-color: rgba(211, 211, 211, 0.144);
    transition: cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
  }
  .handle:hover {
    scale: 3;
  }

  button.delete {
    position: relative;
    background-color: transparent;
    background-image: url($lib/assets/remove.svg);
    background-repeat: no-repeat;
    border: none;
    border-radius: 5%;
    font-size: 0.5em;
  }

  button.delete:hover {
    background-color: rgb(153, 75, 75);
  }
</style>
