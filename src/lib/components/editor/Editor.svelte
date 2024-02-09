<script>
  import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import EditableItem from "$lib/components/editor/EditorEditableItem.svelte";
  import { memoItems, currentMemo} from '$lib/stores/index.js';
  export let isDeleted = false;

  $: title = {
    content: $currentMemo?.title || "titre",
    name: "title",
  };

  const flipDurationMs = 200;
  let dragDisabled = true;
  let deletedItems = [];
  
  function handleConsider(e) {
    const { items: newItems, info: { source, trigger } } = e.detail;
    
    memoItems.set(newItems); 
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }
  
  function handleFinalize(e) {
    const { items: newItems, info: { source } } = e.detail;
    memoItems.set(newItems);  
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  }
  
  function startDrag(e) {
    e.preventDefault();
    dragDisabled = false;
  }
  
  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
  }
  
  
  
  function deleteItem({ id }) {
    memoItems.update(items => items.filter(item => item.id !== id));
  }
  
  
  function handleValue(item) {

  return  item.content !== undefined ? item.content : item.content = item.name
  }
  
  
  
  
  
</script>

<div class="wrapper">
  <EditableItem item={title} value={handleValue(title)} {isDeleted}   />

  <section class="editor"
  use:dndzone="{{ items: $memoItems, dragDisabled, flipDurationMs }}"
  on:consider="{handleConsider}"
  on:finalize="{handleFinalize}">
  
  {#each $memoItems as item (item.id)}
  <div animate:flip="{{ duration: flipDurationMs }}">
    <button 
    class="delete" 
    on:click={() => deleteItem(item)}>
  </button>
  {#if !deletedItems.includes(item)}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="container">
    <div tabindex={dragDisabled ? 0 : -1}
    aria-label="drag-handle"
    class="handle"
    style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
    on:mousedown={startDrag}
    on:touchstart={startDrag}
    on:keydown={handleKeyDown} />
    <EditableItem
    {item}
    value={handleValue(item)}
    />
  </div>
  {/if}
</div>
{/each}
</section>
</div>

<style>
  
  
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
    margin : 0  auto ;
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
    border : none;
    border-radius: 5%;
    font-size: 0.5em;
  }
  
  button.delete:hover {
    background-color:rgb(153, 75, 75);
    
  }
  
  
</style>