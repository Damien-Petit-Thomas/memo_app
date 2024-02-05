<script>
  import { lexicon } from "$lib/stores/lexicon.js";
  import { onMount } from "svelte";
  export let categoryId;

  onMount(async () => {
    if ($lexicon.length === 0) {
      await lexicon.get();
    }
  });

  let word = "";
  let definition = "";
  function handleSubmit() {
    const data = { word, definition, category_id: categoryId };
    const newLexicon = lexicon.add(data);
    if (newLexicon) {
      word = "";
      definition = "";
      alert("mot ajouté");
    }
  }
</script>

<details>
  <summary> ajouter un mot au lexique </summary>
  <div class="container">
    <form action="">
      <input
        type="text"
        id="lexicon"
        placeholder="ajouter un mot"
        bind:value={word}
      />
      <label for="defintition">entrer une définitioin</label>
      <input
        type="text"
        id="definition"
        placeholder="ajouter une définition"
        bind:value={definition}
      />
      <input type="hidden" name="id" value={categoryId} />
      <button type="submit" on:click|preventDefault={handleSubmit}
        >Valider</button
      >
    </form>
  </div>
</details>

<style>
  details {
    cursor: pointer;
    margin: 0.5rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
