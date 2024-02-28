<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import hljs from "highlight.js";
  import markdownit from "markdown-it";
  import Grid, { GridItem } from "svelte-grid-extended";
  import MainSidebar from "$lib/components/sidebar/MainSidebar.svelte";
  import Code from "$lib/components/text/Code.svelte";
  import Toc from "$lib/components/sidebar/Toc.svelte";
  import Paragraphe from "$lib/components/text/Paragraph.svelte";
  import Blockquote from "$lib/components/text/Blockquote.svelte";
  import Detail from "../../../lib/components/text/Detail.svelte";
  import NoteCard from "../../../lib/components/text/NoteCard.svelte";
  import Img from "../../../lib/components/text/Img.svelte";
  import { page } from "$app/stores";
  import reset from "$lib/assets/reset.png";
import cadenas from "$lib/assets/cadenas.png";
  import openLock from "$lib/assets/cadenas-ouvert.png";
  import save from "$lib/assets/save.png";
  import burger from "$lib/assets/hamburger.png";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
import getNewColor from "$lib/utils/color.js";
  import {
    currentMemo,
    fullmemos,
    memos,
    reloadNeeded,
  } from "$lib/stores/index.js";
  let alertVisible = false;
  let typeAlert = "";
  let titleAlert = "";
  let messageAlert = "";
  let isReadOnly = false;
  function showAlert(type, title, msg) {
    typeAlert = type;
    titleAlert = title;
    messageAlert = msg;
    alertVisible = true;
    setTimeout(() => {
      alertVisible = false;
    }, 2000);
  }
  import NextBar from "$lib/components/nextBar/NextBar.svelte";
  let isEditable = false;
  let isLayout = false;
  let items = [];
  let itemsBackup = [];
  let gridController;
  let itemSize = { height: 20 };
let color, newColor;
  export let data;

  let userId = data.user.id;

  // Actual default values
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(lang, str, true).value
          }</code></pre>`;
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  });



  const components = {
    image: Img,
    noteCard: NoteCard,
    code: Code,
    paragraphe: Paragraphe,
    detail: Detail,
    blockquote: Blockquote,
  };

  let copyMemo;
  let pageSlug;
  let memo;
  let lexicon;
  let isDataReady = false;
  let currentMemoIdx;
  let itemWidth;
  let itemHeight;
  page.subscribe(async ($page) => {
    isDataReady = false;
    if(copyMemo) {
      console.log('copyMemo')
      copyMemo = {};
      items = [];
    }
    if ($fullmemos.length === 0) {
      await fullmemos.get();
    }
    // si il y a déjà un memo en cours on le vide
    if (currentMemo) {
      currentMemo.set({});
    }
    pageSlug = $page.params.slug;
    memo = $fullmemos.find((m) => m.slug === pageSlug);
    if (memo) {
      color = memo.category.color;
newColor = getNewColor(color, 50);
      currentMemoIdx = $fullmemos.findIndex((m) => m.slug === pageSlug);
      copyMemo = JSON.parse(JSON.stringify(memo));
      if (copyMemo.contents) {
        copyMemo.contents.forEach((item) => {
          if (item.type.name !== "code" && item.type.name !== "image") parseText(item);
        });

        // on classe les items par position
        // copyMemo.contents.sort((a, b) => a.position - b.position);
        // memo.contents.sort((a, b) => a.position - b.position);
        isDataReady = true;
let strong= document.querySelectorAll('strong');
        if (newColor)
        strong.forEach((s)=>{
          s.style.color = color;
          s.style.opacity = 0.65;
        })
        isLayout = false;
        if (copyMemo.layout !== null) {
          isLayout = true;
          for (let i = 0; i < copyMemo.layout.length; i++) {
            items[i] = {
              ...copyMemo.layout[i],
              itemHeight,
              itemWidth,
              data: copyMemo.contents[i],
            };
          }
          itemsBackup = structuredClone(items);
        }
      }
    } else {
      return;
    }
  });

function lockGrid() {
    isReadOnly = !isReadOnly;
  }

  function resetGrid() {
    items = structuredClone(itemsBackup);
  }

  async function saveGrid() {
    const newMemo = { ...memo, layout: items };
    const itemsToSave = newMemo.contents.map((item) => {
      return {
        content: item.content,
        type_id: item.type.id,
        styleId: item.style.id,
      };
    });
    const data = {
      title: newMemo.title,
      contents: itemsToSave,
      categoryId: newMemo.category.id,
      tagsIds: newMemo?.tags?.map((tag) => tag.id),
      userId,
      id: newMemo.id,
      layout: JSON.stringify(newMemo.layout),
    };
    const updatedMemo = await memos.mark(data);
    if (updatedMemo) {
      reloadNeeded.set(true);
      currentMemo.set({});
      currentMemo.set(newMemo);
      itemsBackup = structuredClone(items);
      showAlert(
        "success",
        "enregistrement reussi",
        `le nouveau layout de: ${newMemo.title} a été bien été enregistré`,
      );
    }
  }
  function parseText(item) {
    const markdownRenderedContent = md.render(item.content);
        const tocRegex = /<(h[1-6])>(.*?)<\/\1>/g;
    const modifiedLines = [];

    let match;
    let lastIndex = 0;

    while ((match = tocRegex.exec(markdownRenderedContent)) !== null) {
      const headerTag = match[1];
      const headerContent = match[2];
      const id = `${headerContent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const anchor = `<a name="  ${id}"></a>`;
      modifiedLines.push(
        markdownRenderedContent.substring(lastIndex, match.index) +
          `<${headerTag} style="color : ${color}" id="${id}">${anchor}${headerContent}</${headerTag}>`,
      );
      lastIndex = match.index + match[0].length;
    }

    // Add the remaining content after the last match
    modifiedLines.push(markdownRenderedContent.substring(lastIndex));

    // Join modified lines without applying markdown rendering
    item.content = modifiedLines.join("");
    lexicon = $page.data.lexicon;

    lexicon.forEach((wordObj) => {
      const word = wordObj.word;
      const regex = new RegExp(`\\b${word}\\b`, "g");
      if (item.content.match(regex) && !item.content.startsWith("<h")) {
        item.content = item.content.replace(
          regex,
          `<a href="/lexicon" id="lexical">${word}</a>`,
        );
      }
    });
  }

  // on attend que le dom soit chargé pour initialiser le grid





  $: currentMemo.set(memo);
  let showLayout = false;
  function showLayoutMenu() {
    showLayout = !showLayout;
  }
