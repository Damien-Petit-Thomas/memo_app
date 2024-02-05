
  <script>
    import { categories } from '$lib/stores/category.js';
    import { tags } from '$lib/stores/tag.js';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    let selected = false;
    let selectedCategoryId;
    let tagsIds = [];
    let nbTags;
    $tags.length < 10 ? nbTags = $tags.length : nbTags = 10;
    const dispatch = createEventDispatcher();
  
    onMount(async () => {
  if ($categories.length === 0) {

    await categories.set(await getCategory());

    if ($categories.length > 0) {
        selectedCategoryId = $categories[0].id;
      dispatch('selectedCategory', selectedCategoryId);
    }
  }  if ($tags.length === 0) {
    tags.set(await getTags());
  } else {
        selectedCategoryId = $categories[0].id;
    dispatch('selectedCategory', selectedCategoryId);
  }
});

const getCategory = async () => {
	const  response = await fetch('/api/category')
  return response.json();
}

const getTags = async () => {
  const response = await fetch('/api/tag');
  return response.json();
}



  function  handleCategoryChange(e) {
    selectedCategoryId = e.target.value;
      dispatch('selectedCategory', e.target.value);
    }


  
    function handleTagChange(e) {
      const id = parseInt(e.target.value);
      $tags = $tags.map(tag => {
        if (tag.id === id) {
          return { ...tag, selected: !tag.selected };
        }
        return tag;
      });
  
      tagsIds = $tags.filter(tag => tag.selected).map(tag => tag.id);
      dispatch('selectedTags', tagsIds);
    }
  </script>
  
  <section>
    
  
    <div class="category-section">
<details>
  <summary>choisir une catégorie</summary>
  <select name="categories" 
  id="categories"  
  on:change={handleCategoryChange} 
  > 

    {#each $categories as item (item.id)}
    <option 
      value={item.id} 
      style={`background-color: ${item.color};`}
    >
      {item.name}
    </option>
    {/each}
  </select>
</details>
    </div>

    <div class="tag-section">
<details>
  <summary>ajouter des tags</summary>

  <select 
    multiple 
    name="tags" 
    id="tags" 
    size={nbTags}  
    on:change={handleTagChange}
  >
  {#each $tags as item (item.id)}
    <option 
        class:selected
        value={item.id}
        style={`background-color: ${item.color};`}
        >
          {item.name}
    </option>
      {/each}
    </select>
</details>
    </div>



   



  </section>






  
  <style>
    /* Your existing styles remain unchanged */
  
    section{
      
    }

    select{
      width: 90%;
      height: 100%;
      border: none;
      border-radius: 5px;
      padding: 2px;
      margin: 2px;
      font-weight: bold;
      font-size: 1.2rem;
      cursor: pointer;
      display: inline;
    }

    details{
      cursor: pointer;
      padding: .5rem;
    }

    .selected {
      text-decoration: underline;
      font-size: 3rem;
      border: 10px solid rgb(5, 190, 51);
    }
  </style>
  