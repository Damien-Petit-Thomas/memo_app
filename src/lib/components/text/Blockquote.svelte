<script>
	import { createEventDispatcher } from "svelte";
	export let value;
	export let isEditable = true;
	let isSave = true;
	export let css = null;
const dispatch = createEventDispatcher();



function handleKeyDown(e) {
  const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = "blockquote"

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
  const trimmedOriginal = 'summary'

  if (trimmedInnerText === '') {
  return e.target.innerText = trimmedOriginal;
  }
  dispatch('contentEdited', trimmedInnerText);
  isSave = true;
}


</script>

<pre>
	<blockquote 
	style={css} 
	contenteditable={isEditable}
	on:keydown={handleKeyDown}
	on:blur={handleBlur}
	class:isSave={isSave}
	class:isEditable={isEditable}
	>{@html value}</blockquote>
</pre>




<style>

pre {
	margin: 0 1rem 0 1rem;
}




blockquote.isEditable {
	background: rgb(53, 48, 48);
	border-left: 4px solid var(--color-orange);
	border-right: 4px solid var(--color-orange);
	padding: 2.4rem;
	margin: 0 auto;
  width: 90%;
	border-radius: 0.4rem;
	font-weight: bold !important;
	color: var(--color-preview-qoute-body) !important;     
	animation: notSave 3s infinite; 
}



blockquote.isSave {
animation: save .5s 3;
}

</style>