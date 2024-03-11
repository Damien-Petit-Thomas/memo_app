<script>
  import Editor from "$lib/components/editor/Editor.svelte";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
  import { onMount } from "svelte";
  import ImageGallery from "@react2svelte/image-gallery";

  import Sidemenu from "$lib/components/editor/SlideSidebar.svelte";
  let itemSize = { heigt: 20 };
  let fullscreen = false;
  import {
    currentMemo,
    memoItems,
    memos,
    fullmemos,
    reloadNeeded,
    maj,
    categories,
    currentSlide,
    images,
    mainSlideId,
    userslide,
  } from "$lib/stores/index.js";
  import EditorSidebarTagNCategory from "$lib/components/editor/EditorSidebarTagNCategory.svelte";
    import { slide } from "svelte/transition";

  let page = 1;
  let categoryId;
  let tagsIds = [];
  let slideTitle = "";
  let slideName = "";
  let slideIds = new Array(100);
  let slideCategory;
  let slideTags;
  let getLayout = false;
  let slideIsDeleted = false;
  let newItem = {};
  let slideHeight = 0;
  let slideWidth = 0;
  let showGallery = false;
  let totalPage = 1;
  let imageGallery;
  let slideMargin = 0;
  let alertVisible = false;
  let typeAlert = "";
  let messageAlert = "";
  let titleAlert = "";
  export let data;
  let selectedBackground = new Array(100);
  $: if (slideWidth / slideHeight > 1.77 || slideWidth / slideHeight < 1.76) {
    if (slideWidth / slideHeight > 1.77) {
      slideMargin -= 1;
    } else {
      slideMargin += 1;
    }
  }
  $: if ($currentSlide.length > 0) {
    isNewSlide = false;
    slideTitle = $currentSlide[0][0].slideTitle;
    slideCategory = $currentSlide[0][0].category;
    slideTags = $currentSlide[0].tags;
    for (let slide of $currentSlide) {
      slideIds[slide[0].page] = slide[0].memoId;
    }
  }
  $: backUrlId = selectedBackground[page];

