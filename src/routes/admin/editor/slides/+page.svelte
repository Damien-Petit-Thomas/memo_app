<script>
  import Editor from "$lib/components/editor/Editor.svelte";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";

  import ImageGallery from "@react2svelte/image-gallery";
  import Sidemenu from "$lib/components/editor/SlideSidebar.svelte";
  import EditableItem from "$lib/components/editor/EditorEditableItem.svelte";
  import { images } from "$lib/stores/index.js"; 
  import Grid, { GridItem } from "svelte-grid-extended";
  let gridController;
  let getLayout = false;
  let slideIsDeleted = false;
  let newItem = {};
  let items = [];
  let slideHeight = 0;
  let slideWidth = 0;
  let showGallery = false;
  let imageGallery;
  let slideMargin = 0;
  let alertVisible = false;
  let typeAlert = '';
  let messageAlert = '';
  let titleAlert = '';
  let position= 0;
  export let data;
  let selectedBackground = null;
  $: if (slideWidth / slideHeight > 1.77 || slideWidth / slideHeight < 1.76) {
    if (slideWidth / slideHeight > 1.77) {
      slideMargin -= 1;
    } else {
      slideMargin += 1;
    }
  }
  
  let userId = data.user.id;
  const styles = data.styles;
  const contentTypeElem = data.contents;
  function handleShowGalery() {
    showGallery = !showGallery;
    console.log(showGallery)
  }


  function showAlert(type,title, msg) {
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


  

  const handleClick = (e) => {
    selectedBackground = imageGallery.getCurrentIndex();
    showAlert("success", `Background n° ${selectedBackground + 1}`, "  un nouveau background a été selectionné");
  };
</script>
{#if alertVisible  }
    <CustomAlert
      type={typeAlert}
      title={titleAlert}
      message={messageAlert}
    />
{/if}
<div class="container">
  <div class="menu menu-left">
    <Sidemenu 
    on:selectItem={handleSelectItem}
    {styles}
    items={contentTypeElem}
    on:showGalery={handleShowGalery} />
  </div>
  <div
  class="slide"
  style="margin: {slideMargin}px 0;"
  bind:offsetHeight={slideHeight}
  bind:offsetWidth={slideWidth}
  >
    <div class={showGallery ? "show" : "hide"}>
      <ImageGallery
        bind:this={imageGallery}
        on:click={handleClick}
        items={$images}
      />
    </div>
    <div class={showGallery ? "hide" : "show ok"}>
      <Editor
      {selectedBackground}
      {getLayout}
      {newItem}
      isDeleted={slideIsDeleted}
      isSlide={true}
        />
    </div>
  </div>
  <div class="menu menu-right"></div>
</div>

<style>
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

  .menu {
    background-color: #000;
  }

  .hide {
    display: none;
  }

  .show {
    display: block;
  }
  .ok{
    height: 100%;
  }

</style>
