<script>
	import { todos , categories, tags} from '$lib/stores/index.js';
	import {onMount} from 'svelte';
	import {currentMemo} from '$lib/stores/index.js';
	export let data;
	import { goto } from '$app/navigation';
const userId = data?.user?.id;
let isConnect = false;
  if (userId) {
    isConnect = true;
  }
	import Categorielist from '$lib/components/createList/CreateList.svelte';
	import TodoList from '$lib/components/todolist/Todolist.svelte';


onMount(async () => {
	if ($categories.length === 0 && userId) {
		categories.get(userId)

	}
	if ($tags.length === 0 && userId) {
		tags.get(userId)
	}

});

async function handleSubmit(e) {
if (e.key !== 'Enter') return;
const description = e.currentTarget.value;
let data = {}
data.description = description
data.user_id = userId
todos.add(data)
e.currentTarget.value = ''
}

const handleClick = () =>{
	if (!isConnect) {
		goto('/auth/login')
	}
	currentMemo.set({})
	goto('/admin/editor')
}

const handleClickSLides = () =>{
	if (!isConnect) {
		goto('/auth/login')
	}
	currentMemo.set({})
	goto('/admin/editor/slides')
}





	
</script>

<div class="container_main">
	<div class="container_todo">
		<div class="wrapper_todo-header">
			<h3>TODO LIST</h3>
				<input
				on:keydown={handleSubmit}
				name="description"
				autocomplete="off"
				placeholder="ajouter une tâche"
				type="text"
				/>
		</div>
		<div class="wrapper">
			<div class="todo">
				<h2>À FAIRE</h2>
				<TodoList store={todos}  done={false} />
			</div>
			<div class="done">
				<h2>EN COURS</h2>
				<TodoList
				store={todos}
				done={true}
				/>
			</div>
		</div>
	</div>
	
	<div class="container-form">
		
		<Categorielist
		store={categories}
		{userId}
		title="créer une catégorie"
		/>
		<Categorielist 
		{userId}
		title="créer un tag"
		store={tags} />
	</div>
	
</div>



<button class='btn btn-create-memo' on:click={handleClick}>

	créer un memo
</button>
<button class='btn btn-create-memo' on:click={handleClickSLides}>

	créer des slides
</button>


{#if !isConnect}
<div class="msg">
	<p>
		Vous devez être <a style="text-decoration: underline;" href="/auth/login">connecté</a> pour profiter des différentes fonctionnalités de l'application 
	</p>
</div>
{/if}



<style>
	.msg {
		text-align: center;
		margin-top: 2rem;
	}
  



	
	.btn {
		border-radius: 0;
		align-self: center;
		background: none;
		width: 15rem;
		border: 1px solid rgb(151, 135, 135);
		padding: 1rem;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 1rem;
		margin: 1rem;
		cursor: pointer;
	}

	.btn:hover {
		border-top :1px solid transparent;
		border-bottom : 1px solid transparent;
		box-shadow: none;
		width: 20rem;
	}

	a:hover {
		text-decoration: none;
	}


	.container-form {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	
	.container_todo {
		border: 1px solid rgb(151, 135, 135);

		padding: 1rem;
		width : 50%;
		gap:2rem;
		display: flex;
		flex-direction: column;
	}
	
	.container_todo input[type="text"] {
		padding: 0.5rem;
		margin-top: 1rem;
		width: 100%;
	}
	
	.wrapper {
		
		display: flex;
		flex-direction: row;
		
		justify-content: space-between;
	}
	
	.container_main {

		
		gap: 3rem;
		justify-content: space-between;
		display: flex;
		margin: 2rem;
	}
	
	
	
	h2 {
		font-size: 2em;
		font-weight: 200;
	}
</style>