let copieSaveArray = new Array(100);
  const originalCopy = new Array(100);
  const handlePage = (e) => {
    const copie = JSON.parse(JSON.stringify($memoItems));
    pushToIndex(copieSaveArray, page, copie);
    page = e.detail;
    if (copieSaveArray[page] !== undefined) {
      $memoItems = copieSaveArray[page];
    } else {
      $memoItems = [];
    }
    maj.set(true);
  };
  onMount(() => {
    if ($currentSlide.length > 0) {
      slideTitle = $currentSlide[0][0].slideTitle;
      slideCategory = $currentSlide[0][0].category;
      slideTags = $currentSlide[0].tags;
      totalPage = $currentSlide.length;
      for (let slide of $currentSlide) {
        pushToIndex(slideIds, slide[0].page, slide[0].memoId);
        const copie = JSON.parse(JSON.stringify(slide));
        pushToIndex(copieSaveArray, slide[0].page, copie);
        pushToIndex(originalCopy, slide[0].page, copie);
        pushToIndex(selectedBackground, slide[0].page, slide[0].backgroundId);
      }
      $memoItems = copieSaveArray[1];
      maj.set(true);
      backUrlId = selectedBackground[page];
    }
  });

  onMount(() => {
    return () => {
      currentMemo.set({});
      memoItems.set([]);
    };
  });

  const handleSavePage = (e) => {
    let page = e.detail;
  };

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
      await images.get(userId);
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
        page,
        css: "",
        customCss: {},
        content: e.detail[i].name,
        id: countId,
        style: {
          id: e.detail[i].style_id,
          css: e.detail[i].style,
          name: e.detail[i].style_name || e.detail[i].name,
        },
        type: {
          id: e.detail[i].id,
          name: e.detail[i].name,
        },
      });
    }
  }

  const pushToIndex = (arr, index, element) => {
    if (index < arr.length) {
      arr.splice(index, 1, element);
    } else {
      arr.splice(index, 0, element);
    }
  };

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
  $: titreDeLaSlide = `${slideTitle}-slide-${page}`;
  let copie = [];

  let isNewSlide = true;


  const handleDeletAllSlide = async () => {
    const userConfirm = confirm("voulez-vous vraiment supprimer toutes les slides ?");
    if (!userConfirm) return;
  
      copieSaveArray = new Array(100);
      slideIds = new Array(100);
      selectedBackground = new Array(100);
      totalPage = 1;
      $memoItems = [];
      $mainSlideId = null;
      slideTitle = "";
      maj.set(true);
    
    if($mainSlideId){
      console.log($mainSlideId);
    const deleted =  userslide.remove($mainSlideId)
      if(deleted){
        showAlert("success", "action réussie", `la slide ${deleted.title} a été bien été supprimée`);
        mainSlideId.set(null);
    }
    if(!isNewSlide && $mainSlideId === null){
      showAlert("warn", "attention", "erreur lors de la suppression de la slide");
    }
  
  }
  };




  const handleDeletSlide = async () => {
    const userConfirm = confirm("voulez-vous vraiment supprimer cette slide ?");
    if (!userConfirm) return;
    if (slideIds[page]) {
      const deletedSlide = await memos.remove(slideIds[page]);
      if (deletedSlide) {
        showAlert(
          "success",
          "action réussie",
          `la slide ${deletedSlide.title} a été bien été supprimée`,
        );
      }
    }
    slideIds.splice(page, 1);
    selectedBackground.splice(page, 1);
    copieSaveArray.splice(page, 1);
    totalPage = totalPage - 1;
    for (let i = page; i < 100; i++) {
      //  il faut modifier les pages des slides suivantes dans copySaveArray
      if (copieSaveArray[i] !== undefined) {
        console.log(copieSaveArray[i][0].page);
        copieSaveArray[i][0].page = i - 1;
      }
      $memoItems = copieSaveArray[page];
      maj.set(true);
    }
    saveAllSlide();
  };

  const saveAllSlide = async () => {
    const backup = $memoItems;
    for (let i = 0; i < 100; i++) {
      if (copieSaveArray[i] !== undefined) {
        if (i === page) {
          if(backup !== originalCopy[i]){
            await handleSaveSlide();
          }
        } else {
        if(copieSaveArray[i] !== originalCopy[i]){
          $memoItems = copieSaveArray[i];
          page = i;
          await handleSaveSlide();
        }
      }
    }
  }
  };

  const handleSaveSlide = async (e) => {
    copie = JSON.parse(JSON.stringify($memoItems));
    getLayout = true;
    const layout = JSON.stringify(layoutBackup());
    if (categoryId === undefined) categoryId = $categories[0].id;
    const itemsToSave = await $memoItems.map((item) => {
      return {
        typeId: item.type.id,
        content: item.content,
        styleId: item.style.id,
        position: item.position,
        opacity: item.customCss.opacity,
        color: item.customCss.color,
        delay: item.customCss.delay,
        repeat: item.customCss.repeat,
        fontsize: item.customCss.fontsize,
        duration: item.customCss.duration,
        fontfamily: item.customCss.fontfamily,
        background: item.customCss.background,
        animation: item.customCss.animation,
        easefonction: item.customCss.easefonction,
      };
    });
    if (itemsToSave.length === 0) {
      return showAlert("warn", "attention: ", "la slide est vide");
    }
    if (slideIds[page]) {
      if (categoryId === undefined) {
        categoryId = slideCategory;
      }
      if (tagsIds === undefined) {
        tagsIds = slideTags;
      }
      if (slideTitle === "") {
        slideTitle = slideTitle;
      }

      const data = {
        page,
        slideTitle,
        title: titreDeLaSlide,
        contents: itemsToSave,
        categoryId,
        tagsIds,
        id: slideIds[page],
        backgroundId: selectedBackground[page],
        userId,
        layout,
        type: "slide",
      };

      const newSlide = await memos.mark(data);
      slideTags = newSlide.tags;
      if (newSlide) {
        showAlert(
          "success",
          "modification réussie",
          `la slide ${newSlide.title} a bien été ajouté à ${slideTitle}`,
        );
      }
    } else {
      if (slideTitle === "") {
        showAlert("warn", "attention: ", `le titre de la slide est vide`);
        return;
      }
      let titles = $memos.map((memo) => memo.title);
      if (titles.includes(slideTitle)) {
        showAlert(
          "warn",
          "attention: ",
          `le titre: "${slideTitle}" est déjà utilisé`,
        );
        return;
      }

      const data = {
        isNewSlide,
        page,
        slideTitle,
        title: titreDeLaSlide,
        contents: itemsToSave,
        categoryId,
        tagsIds,
        userId,
        layout,
        backgroundId: selectedBackground[page],
        type: "slide",
      };
      const newSlide = await memos.add(data);
      if (newSlide.id) {
        isNewSlide = false;
        showAlert(
          "success",
          "slide ajoutée",
          `la slide ${newSlide.title} a été bien été ajoutée`,
        );
        pushToIndex(slideIds, page, newSlide.id);
        
        slideCategory = newSlide.category_id;
        slideTags = newSlide.tags;
        slideTitle = slideTitle;
        mainSlideId.set(newSlide.slide_id);
      }
    }
    await fullmemos.get(userId);
    reloadNeeded.set(true);
  };

  const handleClick = () => {
    let index = imageGallery.getCurrentIndex();
    pushToIndex(selectedBackground, page, $images[index].id);
    backUrlId = selectedBackground[page];
    showAlert(
      "success",
      `Background n° ${selectedBackground[page]}`,
      "  un nouveau background a été selectionné",
    );
  };
  const handleRemove = () => {
    // on supprime le contenu de selectedBackground à l'index page
    selectedBackground.splice(page, 1);
    backUrlId = selectedBackground[page];

    showAlert("warn", `Background :  `, "  le background a été supprimé");
  };
