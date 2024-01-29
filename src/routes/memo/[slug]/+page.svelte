<script>
  import hljs from 'highlight.js';
  import markdownit from 'markdown-it';
  import MainSidebar from '$lib/components/sidebar/MainSidebar.svelte';
  import Code from '$lib/components/text/Code.svelte';
  import Toc from '$lib/components/sidebar/Toc.svelte';
  import Paragraphe from '$lib/components/text/Paragraph.svelte';
  import Blockquote from '$lib/components/text/Blockquote.svelte';
  import Detail from '../../../lib/components/text/Detail.svelte';
  import NoteCard from '../../../lib/components/text/NoteCard.svelte';
  import { page } from '$app/stores';
  import { fullmemos } from '$lib/stores/fullmemos.js';
  import  {currentMemo} from '$lib/stores/currentMemo.js';
  import  NextBar  from '$lib/components/nextBar/NextBar.svelte';
  let isEditable = false;
  let color= 'red';
  // Actual default values
  const md = markdownit(
    {
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
          } catch (__) {}
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
      }
    }
  );
  
  const components = {
    noteCard: NoteCard,
    code: Code,
    paragraphe: Paragraphe,
    detail:Detail,
    blockquote: Blockquote  
  };
  
  let copyMemo;
  let pageSlug;
  let memo;
  let lexicon;
  let isDataReady = false;
  let currentMemoIdx;


const getFullMemo = async () => {
  const  response = await fetch('/api/fullmemo')
  return response.json();
}

  page.subscribe(async ($page) => {
    
    if ($fullmemos.length === 0) {
      await fullmemos.set(await getFullMemo());
      
    }
    
    pageSlug = $page.params.slug;
    memo = $fullmemos.find((m) => m.slug === pageSlug);
    if (memo) {
      color = memo.category.color;
      currentMemoIdx= $fullmemos.findIndex((m) => m.slug === pageSlug);
      copyMemo = JSON.parse(JSON.stringify(memo));
      if (copyMemo.contents){
        copyMemo.contents.forEach((item) => {
          parseText(item);
        });
        
        // on classe les items par position
        copyMemo.contents.sort((a, b) => a.position - b.position);
        memo.contents.sort((a, b) => a.position - b.position);
        isDataReady = true;
      }
    } else {
      console.log("no memo")
    }
  });
  
  
  
  
  function parseText(item) {
    const markdownRenderedContent = md.render(item.content);
    
    const tocRegex = /<(h[1-6])>(.*?)<\/\1>/g;
    const modifiedLines = [];
    
    let match;
    let lastIndex = 0;
    
    while ((match = tocRegex.exec(markdownRenderedContent)) !== null) {
      const headerTag = match[1];
      const headerContent = match[2];
      const id = `${headerContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const anchor = `<a name="  ${id}"></a>`;
      modifiedLines.push(markdownRenderedContent.substring(lastIndex, match.index) + `<${headerTag} style="color : ${color}" id="${id}">${anchor}${headerContent}</${headerTag}>`);
      lastIndex = match.index + match[0].length;
    }
    
    // Add the remaining content after the last match
    modifiedLines.push(markdownRenderedContent.substring(lastIndex));
    
    // Join modified lines without applying markdown rendering
    item.content = modifiedLines.join('');
    
    lexicon = $page.data.lexicon;
    
    lexicon.forEach(wordObj => {
      const word = wordObj.word;
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      // il faut que le mot soit entouré d'espace pour être remplacé
      if (item.content.match(regex)) {
        item.content = item.content.replace(regex, `<span class="lexical" style="color:gold">${word}</span>`);
      }
    });
  }
  
  
  
  
  
  $: currentMemo.set(memo)
  
  
  
  
</script>



<div class="container">
  
  <MainSidebar /> 
  <div class="container_main">
    <div class="content"  contenteditable="false">
      {#if isDataReady}
    
      <h2 id="memo-title">{copyMemo.title}</h2>
      {#if copyMemo}
      {#if copyMemo.contents}
      {#each copyMemo.contents as content (content.id)}
      {#if components[content.type.name]}
    
      <svelte:component
      {isEditable}
      this={components[content.type.name]}
      value={content.content}
      css={content.style.css}/>
      {:else}
      <p>{content.content}</p>
      {/if}
    
      {/each}
      {/if}
      {/if}
      {/if}
    </div>
    <div class="container_nextbar">
      <NextBar {currentMemoIdx}/>
    </div>
  </div>
  <Toc 
  title={copyMemo.title}
  doc={memo.contents}/>
</div>



<style>

h2{
  text-align: center;
  color: #bd9918;
}

  .container {
    display: flex;
    min-height: 100vh;
    min-width: 100vw;
  }

  .container_nextbar {
    width: 100%;
    padding: 1rem;
    display: flex;
    background-color: rgb(29, 32, 32);

    justify-content: center;
    border: 1px solid #818181;
  }
  .container_main {
    
    display: flex;
    flex-direction: column;
    justify-content: space-between ;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  
  
  .content {
    border-left : 1px solid #94d2bd;
    border-right : 1px solid #94d2bd;
    display: flex;
    color:var(--color-primary-5);
    flex-direction: column;
    padding: 20px;
    min-width: 100%;
    min-height: 95vh;
    widows: 15%;
    height: fit-content;
    background-color: var(--color-primary-2);

  }
  

</style>