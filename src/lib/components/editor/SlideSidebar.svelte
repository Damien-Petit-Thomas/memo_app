<script>
  import { fade } from "svelte/transition";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import remove from "$lib/assets/remove.svg";
  let griditems = [];
  import next from "$lib/assets/next.png";
  let itemsBackup = [];
  let blocItemsBackup = [];
  const dispatch = createEventDispatcher();
  let showStylesSelection = false;
  let availableStyle = [];
  let currentItem;
  let showGalery = false;
  let showBlock = false;
  export let totalPage = 1;
  let currentPage = 1;

  export let items;
  export let styles;
  function showStyles(item) {
    availableStyle = styles.filter((style) =>
      item.available_style.includes(style.id),
    );
    showBlock = true;
    showStylesSelection = !showStylesSelection;
  }

  function showBackground() {
    showGalery = !showGalery;
    dispatch("showGalery", showGalery);
  }

  function handleAction(action) {
    switch (action) {
      case "showBackground":
        showBackground();
        break;
      case "showBloc":
        showBlock = !showBlock;
        break;
      case "addPage":
        totalPage += 1;
        break;
      case "retour":
        showBlock = false;
        showBackground();
        break;
      case "remove":
        dispatch("remove");
        break;
      default:
        break;
    }
  }

  function handleCLick(item) {
    if (item.available_style !== null) {
      currentItem = item;
      showStyles(item);
    } else {
      showStylesSelection = false;
      dispatch("selectItem", [item]);
    }
  }

  function handleStyleClick(e) {
    currentItem.style = e.css;
    currentItem.style_id = e.id;

    dispatch("selectItem", [currentItem]);
    showStylesSelection = false;
  }

  const handlePrev = () => {
    currentPage -= 1;
    // dispatch("saveSlide");
    dispatch("page", currentPage);
  };

  const handleNext = () => {
    currentPage += 1;
    // dispatch("saveSlide");
    dispatch("page", currentPage);
  };

  const itemSize = { height: 40 };

  let actions = [
    { id: "page", name: "ajouter une page", action: "addPage" },
    { id: "texte", name: "bloc", action: "showBloc" },
    { id: "galery", name: "choisir un background", action: "showBackground" },
  ];


  const options = [
    { id: "remove", name: "supprimer", action: "remove" },
    { id: "retour", name: "retour"  , action: "retour" },
  ];


</script>

<div transition:slide={{ duration: 1000 }} class="main-container">
  <div class="container_nextbar">
    {#if totalPage === 1}
      <div class="container container-preview">
        <span>{currentPage}/{totalPage}</span>
      </div>
    {/if}
    {#if currentPage > 1}
      <div class="container container-preview">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
          on:click={handlePrev}
          class="prev"
          src={next}
          alt="fleche gauche"
        />

        <span>{currentPage - 1}/{totalPage}</span>
      </div>
    {/if}
    {#if totalPage > 1}
      <div class="container">
        <span>{currentPage}/{totalPage}</span>
      </div>
    {/if}

    {#if currentPage < totalPage}
      <div class="container container-next">
        <span>{currentPage + 1}/{totalPage}</span>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img on:click={handleNext} src={next} alt="fleche droite" />
      </div>
    {/if}
  </div>
</div>
<button on:click={() => dispatch("saveSlide", currentPage)}>
  Sauvegarder</button
>
<div></div>

{#each actions as item (item.id)}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click={() => handleAction(item.action)} class="actions">
      {item.name}
  
    {#if showGalery && item.id ==="galery"}
    <div
    class="sub-menu"
    transition:slide
    on:click={(e) => e.stopPropagation()}
  >
  {#each options as option (option.id)}
  <div on:click={() => handleAction(option.action)} class="actions">
    {option.name}
  </div>
  {/each}
  </div>
    {/if}
    {#if showBlock && item.name === "bloc"}
      <div
        class="sub-menu"
        transition:slide
        on:click={(e) => e.stopPropagation()}
      >
        {#each items as item (item.id)}
          <div on:click={() => handleCLick(item)} class="actions">
            {item.name}
          </div>
        {/each}
        {#if showStylesSelection}
          <div class="card" transition:slide>
            {#if availableStyle.length > 0}
              <h3 class="choice-title">choix du style de note</h3>
              <div class="style-item-wrapper">
                {#each availableStyle as style}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="actions"
                    aria-roledescription="style"
                    on:click={handleStyleClick(style)}
                  >
                    {style.name}
                  </div>
                {/each}
              </div>
            {:else}
              <p class="no-styles">No styles available</p>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/each}

<style>
  .container {
    vertical-align: baseline;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0.5rem;
    padding: 0.6rem;
    border-radius: 10px;
    background-color: #c2c2c2;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    width: 32%;
    height: 35px;
    color: #333;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #f5f5f5;
  }

  .container-preview {
    margin-right: auto;
  }

  .container-next {
    margin-left: auto;
  }

  .container_nextbar {
    background: #1f1f20;

    display: flex;

    width: 100%;
  }

  img {
    /* on assombrit l'image */
    filter: brightness(0.5);
    width: 25px;
  }

  img:hover {
    cursor: pointer;
    /* on remet l'image à la normale */
    filter: brightness(0.6);
  }

  img:active {
    /* on assombrit l'image */
    filter: brightness(0.3);
  }

  img.prev {
    transform: rotate(180deg);
  }

  .actions {
    margin: 0.2rem;
    color: #00d0ff;
    font-weight: 700;
    background-color: #1b1f2a;
    border: 1px solid #565656;
    transition: background-color 0.3s;
    padding: 0.5rem 1.5rem;
    transition: all 0.3s;
  }

  .actions:hover {
    background-color: #00d0ff;
    color: #1b1f2a;
    cursor: pointer;
  }
</style>






