<script>
	import { send, receive } from '$lib/utils/transition.js';
	import { flip } from 'svelte/animate';
	export let store;
	export let done ;


async function handleChange(todo){
	const response = await fetch('/api/todo', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ todo })
	});
	if (response.ok) {
		const updatedTodo = await response.json();
		store.update($store => {
			const index = $store.findIndex(todo => todo.id === updatedTodo.id);
			$store[index] = updatedTodo;
			return $store;
		});
	}
}

async function handleDelete(todoId){
	const response = await fetch('/api/todo', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ todoId })
	});
	if (response.ok) {
		store.update(($store) => $store.filter(todo => todo.id !== todoId));
		}
	}






</script>

<ul class="todos">
	{#each $store.filter((todo) => todo.done === done) as todo (todo.id)}
	<li
	class:done
	in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
  animate:flip={{ duration: 300 }}

	>
	<label>
		<input
		type="checkbox"
		checked={todo.done}
		on:change={handleChange(todo)}
		/>
		
		<span>{todo.description}</span>

		<button on:click={handleDelete(todo.id)} aria-label="Remove" />
		</label>
	</li>
	{/each}
</ul>

<style>
	
	ul{
		list-style: none;
	}
	
	
	
	
	
	label {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center; 
	}
	
	
	span {
		flex: 1;
	}
	
	li span {
		margin : 0 .3rem;
	}
	
	
	
	button {
		background-image: url($lib/assets/remove.svg);
		background-repeat: no-repeat;
		background-color: transparent;
		width: 20px;
		height: 20px;
	}
</style>