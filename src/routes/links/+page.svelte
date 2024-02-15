<script>
  import { onMount } from 'svelte';
  import { categories, memos, link } from '$lib/stores/index.js';
  let sortedLink = [];
  let groupeLink = {};
  export let data;
  const userId = data?.user?.id;
  let isConnect = false;
  if (userId) {
    isConnect = true;
  }
  onMount(async () => {
    if ($link.length === 0) {
      await  link.get(userId);
    }
    if ($memos.length === 0) {
      await memos.get(userId);
    }
    if ($categories.length === 0) {
      await categories.get(userId);
    }
    sortedLink = $link.slice().sort((a, b) => a.name.localeCompare(b.name));

    sortedLink.forEach(( link ) => {
      link.category = $categories.find(category => category.id === link.category_id)
      link.title = $memos.find(memo => memo.id === link.memo_id).title;
      const firstLetter = link.name.charAt(0).toUpperCase();
      groupeLink[firstLetter] = groupeLink[firstLetter] || [];
      groupeLink[firstLetter].push(link);
    });
  });


</script>


{#if isConnect}
<div class="lexicon">
  {#if $link.length === 0 }
    
    <p>Loading...</p>
  {:else}
    {#each Object.keys(groupeLink).sort() as firstLetter}
      <h2>{firstLetter}</h2>
      {#each groupeLink[firstLetter] as link (link.id)}
        <div class="word">
          <div class="word-word"><a href="{link.url}" target="_blank">{link.name}</a></div>
          <div class="word-word" 
            style="color: {link.category.color};"
          ><a href="/category{link.category.slug}">{link.category.name}</a></div>
          <!-- <div class="word-word">{link.group}</div> -->
          <div class="word-word"><a href="/{link.memo_slug}">{link.title}</a></div>
        </div>
      {/each}
    {/each}
  {/if}
</div>
{:else}
  <p>Vous devez être connecté pour pouvoir accéder à vos liens</p>
{/if}





    <style>

p{
  padding: 2rem;
}
    .lexicon {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
    }

    .word {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 20px;
    }

    .word-word {
      font-size: 1.5rem;
      font-weight: bold;
      padding-left: 1rem;
      border-left: 3px solid black;
       }

 

    h2 {
      display: inline-block;
      width: 80%;
      border-bottom: 3px solid black;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 20px;
    }








   </style>