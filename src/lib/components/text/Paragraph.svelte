<script>
	import { createEventDispatcher } from "svelte";
	export let value;
	export let isEditable = true;
	let isSave = false;
  let isNotSave = false;
	let original = value;
	export let css = null;
  let isSaving = false;
const dispatch = createEventDispatcher();
if (isEditable === false) {
  isSave = false;
}
function handleKeyDown(e) {
  isSave = false;
  isNotSave = true;
  const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = 'paragraphe'

  if (trimmedInnerText === trimmedOriginal) {
    e.target.innerText = '';
  }
  if (e.ctrlKey && e.key === ' ') {
    e.preventDefault();
    isSave = true;
    isNotSave = false;
    dispatch('contentEdited', this.innerText.trim());
  } else {
    isNotSave = true;
    isSave = false;
  }
}


function handleBlur(e) {
  const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = 'paragraphe'

  if (trimmedInnerText === '') {
  return e.target.innerText = trimmedOriginal;
  }
  dispatch('contentEdited', trimmedInnerText);
  isSave = true;
  isNotSave = false;
}






</script>



<pre
style={css} 
contenteditable={isEditable}
on:keydown={handleKeyDown}
on:blur={handleBlur}
class:isSave={isSave}
class:isNotSave={isNotSave}
class:isEditable={isEditable}
  >{@html value}</pre>



<style>

  pre {
    border-left: 1px solid transparent;
    font-size: 17px;
    white-space: pre-wrap;
    min-height: 2rem;
    margin:0;
    margin: 0;
  }
  pre.isEditable {
    white-space: pre-wrap;
    padding-left: .2rem;
    width: fit-content;
    border-left: 1px solid lightskyblue;
    color: rgb(174, 174, 189);
	  /* animation: notSave 3s infinite;  */

  }

  pre.isSave {
    animation: save .5s 3;
  }

  pre.isNotSave {
    animation: notSave 3s infinite;
  }



</style>