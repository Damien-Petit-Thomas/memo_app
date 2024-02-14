<script>
  import hljs from "highlight.js/lib/core";
  import javascript from "highlight.js/lib/languages/javascript";
  import "highlight.js/styles/atom-one-dark.css";

  let hljsElement;

  hljs.registerLanguage("javascript", javascript);

  import { createEventDispatcher } from "svelte";
  export let value;
  export let isEditable = true;
  let isSave = true;
  export let css = null;
  const dispatch = createEventDispatcher();
  let trimmedInnerText = value;
  import { onMount } from "svelte";

  onMount(() => {
    highlight(); // Highlight code when the component is mounted
  });

  const highlight = () => {
    hljs.highlightBlock(hljsElement);
  };


  function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }


  function handleKeyDown(e) {
    const plainTextContent = stripHtmlTags(e.target.innerHTML.trim());
 
    trimmedInnerText = plainTextContent;
    const trimmedOriginal = "code";

    if (trimmedInnerText === trimmedOriginal) {
      e.target.innerText = "";
    }

    if (e.ctrlKey && e.key === " ") {
      e.preventDefault();
      dispatch("contentEdited", trimmedInnerText);
      isSave = true;
    } else {
      isSave = false;
    }
  }

  function stripHtmlTags(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

</script>

<svelte:document on:paste={handlePaste} />


{#if value}
  <div class="container">
    <button
      class="fa-regular"
      on:click={(e) => {
        navigator.clipboard.writeText(stripHtmlTags(hljsElement.innerText) || value);
        e.target.class= "checked";
      }}
    ></button>
    <pre
      style={css}
      bind:this={hljsElement}
      contenteditable={isEditable}
      on:keydown={handleKeyDown}
      class:isSave
      class:isEditable>
      <code>{@html value}</code>
    </pre>
  </div>
{/if}

<style>
  .container {

  max-width: 80%;
    margin : 0 1rem 0 1rem;
    position: relative;
  }

  @keyframes copy {
    0% {
      background-image: url($lib/assets/check.svg);
    }
    100% {
      background-image: url($lib/assets/copy-regular.svg);
    }
  }

 

 button.fa-regular {
    margin: 0;
    border-bottom: 1px solid rgb(66, 66, 66);
    border-left: 1px solid rgb(66, 66, 66);
    background-color: rgba(128, 128, 128, 0.589);
    background-image: url($lib/assets/copy-regular.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 40%;
    border-bottom-left-radius: 15px;
    min-width: 60px;
    min-height: 35px;
    position: absolute;
    top: 0;
    right: 0;
  }

  button.fa-regular:hover {
    background-color: rgba(0, 65, 243, 0.589);

  }

  button.fa-regular:active   {
    background-color: rgba(128, 128, 128, 0.589);
    animation: copy 8s 1;
  
  }



  pre {
    min-height: 35px;
  }

  pre.isEditable {
    border-left: 1px solid lightskyblue;

    color: rgb(174, 174, 189);
    animation: notSave 3s infinite;
  }

  pre.isSave {
    animation: save 0.5s 3;
  }
</style>
