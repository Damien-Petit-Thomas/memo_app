<script>
	import { createEventDispatcher } from "svelte";
	export let value;
	export let isEditable = true;
	let isSave = true;
	let original = value;
	export let css = null;
const dispatch = createEventDispatcher();
if (isEditable === false) {
  isSave = false;
}
function handleKeyDown(e) {
  const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = 'paragraphe'

  if (trimmedInnerText === trimmedOriginal) {
    e.target.innerText = '';
  }

  if (e.ctrlKey && e.key === ' ') {
    e.preventDefault();
    isSave = true;
    dispatch('contentEdited', this.innerText.trim());
  } else {
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
}






</script>



<pre
style={css} 
contenteditable={isEditable}
on:keydown={handleKeyDown}
on:blur={handleBlur}
class:isSave={isSave}
class:isEditable={isEditable}
  >{@html value}</pre>



<style>

  pre {
    
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
	animation: notSave 3s infinite; 

  }

  pre.isSave {
    animation: save .5s 3;
  }



</style>