<script>
	
	import { memos } from '$lib/stores/memo.js';
 	import { todos } from '$lib/stores/todo.js';
	import {categories} from '$lib/stores/category.js';
	import {tags} from '$lib/stores/tag.js'
	import { lexicon } from '$lib/stores/lexicon.js';
	import Sidebar from '../lib/components/sidebar/MainSidebar.svelte';
	import  { fullmemos } from '$lib/stores/fullmemos.js';
	import { link } from '$lib/stores/link.js'
	import Main from '../lib/components/main/Main.svelte';
	import {onMount} from 'svelte';
  export let data;
	let linkList = [];
	// on rempli les stores

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
		<Sidebar  on:showMemos={showMemos}/>
		<Main on:scroll {selectedCategory}/>
</div>




<style>



	.container {
		display: flex;
		width: 100vw;
		height: 92vh;
	}

	
</style>