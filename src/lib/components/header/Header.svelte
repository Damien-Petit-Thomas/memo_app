<script>
    import { reloadNeeded } from '$lib/stores/reloadNeeded.js';
    import  hackEffect  from '$lib/utils/hackEffect.js';
    import { onMount } from 'svelte';
    onMount(() => {
        
        hackEffect('#hack', 30, 5);
    });
</script>
<header>
    
    <div class="header-left">
        <h1 id="title">
            {#if $reloadNeeded === true}
            <a  
            data-sveltekit-reload
            href="/">Memo <span id="hack">Devops</span></a>
            {:else}
            <a href="/">Memo <span id="hack">Devops</span></a>
            {/if}
        </h1>
    </div>
    <nav  class="header-right">
        <a href="/">formation</a>
        <a href="/">blog</a>
        <a href="/">Tags</a>
        <a href="/">Favoris</a>
        <a href="/">A propos</a>
        <a href="/">Contact</a> 
    </nav>
</header>



<style>
        h1 > a {
        color : rgb(205, 205, 205);
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-right: 1.5rem;
        padding: 0;
        position:sticky;
    }

        h1 > a:hover {
            text-decoration: none   
        }


    .header-left, .header-right {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        font-weight: 200;
    }

  nav >  a { 
        text-decoration: none;
        font-weight: 700;
        font-size: 1.2rem;
        margin: 0 1rem;
        transition: all 0.2s ease-in-out;
    }
 nav >    a:hover {
        text-decoration: none;
        border-bottom: 1px solid transparent;
        padding-bottom: .5rem;
        padding-top: .5rem;
        border-bottom: 1px solid rgb(255, 255, 255);
    }

    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgb(30, 35, 48);
        color : rgb(205, 205, 205);
        font-weight: 700;
        text-align: center;
        margin: 0;
        padding: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        height: 5vh;
    }


    #title {
        
        color : black;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-right: 1.5rem;
        padding: 0;
        position: sticky;
    }
</style>