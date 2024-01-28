<script>
	import { memos } from '$lib/stores/memo.js';
	import { todos } from '$lib/stores/todo.js';
	import {onMount} from 'svelte';

	import {categories} from '$lib/stores/category.js';
	import {tags} from '$lib/stores/tag.js'
	import Categorielist from '$lib/components/createList/CreateList.svelte';
	import TodoList from '$lib/components/todolist/Todolist.svelte';
    import { get } from 'svelte/store';
	// export let data;


async function getCategory(){
	const  response = await fetch('/api/category')
	return response.json();
}
async function getTag(){
	const  response = await fetch('/api/tag')
	return response.json();
}

async function getTodo(){
	const  response = await fetch('/api/todo')
	return response.json();
}

onMount(async () => {
	if ($categories.length === 0) {
		categories.set(await getCategory())
	}
	if ($tags.length === 0) {
		tags.set(await getTag())
	}
	if ($todos.length === 0) {
		todos.set(await getTodo())

	}
});

async function handleSubmit(e) {
if (e.key !== 'Enter') return;
const description = e.currentTarget.value;
const response = await fetch('/api/todo', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ description })
});

if (response.ok) {
	const newTodo = await response.json();
	todos.update($todos => [...$todos,  newTodo]);
	e.target.value = '';
}
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
		storeName={"category"}
		title="créer une catégorie"
		/>
		<Categorielist 
		title="créer un tag"
		storeName={"tag"}
		store={tags} />
	</div>
	
</div>



<button class='btn btn-create-memo'>
	<a href="/admin/create-memo" >créer un memo</a>
</button>
<style>
	
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
		border-top : none;
		border-bottom : none;
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
