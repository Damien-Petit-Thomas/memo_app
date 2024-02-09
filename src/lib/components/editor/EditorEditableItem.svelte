<script>
  import Code from "$lib/components/text/Code.svelte";
  import { memoItems, title } from "$lib/stores/index.js";
  import Detail from "$lib/components/text/Detail.svelte";
  import { onMount } from "svelte";
  import Paragraphe from "$lib/components/text/Paragraph.svelte";
  import Title from "$lib/components/text/Title.svelte";
  import Blockquote from "$lib/components/text/Blockquote.svelte";
  import DOMPurity from "dompurify";
  import NoteCard from "$lib/components/text/NoteCard.svelte";
  export let item, value, isDeleted = false ;
  let original;



$: if (isDeleted){

  isDeleted = false
  // on recharge la page
  window.location.reload()
}

  const css = item.style?.css !== undefined ? item.style.css : "";
  let content = item.content !== undefined ? item.content : item.name;

  const components = {
    noteCard: NoteCard,
    title: Title,
    detail: Detail,
    paragraphe: Paragraphe,
    blockquote: Blockquote,
    code: Code,
  };

  onMount(() => {
    original = value;
  });

  function saveContent(e) {
    let content = e.detail;
    if (content === "") {
      content = original;
    }
    if (content !== original) {
      if (item.name === "title") {
        title.update(() => content);
      } else {
        memoItems.update((items) => {
          const index = items.findIndex((memItem) => memItem.id === item.id);
          if (index !== -1) {
            items[index].content = DOMPurity.sanitize(content);
          }
          return items;
        });
      }
    }
  }
</script>

<div role="button" tabindex="0">
  {#if components[item.name]}
    <svelte:component
      this={components[item.name]}
      value={content}
      {css}
      on:contentEdited={saveContent}
    />
  {:else if components[item.type.name]}
    <svelte:component
      this={components[item.type.name]}
      value={content}
      {css}
      on:contentEdited={saveContent}
    />
  {:else}
    <p>{content}</p>
{/if}
</div>

<style>
  p {
    color: rgb(255, 255, 255);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    text-align: left;
  }
</style>
