<script>
  import { reloadNeeded } from '$lib/stores/reloadNeeded.js';
  import { fullmemos } from '$lib/stores/fullmemos.js';
  import { memos} from '$lib/stores/memo.js';
  import Lexicon from '$lib/components/editor/Lexicon.svelte';
  import { memoItems } from '$lib/stores/Editor.js';
  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorSidebar from '$lib/components/editor/EditorSidebar.svelte';
  import {title} from '$lib/stores/title.js';
  import  EditorSidebarTagNCategory  from '$lib/components/editor/EditorSidebarTagNCategory.svelte';
  let memoId;
  export let data; 
  import { saveLinks } from '$lib/utils/saveLinks.js';
  import { currentMemo } from '$lib/stores/currentMemo.js';
  import { onMount } from 'svelte';
  let memoCategory;
  let categoryId;
  let memotags = [];
  let tagsIds = [];
  let memotitle = "";
  let memoIsDeleted = false;
  import { link } from '$lib/stores/link.js';
  let linkList = [];
  
  $link.forEach((link) => linkList.push(link.url))
  
  
  
  
  
  
  
  onMount(() => {
    if ($currentMemo.contents && $currentMemo.contents.length > 0) {
      memotitle = $currentMemo.title
      memoId = $currentMemo.id
      memoCategory = $currentMemo.category.id
      if($currentMemo.tags) {
        console.log("currentMemo.tags", $currentMemo.tags)
        memotags = $currentMemo.tags.forEach(tag => memotags.push(tag.id))
      }
      $currentMemo.contents.sort((a, b) => a.position -b.position);
      $currentMemo.contents.forEach(item => {
        memoItems.update(items => [...items, item]);       
      })
      currentMemo.set({})
    }
  });
  onMount(() => {
    return () => {
      memoItems.set([])
    }
  })
  
  
  function handleSelectItem(e) {
    for (let i= 0; i < e.detail.length; i++){
      const count = Math.random()
      
      const newItem = {
        content : e.detail[i].name,
        id : count,
        style : {
          id: e.detail[i].style_id,
          css: e.detail[i].style,
          name: e.detail[i].name
        },
        type : {
          id : e.detail[i].id,
          name : e.detail[i].name
        }
      }
      memoItems.update(items => [...items, newItem]);
    }
  }
  
  
  const contentTypeElem = data.contents
  const styles = data.styles;
  
  function handleSelectCategory(e) {
    categoryId = e.detail;
  }
  function handleTags(e) {
    
    tagsIds = e.detail;
  }
  
  async function deleteMemo(){
    const userConfirm = confirm('Etes-vous sûr de vouloir supprimer ce memo?');
    if(!userConfirm) return;
    if(memoId){
      const deletedMemo = await memos.remove(memoId);
      console.log(deletedMemo)
      if(deletedMemo){
        alert('le memo a bien été supprimé')
      }
    }
    memoItems.set([])
    memoId = undefined;
    memotags = [];
    memoIsDeleted = true;
    reloadNeeded.set(true)
  }
  
  async function saveMemo() {
    
    let count = 0;
    categoryId = categoryId !== undefined ? categoryId : memoCategory;
    
    const itemsToSave = $memoItems.map(item => {
      const position = count++;
      return {
        position,
        content: item.content,
        type_id: item.type.id,
        styleId: item.style.id,
      };
    });
    
    if (itemsToSave.length === 0) return alert('add some content')
    
    if (memoId) {
      if(categoryId === undefined){
        categoryId = memoCategory
      }if(tagsIds === undefined){
        tagsIds = memotags
      }if($title === ""){
        $title = memotitle
      }
      const data = { title: $title, contents: itemsToSave, categoryId, tagsIds , id: memoId};
      const newMemo = await memos.mark( data );
      memotags = newMemo.tags;
      if (newMemo) { 
        alert(`le memo a été bien été modifié`);
        memoCategory = newMemo.category_id;
        memotags = newMemo.tags;
      }
    } else{
      if(categoryId === undefined) return alert('choose a category') 
      const data = { title: $title, contents: itemsToSave, categoryId, tagsIds };
      const newMemo = await memos.add( data);
      if (newMemo) {
        alert(`create${JSON.stringify(newMemo)}`);
        memoId = newMemo.id;
        memoCategory = newMemo.category_id;
        memotags = newMemo.tags;
        memotitle = newMemo.title;
      }
      
      
    }
    await  fullmemos.get();
    itemsToSave.forEach(item => {
      saveLinks(item.content, linkList, memoId, categoryId, memotitle)
    })
    
    reloadNeeded.set(true)
  }



  

  
</script>
<div class="container">
  
  <EditorSidebar 
  {styles}
  items={contentTypeElem}
  on:selectItem={handleSelectItem}
  
  on:saveMemo={saveMemo}
  />
  <Editor 
  isDeleted={memoIsDeleted}
  title={$title}
  {styles}
  />
  <div class="wrapper">
    <EditorSidebarTagNCategory
    on:selectedCategory={handleSelectCategory}
    on:selectedTags={handleTags}
    />
    <Lexicon {categoryId} />
    <button
    on:click={deleteMemo}
    >Supprimer</button>
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
  
  
</style>