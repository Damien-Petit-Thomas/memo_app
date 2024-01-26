<script>
  import { createEventDispatcher } from "svelte";
  export let value;
  export let isEditable = true;
  let isSave = true;
  let original = value;
  export let css = null;
  const dispatch = createEventDispatcher();
  import warning from '$lib/assets/warning.svg'
  
  
  function handleKeyDown(e) {
    const trimmedInnerText = e.target.innerText.trim();
    const trimmedOriginal = "noteCard"
    
    if (trimmedInnerText === trimmedOriginal) {
      e.target.innerText = '';
    }
    
    if (e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      dispatch('contentEdited', trimmedInnerText);
      isSave = true;
    } else {
      isSave = false;
    }
  }
  function handleBlur(e) {
    const trimmedInnerText = e.target.innerText.trim();
    const trimmedOriginal = 'noteCard'
    
    if (trimmedInnerText === '') {
      return e.target.innerText = trimmedOriginal;
    }
    dispatch('contentEdited', trimmedInnerText);
    isSave = true;
  }
  
  
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<pre>
  <div class="note-card"
  class:isSave={isSave}
  style={css} 
  >
  <img class="img" title="warning" alt='exclamation point' src={warning} />
  <div  aria-label='note card'
  class="note-text"
  contenteditable={isEditable}
  on:keydown={handleKeyDown}
  on:blur={handleBlur}
  class:isEditable={isEditable}
  >
  {@html value}
</div>
</div>
</pre>




<style>
  
  
  
  
  
  
  div.note-card {
    display:flex ;
    align-items: center;
    justify-content: flex-start;
    color:white;
    background: #09273d;
    border: 1px solid #696969;
    border-left: 4px solid #5E9EFF;
    border-radius: .25rem;
    font-family: Roboto Slab;
    padding: 1rem 1rem 1rem 1.5rem;
    margin: 0 auto; 
    min-height: 2rem;
    width: 90%;
    height: fit-content;
    animation: notSave 3s infinite; 
  }
  
  .note-text {
    display:flex;
    margin-left: 1rem;
    max-width: 95%;
  }	
  
  img{
    width: 1.5rem;
    height: 1.5rem;
  }
  
  div.note-card.isSave {
    animation: save .5s 3;
  }
  
</style>