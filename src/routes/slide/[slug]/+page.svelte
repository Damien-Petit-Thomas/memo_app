<script>
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import Grid, { GridItem } from "svelte-grid-extended";
  import NextBar from "$lib/components/nextBar/NextBar.svelte";
  import { elasticOut } from "svelte/easing";
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
  import { currentSlide, fullmemos, images } from "$lib/stores/index.js";
  export let data;
  const userSlides = data.userSlide;

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
    return () => {
      currentSlide.set([]);
    };
  });
  let items = [];
  let mainSlide;
  let slides = [];
  let pageSlug;

  let urls = []
  const unsubscribe = page.subscribe(async ($page) => {
    if ($fullmemos.length === 0) {
      fullmemos.get(userId);
    }
    pageSlug = $page.params.slug;
    mainSlide = await userSlides.find((s) => s.slug === pageSlug);
    title = mainSlide.title;
    slides = await $fullmemos.filter((s) => s.slideId === mainSlide.id);
    totalPage = slides.length;
    if (slides) {
      slides.sort((a, b) => a.page - b.page);
      for (let i = 0; i < slides.length; i++) {
        slides[i].contents.sort((a, b) => a.position - b.position);
        slides[i].layout.sort((a, b) => a.position - b.position);
        items[i] = [];
        urls[i] = slides[i].backgroundId ? slides[i].backgroundId : '';
        for (let j = 0; j < slides[i].contents.length; j++) {
          // on push les  url des images dans un tableau
      
          items[i][j] = {
            ...slides[i].layout[j],
            ...slides[i].contents[j],
            id: slides[i].contents[j].id,
            finalCSS:
              slides[i].contents[j].css + slides[i].contents[j].style.css,
            slideTitle: title,
            transition: slides[i].contents[j].customTransition[0],
            duration: slides[i].contents[j].customTransition[1],
            delay: slides[i].contents[j].customTransition[2],
            customTransition: slides[i].contents[j].customTransition,
            memoId: slides[i].id,
            category: slides[i].category.id,
            backgroundId: slides[i].backgroundId,
            tags: slides[i].tags,
            page: slides[i].page,
          };
        }
      }
      currentSlide.set(items);
      // backgroundURL = items[currentPage - 1][0].backgroundId;
    }
  });

  onDestroy(() => {
    unsubscribe();
  });


$: isDefined = $images.filter((img) => img.id === urls[currentPage - 1])[0] !== undefined ? true : false;
let backgroundURL = "";
$: if(isDefined === true){

      backgroundURL = $images.filter((img) => img.id === urls[currentPage - 1])[0].original;
  }
  else{
    backgroundURL = "";
  }












  let itemSize = { height: 20 };











  function animate(
    node,
    { transition, delay = 0, duration = 15000, x = -200, y = 0 },
  ) {
    console.log("animate");
    switch (transition) {
      case "aucune":
        return;
      case "":
        return;
      case "fade":
        return fadeTransition(node, { delay, duration });
      case "slide":
        return slideTransition(node, { delay, duration, x, y });
      case "scale":
        return scaleTransition(node, { delay, duration });
      case "blur":
        return blurTransition(node, { delay, duration });
      default:
        break;
    }
  }

  function blurTransition(node, { delay, duration }) {
    const initialBlur = 0;
    const finalBlur = 5;
    const eased = (t) => t;
    return {
      delay,
      duration,
      css: (t) =>
        `filter: blur(${eased(t) * finalBlur + (1 - eased(t)) * initialBlur}px)`,
    };
  }

  function scaleTransition(node, { delay, duration }) {
    const initialScale = 0;
    const finalScale = 1;
    const eased = (t) => elasticOut(t);
    return {
      delay,
      duration,
      css: (t) =>
        `transform: scale(${eased(t) * finalScale + (1 - eased(t)) * initialScale})`,
    };
  }

  function fadeTransition(node, { delay, duration }) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      css: (t) => `opacity: ${t * o}`,
    };
  }
  // Fonction d'interpolation (éasing) cubic bézier
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function slideTransition(node, { delay, duration }) {
    const initialOpacity = 0;
    const finalOpacity = 1;
    // const eased = (t) => easeInOutCubic(t);
    const eased = (t) => elasticOut(t);
    return {
      delay,
      duration,
      css: (t) => `
      transform: translateX(${(1 - eased(t)) * 100}%);
      opacity: ${t * finalOpacity + (1 - t) * initialOpacity};
    `,
    };
  }
</script>

<div class="slide-container">
  <div class="slide-title">
    {title}
  </div>
  <div class="main-container">
    <div class="option-container">
      <a href="/admin/editor/slides"><button>éditer</button></a>
      <button
        on:click={() => {
          const elem = document.querySelector(".slide");
        }}>plein écran</button
      >
    </div>
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
          {#each items[currentPage - 1] as item (item.id)}
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
                transition="slide"
                in:animate={{
                  transition: item.transition,
                  duration: item.duration,
                  delay: item.delay,
                }}
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
  <div class="next-container">
    <NextBar
      on:changePage={(e) => {
        currentPage = e.detail;
      }}
      {totalPage}
      {currentPage}
    />
  </div>
</div>

<style>
  .option-container {
    display: flex;
    justify-content: space-between;
  }

  .next-container {
    margin-bottom: 3rem;
    width: 20%;
  }

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
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
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
