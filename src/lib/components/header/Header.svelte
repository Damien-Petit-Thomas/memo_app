<script>
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { reloadNeeded } from "$lib/stores/index.js";
    import hackEffect from "$lib/utils/hackEffect.js";
    import { onMount } from "svelte";
    export let data;

    const dispatch = createEventDispatcher();

    const logout = async () => {
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        if (response.ok) {
            reloadNeeded.set(true);
            window.location.href = "/";
        }
    };

    let showMenu = false;
    onMount(() => {
        hackEffect("#hack", 30, 5);
    });

    function showMenuToggle() {
        showMenu = !showMenu;
    }
</script>

<header>
    <div class="header-left">
        <h1 id="title">
            {#if $reloadNeeded === true}
                <a data-sveltekit-reload href="/"><span id="hack">Memo</span></a
                >
            {:else}
                <a href="/"><span id="hack">Memo</span></a>
            {/if}
        </h1>
    </div>
    <nav class="header-right">
        <a href="/lexicon">lexique</a>
        <a href="/links">liens utiles</a>
        <a href="/favorite">Favoris</a>
        {#if data?.user}
            <button type="submit" on:click={logout}>Log Out</button>
        {:else}
            <a href="/auth/signup">Inscription</a>
            <a href="/auth/login">Connexion</a>
        {/if}
        {#if !showMenu}
            <button id="burger" on:click={showMenuToggle}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        {/if}
        {#if showMenu}
            <button id="burger" on:click={showMenuToggle}> X </button>
        {/if}
    </nav>
    {#if showMenu}
        <div class="menu" transition:fly={{ x: 200, duration: 1000 }}>
            <a href="/test">Test</a>
            <a href="/">Option</a>
            <a href="/">Categorie</a>
            <a href="/">Tag</a>
            <a href="https://damiendevops.com" target="_blank">A propos</a>
            <a href="/">Contact</a>
            <a href="/">instruction</a>
        </div>
    {/if}
</header>

<style>
    .menu {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        position: absolute;
        top: 5vh;
        right: 0;
        backdrop-filter: blur(10px);
        background: transparent;
        color: #cdcdcd;
        font-weight: 700;
        text-align: center;
        margin: 0;
        padding: 0;
        z-index: 100;
        height: 90vh;
        width: 15%;
    }

    .menu a {
        text-decoration: none;
        font-weight: 700;
        font-size: 1.2rem;
        margin: 0 1rem;
        transition: all 0.2s ease-in-out;
        padding: 0.5rem;
        border-bottom: 1px solid transparent;
    }
    .menu a:hover {
        text-decoration: none;
        border-bottom: 1px solid #ffffff;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
    }

    #burger {
        flex-direction: column;
        justify-content: space-around;
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 10;
        position: relative;
        top: 0;
        right: 0;
        margin: 0;
    }
    #burger span {
        width: 30px;
        height: 3px;
        background: #cdcdcd;
        border-radius: 10px;
        transition: all 0.3s ease-in-out;
        position: relative;
        top: 0;
        right: 0;
        margin: 0;
    }

    h1 > a {
        color: #cdcdcd;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-right: 1.5rem;
        padding: 0;
        position: sticky;
    }

    h1 > a:hover {
        text-decoration: none;
    }

    .header-left,
    .header-right {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        font-weight: 200;
    }

    nav > a {
        text-decoration: none;
        font-weight: 700;
        font-size: 1.2rem;
        margin: 0 1rem;
        transition: all 0.2s ease-in-out;
    }
    nav > a:hover {
        text-decoration: none;
        border-bottom: 1px solid transparent;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
        border-bottom: 1px solid #ffffff;
    }

    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgb(30, 35, 48);
        color: #cdcdcd;
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
        color: black;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-right: 1.5rem;
        padding: 0;
        position: sticky;
    }
</style>
