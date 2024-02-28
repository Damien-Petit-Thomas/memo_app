<script>
  import {
    memos,
    link,
    reloadNeeded,
    fullmemos,
    memoItems,
    currentMemo,
    title,
    categories,
  } from "$lib/stores/index.js";
  import CustomAlert from "$lib/components/CustomAlert/Alert.svelte";
  import Lexicon from "$lib/components/editor/Lexicon.svelte";
  import Editor from "$lib/components/editor/Editor.svelte";
  import EditorSidebar from "$lib/components/editor/EditorSidebar.svelte";
  import EditorSidebarTagNCategory from "$lib/components/editor/EditorSidebarTagNCategory.svelte";
  import { redirect } from '@sveltejs/kit';
  let memoId;
  export let data;
  import { saveLinks } from "$lib/utils/saveLinks.js";
  import { onMount } from "svelte";
  let memoCategory;
  let categoryId;
  let memotags = [];
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
          name: e.detail[i].name,
        },
        type: {
          id: e.detail[i].id,
          name: e.detail[i].name,
        },
      });
    }
  }

  onMount(() => {
    if($currentMemo === undefined)  console.log('currentMemo is undefined')
    // on attend que $currentMemo soit défini
    // on utilise setTimeout pour attendre que $currentMemo soit défini
  
   else if ($currentMemo.contents && $currentMemo.contents.length > 0) {
      memotitle = $currentMemo.title;
      memoId = $currentMemo.id;
      memoCategory = $currentMemo.category.id;
      if ($currentMemo.tags) {
        memotags = $currentMemo.tags.forEach((tag) => memotags.push(tag.id));
      }
      $currentMemo.contents.forEach((item) => {});
      currentMemo.set({});
    }
  });
  onMount(() => {
    return () => {
      memoItems.set([]);
    };
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
    memoId = undefined;
    memotags = [];
    memoIsDeleted = true;
    reloadNeeded.set(true);
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
  async function saveMemo() {
    getLayout = true;
    const layout = JSON.stringify(layoutBackup());
    console.log(layout);
    categoryId = categoryId !== undefined ? categoryId : memoCategory;

    const itemsToSave = $memoItems.map((item) => {
      return {
        content: item.content,
        type_id: item.type.id,
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
    {data}
    {getLayout}
    {newItem}
    {items}
    isDeleted={memoIsDeleted}
    title={$title}
    {styles}
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
