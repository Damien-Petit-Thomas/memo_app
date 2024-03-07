<script>
	
	import { todos , categories, tags, lexicon, memos, link, fullmemos} from '$lib/stores/index.js';
	import Sidebar from '../lib/components/sidebar/MainSidebar.svelte';
	import Main from '../lib/components/main/Main.svelte';
	import {onMount} from 'svelte';
  export let data;
	const userId = data?.user?.id;
	let isConnect = false;
	if (userId) {
		isConnect = true;
	}
	let linkList = [];

	onMount(() => {
		fullmemos.set(data.fullmemos);
		categories.set(data.categories);
		tags.set(data.tags);
		memos.set(data.memos);
		todos.set(data.todos);
		lexicon.set(data.lexicon);
		link.set(data.links);
		if (linkList.length > 0) {
			linkList = [];
		}
		$link.forEach((link) => linkList.push(link.url))
		
		
	});
	let selectedCategory;
	function showMemos(e) {
		selectedCategory = e.detail;
	}
	






				</script>





<div class="container">
		<Sidebar {data} on:showMemos={showMemos}/>
		<Main on:scroll {isConnect} {selectedCategory}/>
</div>




<style>



	.container {
		overflow: auto;
		display: flex;
		width: 100%;
		height: 100%;
	}

	
</style>