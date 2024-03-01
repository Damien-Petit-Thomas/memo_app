<script>
  import Editor from "$lib/components/editor/Editor.svelte";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
  import {onMount} from "svelte";
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
  

  const userId = data?.user?.id;
let isConnect = false;
  if (userId) {
    isConnect = true;
  }
let background = null;
onMount(async () => {
  if($images.length === 0 && userId){
    images.get(userId);
    background = $images
  }
})



  const styles = data.styles;
  const contentTypeElem = data.contents;
  function handleShowGalery() {
    showGallery = !showGallery;
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


  const handleTitleChange = (e) => {
    console.log(e.target.innerText)
    if(e.target.innerText === "Titre des slides"){
      e.target.innerText = "";
    }
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };


  

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
    <!-- svelte-ignore missing-declaration -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="slide-title" 
    on:keydown={handleTitleChange}
    contenteditable="true">
    Titre des slides
    </div>
  </div>
</div>

<style>

  .slide-title {
    outline: 0px solid transparent;
    height: 3rem;
    font-size: 1.5rem;
    background-color: #1b1f2a;
    border: 1px solid #565656;
    color: #00d0ff;
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
  .gallery{
    position : absolute;
   
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


  .ok{
    height: 100%;
  }

</style>
