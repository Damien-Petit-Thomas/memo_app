<script>
	import { createEventDispatcher } from "svelte";
	export let value;
	export let isEditable = true;
	let isSave =  true;
	export let css = null;
const dispatch = createEventDispatcher();


function handleKeyDown(e) {
  const trimmedInnerText = e.target.innerText.trim();
  const original = 'titre'

  if (trimmedInnerText === original) {
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
  const trimmedOriginal = 'titre'

  if (trimmedInnerText === '') {
  return e.target.innerText = trimmedOriginal;
  }
  dispatch('contentEdited', trimmedInnerText);
  isSave = true;
}

</script>

<pre>
  <h2 
  style={css} 
	contenteditable={isEditable}
	on:keydown={handleKeyDown}
  on:blur={handleBlur}
  class:isSave={isSave}
  class:isEditable={isEditable}
  >{value}
</h2>
</pre>

<style>

  pre {
    margin: 0 1rem 0 1rem;
  }
  h2.isEditable {
      text-align: center;
      font-weight: bold;
      color: var(--color-preview-title);
      animation: notSave 3s infinite; 
      border-left: 1px solid lightskyblue;

  }



  h2.isSave {
    animation: save .5s 3;
  }
</style>
