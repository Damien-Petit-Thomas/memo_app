<script>
  import {onMount} from 'svelte';
  import { lexicon } from '$lib/stores/index.js';
let sortedLexicon = [];
let groupedLexicon = {};
  // Tri du lexicon par ordre alphabétique

onMount(async () => {
  if ($lexicon.length === 0) {
    await lexicon.get();
  }
});



  $:  sortedLexicon = $lexicon.slice().sort((a, b) => a.word.localeCompare(b.word));

  // Grouper les mots par la première lettre
  $: {
  groupedLexicon = {}; // Create a new object to trigger reactivity

  sortedLexicon.forEach(({ word, definition, id }) => {
    const firstLetter = word.charAt(0).toUpperCase();
    groupedLexicon[firstLetter] = groupedLexicon[firstLetter] || [];
    if (groupedLexicon[firstLetter].some((item) => item.id === id)) {
      return;
    }
    groupedLexicon[firstLetter].push({ word, definition, id });
  });
}

const handleRemove = async (id) => {
  const userConfirm = confirm('êtes-vous sûr de vouloir poursuivre cette action ?');
  if (userConfirm) {
    await lexicon.remove(id);
  }
  return ;
}



</script>

<div class="lexicon">
  
    {#each Object.keys(groupedLexicon).sort() as firstLetter}
          <h2>{firstLetter}</h2>
        {#each groupedLexicon[firstLetter] as { word, definition,  id }}
            <div class="word">
              <div class="word-word">{word}</div>
              <div class="definition">{definition}</div>
              <button class="remove"
              on:click={() => handleRemove(id)}
              aria-label="Remove" 
      
              />
            </div>
        {/each}
    {/each}
</div>  
  




    <style>

.remove {
    background-image: url($lib/assets/remove.svg);
    background-repeat:no-repeat;
    background-position: center;
    background-color: transparent;
    width: 2px;
    height: 2px;
  }

    .lexicon {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
    }

    .word {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 20px;
    }

    .word-word {
      font-size: 1.5rem;
      font-weight: bold;
      padding-left: 1rem;
      border-left: 3px solid black;
       }

    .definition {
      font-size: 1.2rem;
    }

    h2 {
      display: inline-block;
      width: 80%;
      border-bottom: 3px solid black;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 20px;
    }








   </style>