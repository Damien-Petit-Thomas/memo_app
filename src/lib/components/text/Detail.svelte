<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  export let value;
  export let isEditable = true;
  let isSave = true;
  export let css = null;

  const dispatch = createEventDispatcher();
  const separation = "__@@__";

  let currentSummary;
  let currentDetail;
  let summary;
  let detail;
  onMount(() => {
    if (value === "detail") {
      value = `summary${separation}detail`;
    }

    // Initial split to set summary and detail
  [summary, detail] = value.split(separation);
  });

  function handleKeyDownDetail(e) {
    const trimmedInnerText = e.target.innerText.trim();


  if (trimmedInnerText === "detail") {
    e.target.innerText = '';
  }
    if (e.ctrlKey && e.key === " ") {
      e.preventDefault();
      currentDetail = trimmedInnerText;
      const finalstring = `${currentSummary}${separation}${currentDetail}`;
      dispatch("contentEdited", finalstring);
      isSave = true;
    } else {
      isSave = false;
    }
  }

  function handleKeyDownSummary(e) {
    const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = "summary"

  if (trimmedInnerText === trimmedOriginal) {
    e.target.innerText = '';
  }
    if (e.ctrlKey && e.key === " ") {
      e.preventDefault();
      currentSummary = trimmedInnerText;
      const finalstring = `${currentSummary}${separation}${currentDetail}`;
      dispatch("contentEdited", finalstring);
      isSave = true;
    } else {
      isSave = false;
    }
  }
</script>

{#if isEditable}
  ce texte sera visible
  <pre
    class="summary"
    style={css}
    contenteditable={isEditable}
    on:keydown={handleKeyDownSummary}
    class:isSave
    class:isEditable>
    {@html summary}
  </pre>
  ce texte sera caché
  <pre
    class="detail"
    style={css}
    contenteditable={isEditable}
    on:keydown={handleKeyDownDetail}
    class:isSave
    class:isEditable>
    {@html detail}
  </pre>
{:else}
  <pre>
    <details>
      <summary>{@html summary}</summary>
      {@html detail}
    </details>
  </pre>
{/if}

<style>
  pre {
    margin: 0 1rem 0 1rem;
  }
  pre.isEditable {
    border-left: 1px solid lightskyblue;
    color: rgb(174, 174, 189);
    animation: notSave 3s infinite;
  }

  .detail, .summary {
    width: 90%;
  }

  pre.isSave {
    animation: save 0.5s 3;
  }


  details {
  background-color: rgb(57, 57, 67);
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 0.5em 0.5em 0;
  color:rgb(253, 253, 253)
}

summary {
  background-color: #686868;

  cursor: pointer;
  font-weight: bold;
  margin: -0.5em -0.5em 0;
  padding: 0.5em;
}

details[open] {
  padding: 0.5em;
}

details[open] summary {
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5em;
}



</style>
