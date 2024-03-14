<script>
  import { goto } from '$app/navigation';
  import {
    memos,
    link,
    reloadNeeded,
    fullmemos,
    memoItems,
    currentMemo,
    title,
    categories,
    maj,
  } from "$lib/stores/index.js";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
  import Lexicon from "$lib/components/editor/Lexicon.svelte";
  import Editor from "$lib/components/editor/Editor.svelte";
  import EditorSidebar from "$lib/components/editor/EditorSidebar.svelte";
  import EditorSidebarTagNCategory from "$lib/components/editor/EditorSidebarTagNCategory.svelte";
  import { redirect } from '@sveltejs/kit';
  let memoId;
  let isSlide = false;
  export let data;
  import { saveLinks } from "$lib/utils/saveLinks.js";
  import { onMount } from "svelte";
  let memoCategory;
  let memotags = [];
  let categoryId;
  let tagsIds = [];
  let memotitle = "";
  let memoIsDeleted = false;
  let linkList = [];
  let items = [];
  let getLayout = false;
  let alertVisible = false;
  let typeAlert = '';
  let messageAlert = '';
  let titleAlert = '';
  let selectedBackground = null;
  function showAlert(type,title, msg) {
    typeAlert = type;
    titleAlert = title;
    messageAlert = msg;
    alertVisible = true;
    setTimeout(() => {
      alertVisible = false;
    }, 3000);
  }
  $link.forEach((link) => linkList.push(link.url));

  let userId = data.user.id;

  let newItem = {};
  async function handleSelectItem(e) {
    for (let i = 0; i < e.detail.length; i++) {
      const countId = Math.random();

      return (newItem = {
        content: e.detail[i].name,
        id: countId,
        style: {
          id: e.detail[i].style_id,
          css: e.detail[i].style,
        },
        type: {
          id: e.detail[i].id,
          name: e.detail[i].name,
        },
      });
    }
  }

onMount(() => {
    memoItems.set([]);

  
   if ($currentMemo.contents && $currentMemo.contents.length > 0) {
      memotitle = $currentMemo.title;
      memoId = $currentMemo.id;
      memoCategory = $currentMemo.category.id;
      if ($currentMemo.tags) {
        memotags = $currentMemo.tags.forEach((tag) => memotags.push(tag.id));
      }


    }
  });


  const contentTypeElem = data.contents;
  const styles = data.styles;

  function handleSelectCategory(e) {
    categoryId = e.detail;
  }
  function handleTags(e) {
    tagsIds = e.detail;
  }

  async function deleteMemo() {
    const userConfirm = confirm("Etes-vous sûr de vouloir supprimer ce memo?");
    if (!userConfirm) return;
    if (memoId) {
      const deletedMemo = await memos.remove(memoId);
      if (deletedMemo) {
        showAlert("success","action réussie", `le memo ${deletedMemo.title} a été bien été supprimé`);
      }
    }
    memoItems.set([]);
    maj.set(true);
    memoId = null;
    memotags = [];
    memoCategory = null;
    memotitle = "";
    memoIsDeleted = true;
    reloadNeeded.set(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }


  function layoutBackup() {
    let layout = [];
    $memoItems.forEach((item) => {
      if(item.type.name === "detail"){
        item.h = 1;
      }
      layout.push({ x: item.x, y: item.y, w: item.w, h: item.h, position: item.position, id: item.id});
    });
    return layout;
  }
  let count = 0;
  let copie = [];

  async function saveMemo() {
    copie = JSON.parse(JSON.stringify($memoItems));
    const type = "memo";
    getLayout = true;
    const layout = JSON.stringify(layoutBackup());
    categoryId = categoryId !== undefined ? categoryId : memoCategory;
    const itemsToSave = $memoItems.map((item) => {
      return {
        content: item.content,
        typeId: item.type.id,
        styleId: item.style.id,
        position : item.position,
      };
    });

    if (itemsToSave.length === 0) return showAlert("warn","attention: ", "le memo est vide");

    if (memoId) {
      if (categoryId === undefined) {
        categoryId = memoCategory;
      }
      if (tagsIds === undefined) {
        tagsIds = memotags;
      }
      if ($title === "") {
        $title = memotitle;
      }
      const data = {
        title: $title,
        contents: itemsToSave,
        categoryId,
        tagsIds,
        id: memoId,
        userId,
        layout,
        type,
        page : 1
      };

      const newMemo = await memos.mark(data);
      memotags = newMemo.tags;
      if (newMemo) {
     showAlert("success","modification réussie", `le memo ${newMemo.title} a été bien été modifié`);
        memoCategory = newMemo.category_id;
        memotags = newMemo.tags;
      }
    } else {
      if (categoryId === undefined) categoryId = $categories[0].id;
      const data = {
        title: $title,
        contents: itemsToSave,
        categoryId,
        tagsIds,
        userId,
        layout,
        type,
        page : 1
      };

      const newMemo = await memos.add(data);
      if (newMemo) {
        showAlert("success","ajout réussi", `le memo ${newMemo.title} a été bien été ajouté`);
        memoId = newMemo.id;
        memoCategory = newMemo.category_id;
        memotags = newMemo.tags;
        memotitle = newMemo.title;
      }
    }
    memoItems.set(copie)
    await fullmemos.get(userId);
    itemsToSave.forEach((item) => {
      saveLinks(item.content, linkList, memoId, categoryId, userId);
    });

    reloadNeeded.set(true);
  }
</script>
{#if alertVisible  }
    <CustomAlert
      type={typeAlert}
      title={titleAlert}
      message={messageAlert}
    />
{/if}
<div class="container">
  <EditorSidebar
    {styles}
    items={contentTypeElem}
    on:selectItem={handleSelectItem}
    on:saveMemo={saveMemo}
  />
  <Editor
    {selectedBackground}
    {getLayout}
    {newItem}
    isDeleted={memoIsDeleted}
    {isSlide}
  />
  <div class="wrapper">
    <div class="wrapper_content">
      <EditorSidebarTagNCategory
        on:selectedCategory={handleSelectCategory}
        on:selectedTags={handleTags}
      />
      <Lexicon {categoryId} {userId} />
      <button on:click={deleteMemo}>Supprimer</button>
    </div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 100vh;
    max-width: 100vw;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    min-width: 15%;
  }
  .wrapper_content {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
  }
</style>
