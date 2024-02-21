<script>
  import { onNavigate } from '$app/navigation';

  import "../app.pcss";
  import Header from "$lib/components/header/Header.svelte";
  import Footer from "$lib/components/footer/Footer.svelte";
  export let data;
onNavigate((navigation) => {
	if (!document.startViewTransition) {
    return;
  }

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
 
  import "../styles/global.css";


</script>

<main>
  <Header {data}  />

  <slot />

  <Footer />
</main>

<style>
  main {
    overflow: scroll;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
</style>
