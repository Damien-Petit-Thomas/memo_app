<script>
	import { createEventDispatcher } from "svelte";
	export let value;
	export let isEditable = true;
  let src= value;
	let isSave = true;
	let original = value;
	export let css = null;
const dispatch = createEventDispatcher();
if (isEditable === false) {
  isSave = false;
}

function handleKeyDown(e) {
  const trimmedInnerText = e.target.innerText.trim();
  const trimmedOriginal = 'entrer l\'adresse de l\'image'

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
  src = e.target.innerText;
  // on verifie si l'adresse de l'image est valide


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
  ><span>{@html value}</span>

<img 
{src}
 alt="">
</pre> 
 
  



<style>

  pre {
    padding: 1rem;
    width: 90%;
    margin: 0 1rem 0 1rem;
  }

  pre span {
    display: none;
  }
  pre.isEditable {
    border-left: 1px solid lightskyblue;
    color: rgb(174, 174, 189);
	animation: notSave 3s infinite; 
  }

  pre.isEditable span {
    display: block;
  }

  pre.isSave {
    animation: save .5s 3;
  }



</style>