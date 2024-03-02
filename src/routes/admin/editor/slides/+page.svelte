<script>
  import Editor from "$lib/components/editor/Editor.svelte";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
  import { onMount } from "svelte";
  import ImageGallery from "@react2svelte/image-gallery";
  import Sidemenu from "$lib/components/editor/SlideSidebar.svelte";
  import { memoItems, memos, fullmemos, reloadNeeded } from "$lib/stores/index.js";
  import EditorSidebarTagNCategory from "$lib/components/editor/EditorSidebarTagNCategory.svelte";
  let categoryId;
  let tagsIds = [];
  let slideTitle = "";
  let slideId;
  let slideCategory;
  let slideTags;
  import { images } from "$lib/stores/index.js";
  let getLayout = false;
  let slideIsDeleted = false;
  let newItem = {};
  let slideHeight = 0;
  let slideWidth = 0;
  let showGallery = false;
  let imageGallery;
  let slideMargin = 0;
  let alertVisible = false;
  let typeAlert = "";
  let messageAlert = "";
  let titleAlert = "";
  export let data;
  let selectedBackground = null;
  $: if (slideWidth / slideHeight > 1.77 || slideWidth / slideHeight < 1.76) {
    if (slideWidth / slideHeight > 1.77) {
      slideMargin -= 1;
    } else {
      slideMargin += 1;
    }
  }

  function handleSelectCategory(e) {
    categoryId = e.detail;
  }
  function handleTags(e) {
    tagsIds = e.detail;
  }

  const userId = data?.user?.id;
  let isConnect = false;
  if (userId) {
    isConnect = true;
  }
  let background = null;
  onMount(async () => {
    if ($images.length === 0 && userId) {
      images.get(userId);
      background = $images;
    }
  });

  const styles = data.styles;
  const contentTypeElem = data.contents;
  function handleShowGalery() {
    showGallery = !showGallery;
  }

  function showAlert(type, title, msg) {
    typeAlert = type;
    titleAlert = title;
    messageAlert = msg;
    alertVisible = true;
    setTimeout(() => {
      alertVisible = false;
    }, 1500);
  }
  async function handleSelectItem(e) {
    for (let i = 0; i < e.detail.length; i++) {
      const countId = Math.random();

      return (newItem = {
        content: e.detail[i].name,
        id: countId,
        style: {
          id: e.detail[i].style_id,
          css: e.detail[i].style,
          name: e.detail[i].name,
        },
        type: {
          id: e.detail[i].id,
          name: e.detail[i].name,
        },
      });
    }
  }

  const layoutBackup = () => {
    let layout = [];
    $memoItems.forEach((item) => {
      if (item.type.name === "detail") {
        item.h = 1;
      }
      layout.push({
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        position: item.position,
        id: item.id,
      });
    });
    return layout;
  };

  const handleSaveSlide = async () => {
    getLayout = true;
    const layout = JSON.stringify(layoutBackup());
    console.log(layout);

    const itemsToSave = $memoItems.map((item) => {
      return {
        css: item.style.css,
        content: item.content,
        type_id: item.type.id,
        styleId: item.style.id,
        position: item.position,
      };
    });

    if (itemsToSave.length === 0)
      return showAlert("warn", "attention: ", "la slide est vide");

    const data = {
      title: slideTitle,
      contents: itemsToSave,
      categoryId,
      tagsIds,
      userId,
      layout,
      backgroundId: selectedBackground,
      type: "slide",
    };

    const newSlide = await memos.add(data);
    if (newSlide) {
      showAlert(
        "success",
        "slide ajoutée",
        `la slide ${newSlide.title} a été bien été ajoutée`,
      );
      slideId = newSlide.id;
      slideCategory = newSlide.category_id;
      slideTags = newSlide.tags;
      slideTitle = newSlide.title;
    }
    await fullmemos.get(userId);
    reloadNeeded.set(true);
  };

  const handleClick = (e) => {
    selectedBackground = imageGallery.getCurrentIndex();
    showAlert(
      "success",
      `Background n° ${selectedBackground + 1}`,
      "  un nouveau background a été selectionné",
    );
  };
</script>

{#if alertVisible}
  <CustomAlert type={typeAlert} title={titleAlert} message={messageAlert} />
{/if}
<div class="container">
  <div class="menu menu-left">
    <Sidemenu
      on:selectItem={handleSelectItem}
      {styles}
      items={contentTypeElem}
      on:saveSlide={handleSaveSlide}
      on:showGalery={handleShowGalery}
    />
  </div>
  <div class={showGallery ? "gallery" : "hide"}>
    <ImageGallery
      bind:this={imageGallery}
      on:click={handleClick}
      items={$images}
    />
  </div>
  <div
    class="slide"
    style="margin: {slideMargin}px 0;"
    bind:offsetHeight={slideHeight}
    bind:offsetWidth={slideWidth}
  >
    <div class={showGallery ? "hide" : "show ok"}>
      <Editor
        {background}
        {selectedBackground}
        {getLayout}
        {newItem}
        isDeleted={slideIsDeleted}
        isSlide={true}
      />
    </div>
  </div>
  <div class="menu menu-right">
    <textarea
      type="textaria"
      bind:value={slideTitle}
      placeholder="Titre des slides"
    />
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <EditorSidebarTagNCategory
      on:selectedCategory={handleSelectCategory}
      on:selectedTags={handleTags}
    />
  </div>
</div>

<style>
  textarea {
    width: 100%;
    height: 2rem;
    background-color: #1b1f2a;
    border: 1px solid #565656;
    color: #00d0ff;
    outline: none;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100vh;
    max-width: 100vw;
  }

  .slide {
    overflow: hidden;
    border: 1px solid #000;
  }
  .gallery {
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }

  .menu {
    background-color: #000;
  }

  .hide {
    display: none;
  }

  .ok {
    height: 100%;
  }
</style>
