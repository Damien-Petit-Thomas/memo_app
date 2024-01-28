<script>
  import { reloadNeeded } from '$lib/stores/reloadNeeded.js';

  import { send, receive } from '$lib/utils/transition.js';
  export let title;
  export let store;
	import { flip } from 'svelte/animate';
 
  
  let name = '';
  let color = '#413779';
  reloadNeeded.set(false)
  
  const addCategory = () => {
    if (name && color) {
      const data = {
        name,
        color
      };
    
      store.add(data);
      name = '';
      color = '#ff0000';
    }
    reloadNeeded.set(true)
  
  };

function handleRemove(item) {
 const userConfirm = confirm('êtes-vous sûr? cette action supprimera tout les memo associés à cette catégorie');
  if (userConfirm) {
    store.remove(item);
    reloadNeeded.set(true)

  }
  return ;
}
</script>

<div class="board">
  <form on:submit|preventDefault={addCategory}>
    <label for="name">{title}</label>
    <input type="text" id="name" bind:value={name}>
    <label for="color">Choix de la couleur</label>
    <input type="color" id="color" bind:value={color}>
    <button class='board-btn' type="submit">Valider</button>
  </form>


  <div class="categories">
    {#each $store as item (item.id)}
      <div
        class="item"
        in:receive={{ key: item.id }}
        out:send={{ key: item.id }}
   animate:flip={{ duration: 800 }}

      >
        <div 
        class="categoty-item"
        style="background-color: {item.color};"
                >

          {item.name}
        </div>      
        <button class="remove"
        on:click={handleRemove(item.id)}
        aria-label="Remove" 

        />
        </div>
    {/each}
      </div> 
</div>


<style>
.categoty-item{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

  .board {

    
    gap:.5rem;
    margin:1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .categories {
    width: 100%;
    gap:.2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
  .item{
    width: 100%;
    display: flex;
  }
  
  
  form{
  border: 1px solid rgb(151, 135, 135);
  padding: .5rem; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

  input[type="text"] {
    width: 80%;
  }

  .board-btn{
    align-self: center; 
    padding: .2rem;
    margin:.4rem 0 .1rem 0;
    width:100%;
    border-radius: 0;
  }

  .board-btn:hover{
    background-color: rgb(151, 135, 135);
    color: white;
  }


  .remove {
    background-image: url($lib/assets/remove.svg);
    background-repeat:no-repeat;
    background-position: center;
    background-color: transparent;
    width: 2px;
    height: 2px;
  }
</style>
