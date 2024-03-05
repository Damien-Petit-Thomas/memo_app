<script>
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import Grid, { GridItem } from "svelte-grid-extended";
  import Code from "$lib/components/text/Code.svelte";
  import Paragraphe from "$lib/components/text/Paragraph.svelte";
  import Blockquote from "$lib/components/text/Blockquote.svelte";
  import Detail from "../../../lib/components/text/Detail.svelte";
  import NoteCard from "../../../lib/components/text/NoteCard.svelte";
  import Img from "../../../lib/components/text/Img.svelte";
  import { page } from "$app/stores";
  let isEditable = false;
  let currentPage = 1;
  let totalPage = 1;
  let title = "";
  import {
    currentMemo,
    fullmemos,
    memos,
    reloadNeeded,
    images,
  } from "$lib/stores/index.js";
  export let data;
  const slides = data.userSlide;

  let userId = data.user.id;
  const components = {
    image: Img,
    noteCard: NoteCard,
    code: Code,
    paragraphe: Paragraphe,
    detail: Detail,
    blockquote: Blockquote,
  };
  onMount(async () => {
    if ($images.length === 0 && userId) {
      await images.get(userId);
    }
  });
  let items = [];
  let copySlide;
  let mainSlide;
  let slide = [];
  let pageSlug;

  const unsubscribe = page.subscribe(async ($page) => {
    if ($fullmemos.length === 0) {
      fullmemos.get(userId);
    }
    pageSlug = $page.params.slug;
    mainSlide = await slides.find((s) => s.slug === pageSlug);
    title = mainSlide.title;
    slide = await $fullmemos.filter((s) => s.slideId === mainSlide.id);
    totalPage = slide.length;

    if (slide) {
      for (let i = 0; i < slide.length; i++) {
        slide[i].contents.sort((a, b) => a.position - b.position);
        slide[i].layout.sort((a, b) => a.position - b.position);
        for (let j = 0; j < slide[i].layout.length; j++) {
          items[i] = [{
            ...slide[i].layout[j],
            ...slide[i].contents[j],
            finalCSS: slide[i].contents[j].css + slide[i].contents[j].style.css,
          }];
        }
      }
    }
  });
 $: console.log(items);
  let backgroundURL = "";
  $: if (slide[currentPage - 1] && slide[currentPage - 1].backgroundId) {
    backgroundURL = $images.filter(
      (img) => img.id === slide[currentPage - 1].backgroundId,
    )[0].original;
  }

  onDestroy(unsubscribe);


const handlePrev = () => {
  if (currentPage > 1) {
    currentPage -= 1;
  }
};

const handleNext = () => {
  if (currentPage < totalPage) {
    currentPage += 1;
  } 
};



  let itemSize = { height: 20 };
  let slideHeight = 0;
  let slideWidth = 0;
  let slideMargin = 0;
  $: if (slideWidth / slideHeight > 1.77 || slideWidth / slideHeight < 1.76) {
    if (slideWidth / slideHeight > 1.77) {
      slideMargin -= 1;
    } else {
      slideMargin += 1;
    }
  }
</script>

<div class="slide-title">
  {title}
</div>

<div>
  <button on:click={handlePrev}>Previous</button>
  <button on:click={handleNext}>Next</button>
  <p>Page {currentPage}/{totalPage}</p>
</div>
<div class="slide-container">
  <div class="slide" style="background-image: url({backgroundURL});">
    <div class="slide-wrapper">
      <Grid
        readOnly={true}
        class="grid"
        {itemSize}
        gap={2}
        cols={40}
        rows={0}
        collision="none"
      >
        {#each items[currentPage  - 1] as item (item.id)}
          <GridItem
            previewClass="preview"
            activeClass="active read-only"
            class="grid-item read-only"
            id={item.id}
            bind:x={item.x}
            bind:y={item.y}
            bind:w={item.w}
            bind:h={item.h}
          >
            <div
              class="item"
              bind:offsetWidth={item.itemWidth}
              bind:offsetHeight={item.itemHeight}
            >
              {#if components[item.type.name]}
                <svelte:component
                  this={components[item.type.name]}
                  {isEditable}
                  value={item.content}
                  css={item.finalCSS}
                />
              {:else}
                <p>{item.content}</p>
              {/if}
            </div>
          </GridItem>
        {/each}
      </Grid>
    </div>
  </div>
</div>

<style>
  .slide-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10vh;
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    background-color: #fff;
    border-bottom: 1px solid #000;
  }

  .slide-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  .slide {
    background-size: cover;
    background-position: center;
    width: 1000px;
    height: 562px;
    border: 1px solid #000;
    border-radius: 2px;
  }
</style>
