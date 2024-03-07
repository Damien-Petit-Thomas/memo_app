<script>
  import { fly, fade } from "svelte/transition";
  import { fullmemos } from "$lib/stores/index.js";
  import NextBar from "../nextBar/NextBar.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import email from "$lib/assets/email.svg";
  import github from "$lib/assets/github.svg";
  import linkedin from "$lib/assets/linkedin.svg";
  export let isConnect = false;
  export let selectedCategory;
  let currentPage = 1;
  let totalPage = 0;
  let availableMemo = [];
  let numberTotalMemo = 0;
  
  $: memoCategory = $fullmemos.filter(
    (memo) => memo.category.id === selectedCategory?.id && memo.type === "memo"
    );
  $: memoCategory.length > 0
    ? (numberTotalMemo = memoCategory.length)
    : (numberTotalMemo = $fullmemos.length);
  $: totalPage = Math.ceil(numberTotalMemo / 12);
  $: if (selectedCategory) {
    currentPage = 1;
    availableMemo = memoCategory.slice(0, 12);
  }
  $: if ($fullmemos !== undefined) {
    selectedCategory ? (availableMemo = memoCategory.slice(0, 12)) : (availableMemo = $fullmemos.slice(0, 12));
  }

  const handleChanPage = (event) => {
    currentPage = event.detail;
    if (selectedCategory) {
      availableMemo = memoCategory.slice((currentPage - 1) * 12, currentPage * 12);
    } else {
      availableMemo = $fullmemos.slice((currentPage - 1) * 12, currentPage * 12);
    }

  };
</script>

<div class="container">
  <div class="container_main">
    {#if !isConnect}
      <div class="text">
        <h2 class="slide-left text-title">
          Bienvenue sur votre application de prise de notes!!
        </h2>
        <div class="text-main">
          <h3 class="slide-top">
            <p>
              Memo s'appuie sur le format Markdown pour vous permettre de
              rédiger vos notes.... mais pas que!
            </p>
          </h3>
          <p class="slide-right">
            les plus de <span class="strong">Memo</span>:
          </p>

          <ul>
            <li style="--delay:1">
              Possibilité de créer un lexique pour vos notes
            </li>
            <li style="--delay:2">
              Détection automatique des liens contenu dans vos notes et création
              d'une liste de liens
            </li>
            <li style="--delay:3">
              Simplicité de mise en page grâce à l'éditeur de texte
            </li>
          </ul>
          <div class="social-wrapper">
            <p style="--delay:4" class="slide-bottom">
              Mais Memo c'est aussi mon passe-temps et un projet personnel. J'ai
              encore plein d'idées pour le développer encore plus. Si vous avez
              des suggestions, des idées d'améliorations ou des bugs à signaler,
              n'hésitez pas à me contacter.
            </p>
            <div class="social slide-right">
              <a href="https://github.com/Damien-Petit-Thomas" target="_blank"
                ><img src={github} alt="logo github" style="--delay:1" /></a
              >
              <a
                href="http://www.linkedin.com/in/damien-petit-thomas"
                target="_blank"
                ><img src={linkedin} alt="logo github" style="--delay:2" /></a
              >
              <a href="mailto:damien.petit.thomas@gmail.com" target="_blank"
                ><img src={email} alt="logo github" style="--delay:3" /></a
              >
            </div>
          </div>
        </div>
      </div>
    {:else if !selectedCategory}
      <div class="container_main-header">
        <h2>Accueil</h2>
      </div>
      <div class="container_main-main">
        {#if $fullmemos === undefined}
          <p>Chargement des données</p>
        {:else}
          {#each availableMemo as memo}
            <Card {memo} --color={memo.category.color} />
          {/each}
        {/if}
      </div>
    {:else}
      <div class="container_main-header">
        <h2>{selectedCategory.name}</h2>
      </div>
      <div class="container_main-main">
        {#if memoCategory.length === 0}
          <p>pas de memo dans cette catégorie</p>
        {:else}
          {#each availableMemo as memo}
            <Card {memo} --color={memo.category.color} />
          {/each}
        {/if}
      </div>
    {/if}
  </div>
  <NextBar on:changePage={handleChanPage} {totalPage} {currentPage} />
</div>

<style>
  .slide-left {
    animation: slide-left 1.5s;
  }
  .slide-top {
    animation: slideTop 1.5s;
  }
  .slide-right {
    animation: slide-right 1.5s;
  }
  .text li {
    opacity: 0;
    transform: translateX(-100%);
    animation: slide-left 5s ease forwards;
    animation-delay: calc(0.4s * var(--delay));
  }
  .slide-bottom {
    opacity: 0;
    transform: translateY(100%);
    animation: slide-bottom 5s ease forwards;
    animation:
      Zoom 1.5s ease forwards,
      Float 4s ease-in-out infinite;
    animation-delay: calc(1s * var(--delay));
  }

  .social {
    display: none;
  }

  .social img {
    width: 3rem;
    height: 3rem;
    margin: 0.3rem;
    cursor: pointer;
    background-color: #fff;
    border-radius: 5px;
    transition: transform 0.2s ease-in-out;
  }

  .social-wrapper:hover .social {
    display: flex;
    animation: slide-right 1.5s ease forwards;
  }

  @keyframes slide-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-bottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
  @keyframes slideTop {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }
  @keyframes Zoom {
    0% {
      scale: 0;
      opacity: 0;
    }
    100% {
      scale: 1;
      opacity: 1;
    }
  }
  @keyframes Float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .strong {
    font-weight: 700;
  }
  .text-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
  }

  .text {
    color: #c8baba;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 2rem;
    width: 65%;
  }

  .text-title {
    color: #00d0ff;
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
    height: 100%;
    background: #1f1f20;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .container_main-main {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-evenly;
    width: 85vw;
    height: 100%;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
