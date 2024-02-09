<script>
  import { fullmemos } from "$lib/stores/index.js";
  import Card from "$lib/components/card/Card.svelte";
  export let currentMemoIdx;
</script>
<div class="container_nextbar">
  {#if $fullmemos !== null && $fullmemos.length > 0}
    {#if $fullmemos.length === 1}
      <Card
        --width="20%"
        --padding=".8rem"
      >
        <div>pas de memo précédant</div>
      </Card>
      <Card
        --width="20%"
        --padding=".8rem"
      >
        <div>pas de memo suivant</div>
      </Card>
    {:else}
      {#if $fullmemos.length === 2}
        {#if currentMemoIdx === 0}
          <Card
            memo={$fullmemos[1]}
            --color={$fullmemos[1].category.color}
            --width="20%"
            --padding="1.8rem"
          >
            <div><p>suivant</p></div>
          </Card>
        {:else}
          <Card
            memo={$fullmemos[0]}
            --color={$fullmemos[0].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="preview">précédent</p></div>

          </Card>
        {/if}
      {:else}
        {#if currentMemoIdx === 0}
          <Card
            memo={$fullmemos[$fullmemos.length - 1]}
            --color={$fullmemos[$fullmemos.length - 1].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="preview">précédent</p></div>

          </Card>
          <Card
            memo={$fullmemos[currentMemoIdx + 1]}
            --color={$fullmemos[currentMemoIdx + 1].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="next">suivant</p></div>

          </Card>
        {:else if currentMemoIdx === $fullmemos.length - 1}
          <Card
            memo={$fullmemos[currentMemoIdx - 1]}
            --color={$fullmemos[currentMemoIdx - 1].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p>précédent</p></div>

          </Card>
          <Card
            memo={$fullmemos[0]}
            --color={$fullmemos[0].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="preview" >suivant</p></div>

          </Card>
        {:else}
          <Card
            memo={$fullmemos[currentMemoIdx - 1]}
            --color={$fullmemos[currentMemoIdx - 1].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="preview">précédent</p></div>

          </Card>
          <Card
            memo={$fullmemos[currentMemoIdx + 1]}
            --color={$fullmemos[currentMemoIdx + 1].category.color}
            --width="20%"
            --padding=".8rem"
          >
          <div><p class="next">suivant</p></div>

          </Card>
        {/if}
      {/if}
    {/if}
  {/if}
</div>


<style>


p.next{
  background-size: 100% 3px;
  background: linear-gradient(#4d4668 0 0) calc(100% - var(--p,0%)) / var(--p,0%) no-repeat;
  transition: .4s, background-position 0s;
}
p.preview{
  background: linear-gradient(#4d4668 0 0) var(--p, 0) / var(--p, 0) no-repeat;
  transition: .4s, background-position 0s;
  
}

p.next:hover{
  --p: 100%;
  color: #fff;
}

p.preview:hover{
  --p: 100%;
  color: #fff;
}







  



  .container_nextbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    
    margin: 2rem;
  }
</style>