</script>
<!-- <svelte:document/> -->

      {#if alertVisible}
  <CustomAlert title={titleAlert} type={typeAlert} message={messageAlert} />
{/if}

<div class="container">
  <MainSidebar />
  <div class="container_main">
    <div class="content" contenteditable="false">
      {#if isDataReady}
        <div class="title-wrapper">
          <div class="layout-menu">
            <button id="burger" on:click={showLayoutMenu}
              ><img src={burger} alt="menu layout" /></button
            >
            {#if showLayout}
              <div
                class="layout-menu-btn"
                transition:fly={{ x: -50, duration: 200 }}
              >
                <button title="reset layout" id="reset" on:click={resetGrid}
                  ><img src={reset} alt="" />
                </button>
                <button title="save  layout" id="save" on:click={saveGrid}
                  ><img src={save} alt="" />
                </button>
<button
                  title={isReadOnly ? "unlock layout" : "lock lauout"}
                  id="lock"
                  on:click={lockGrid}
                  ><img
                    src={isReadOnly ? openLock : cadenas}
                    alt={isReadOnly ? "open lock" : "lock"}
                  />
                  <!-- <a href="https://www.flaticon.com/fr/icones-gratuites/fermer-a-cle" title="fermer à clé icônes">Fermer à clé icônes créées par Freepik - Flaticon</a> -->
                </button>
              </div>
            {/if}
          </div>
          <h2 id="memo-title">{copyMemo.title}</h2>
        </div>
        {#if copyMemo}
          {#if copyMemo.contents && !isLayout}
            {#each copyMemo.contents as content (content.id)}
              {#if components[content.type.name]}
                <svelte:component
                  this={components[content.type.name]}
                  {isEditable}
                  value={content.content}
                  css={content.style.css}
                />
              {:else}
                <p>{content.content}</p>
              {/if}
            {/each}
          {/if}
        {/if}
        {#if isLayout}
          <Grid
readOnly={isReadOnly}
          class="grid"
          {itemSize}
          gap={5}
          cols={40}
          rows={0}
          collision="none"
            >
            {#each items as item (item.id)}
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
                  {#if components[item.data.type.name]}
                    <svelte:component
                      this={components[item.data.type.name]}
                      {isEditable}
                      value={item.data.content}
                      css={item.data.style.css}
                    />
                  {:else}
                    <p>{item.data.content}</p>
                  {/if}
                </div>
              </GridItem>
            {/each}
          </Grid>
        {/if}
      {/if}
    </div>
    <div class="container_nextbar">
      <NextBar {currentMemoIdx} />
    </div>
  </div>
  <Toc title={copyMemo.title} doc={memo.contents} />
</div>

<style>

  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .title-wrapper h2 {
    margin-right: 40%;
  }

  .layout-menu {
    display: flex;
  }

  .layout-menu-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
      }

button#lock,
  button#reset,
  button#save,
  button#burger {
    background-color: transparent;
        cursor: pointer;
    width: 30px;
    height: 30px;
margin: 0;
  }
  button#reset img {
    width: 100%;
    height: 100%;
  }

  h2 {
    text-align: center;
    color: #bd9918;
  }

  .item {
    padding: 0;
    margin: 0;
  }
  :global(.grid-item.read-only) {
    border: none;
    height: fit-content !important;
  }

  :global(.preview) {
  z-index: 10 !important;
  border: 5px solid #2196f3;
  background-color: rebeccapurple !important;
}

  :global(.grid) {
    min-height: 100%;
    height: 100000vh;
  }

  :global(.active.read-only) {
    z-index: 11 !important;
    border: 1px solid #bd9918;
    padding: 0 !important;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100vh;
    max-width: 100vw;
  }

  .container_nextbar {
    width: 100%;
    padding: 1rem;
    display: flex;
    background-color: rgb(29, 32, 32);

    justify-content: center;
    border: 1px solid #818181;
  }
  .container_main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-width: 65%;
    height: fit-content;
    background-color: var(--color-primary-2);
  }

  .content {
padding: 0 3rem 0 3rem;
    border-left: 1px solid #94d2bd;
    border-right: 1px solid #94d2bd;
    display: flex;
    color: var(--color-primary-5);
    flex-direction: column;
    min-width: 100%;
    min-height: 95vh;
    height: fit-content;
    max-width: 80%;
  }

  :global(.content p) {
    font-family: "Roboto", sans-serif;
    font-size: 17px;
    word-spacing: normal;
    font-weight: 400;
  }




</style>
