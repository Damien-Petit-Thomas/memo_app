<script>
  import { fly, fade } from "svelte/transition";
  import { fullmemos } from "$lib/stores/index.js";
  import NextBar from "../nextBar/NextBar.svelte";
  import Card from "$lib/components/card/Card.svelte";
  export let selectedCategory;
  let currentMemoIdx = 0;
  let visible = true;
  $: mem = $fullmemos.filter((memo) => memo.category.id === selectedCategory?.id);
  $: if (
    $fullmemos !== null &&
    $fullmemos.filter((memo) => memo.category.id === selectedCategory?.id)
      .length !== 0
  ) {
    currentMemoIdx = $fullmemos.findIndex(
      (memo) => memo.category.id === selectedCategory?.id,
    );
  }

</script>

<div class="container_main">
  {#if !selectedCategory}
  <div class="container_main-header">
      <h2 
      transition:fade
      >Accueil</h2>
    </div>
      <div class="container_main-main">
        {#if $fullmemos === undefined}
          <p>Chargement des données</p>
        {:else if $fullmemos === null || $fullmemos.length === 0}
          <div class="text">
            <h2 class="slide-left">
              Bienvenue sur votre application de prise de notes.
            </h2>
            <div>
              <h3>
                <p>Memo s'appuie sur le format Markdown pour vous permettre de rédiger vos notes.... mais pas que!</p>
                <p>les plus de Memo:</p>
              </h3>
              
                <ul>
                  <li>
                    Possibilité de créer un lexique pour vos notes
                  </li>
                  <li>
                    Détection automatique des liens contenu dans vos notes et création d'une liste de liens
                  </li>
                  <li>
                    Simplicité de mise en page grâce à l'éditeur de texte
                  </li>
                </ul>
                <p>
                  Mais Memo c'est aussi mon passe-temps et un projet personnel. 
                  J'ai encore plein d'idées pour le développer encore plus.
                  Si vous avez des suggestions, des idées d'améliorations ou des bugs à signaler, n'hésitez pas à me contacter.
                </p>
            
            </div>
          </div>
        {:else}
          {#each $fullmemos as memo}
            <Card {memo} --color={memo.category.color} />
          {/each}
        {/if}
      </div>
    {:else}
  <div class="container_main-header">
      <h2>{selectedCategory.name}</h2>
      </div>
  <div class="container_main-main">
      {#if mem.length === 0}
        <p>pas de memo dans cette catégorie</p>
      {:else}
        {#each mem as memo}
          <Card {memo} --color={memo.category.color} />
    
        {/each}
        {/if} 
      </div>
        {/if}
    
    
    <NextBar {currentMemoIdx}/>
  </div>


<style>

  .slide-left {
    animation: slide-left 1s;
  }

  @keyframes slide-left {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }




  .text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 2rem;
    width: 65%;
  }
  .container_main-header {
    margin: 2rem;
    align-self: flex-start;
    margin-left: 2rem;
  }

  .container_main-header > h2 {
    font-size: 4rem;
  }

  .container_main {
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between ;
    align-items: center;
    width: 100%;
  }
  .container_main-main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }


</style>
