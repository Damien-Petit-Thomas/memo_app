<script>
  import { lexicon } from '$lib/stores/lexicon.js';

  // Tri du lexicon par ordre alphabétique
  let sortedLexicon = $lexicon.slice().sort((a, b) => a.word.localeCompare(b.word));

  // Grouper les mots par la première lettre
  let groupedLexicon = {};
  sortedLexicon.forEach(({ word, definition }) => {
    const firstLetter = word.charAt(0).toUpperCase();
    groupedLexicon[firstLetter] = groupedLexicon[firstLetter] || [];
    groupedLexicon[firstLetter].push({ word, definition });
  });
</script>

<div class="lexicon">
  
    {#each Object.keys(groupedLexicon).sort() as firstLetter}
          <h2>{firstLetter}</h2>
        {#each groupedLexicon[firstLetter] as { word, definition }}
            <div class="word">
              <div class="word-word">{word}</div>
              <div class="definition">{definition}</div>
            </div>
        {/each}
    {/each}
</div>  
  




    <style>

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