</script>

{#if alertVisible}
  <CustomAlert type={typeAlert} title={titleAlert} message={messageAlert} />
{/if}
<div class="container">
  <div class="menu menu-left">
    <Sidemenu
      {totalPage}
      on:addPage={()=> totalPage += 1}
      on:page={handlePage}
      on:selectItem={handleSelectItem}
      {styles}
      items={contentTypeElem}
      on:saveSlide={handleSaveSlide}
      on:remove={handleRemove}
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
  <div class="slide-container">
    <div class="slide">
      <div class={showGallery ? "hide" : "show ok"}>
        <Editor
          {page}
          {$images}
          {backUrlId}
          {getLayout}
          {newItem}
          isDeleted={slideIsDeleted}
          isSlide={true}
        />
      </div>
    </div>
  </div>
  <div class="main-title">
    <input
      bind:value={slideTitle}
      type="text"
      name=""
      id=""
      placeholder="titre principal"
    />
    <div class="option-container">
    <button
      on:click={() => {
        const slide = document.querySelector(".show");
        slide.requestFullscreen();
        fullscreen = true;
      }}>fullscreen</button
    >
      <button
      on:click={saveAllSlide}
      >tout sauvegarder</button>
      <button
      on:click={handleDeletAllSlide}
      >tout supprimer</button>
    </div>
  </div>
  <div class="menu menu-right">
    <input
      type="text"
      disabled
      bind:value={titreDeLaSlide}
      placeholder="Titre du document"
    />
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <EditorSidebarTagNCategory
      on:selectedCategory={handleSelectCategory}
      on:selectedTags={handleTags}
    />

    <button on:click={handleDeletSlide}>supprimer</button>
  </div>
</div>

<style>

  .option-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  input[type="text"] {
    color: #00d0ff;

    outline: none;
    border: none;
    padding: 1rem;
    border-radius: 3px;
    background-color: #1b1f2a;
  }

  .main-title {
    position: absolute;
    width: 50%;
    top: 6rem;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100vh;
    max-width: 100vw;
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

  .slide {
    width: 1000px;
    height: 562px;
    border: 1px solid #000;
    border-radius: 2px;
  }

  .slide-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
