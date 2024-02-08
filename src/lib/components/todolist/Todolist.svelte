<script>
	import { send, receive } from "$lib/utils/transition.js";
	import { flip } from "svelte/animate";
	export let store;
	export let done;
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
					on:change={(e) => store.mark(todo)}
				/>

				<span>{todo.description}</span>

				<button on:click={() => store.remove(todo.id)} aria-label="Remove" />
			</label>
		</li>
	{/each}
</ul>

<style>
	ul {
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
		margin: 0 0.3rem;
	}

	button {
		background-image: url($lib/assets/remove.svg);
		background-repeat: no-repeat;
		background-color: transparent;
		width: 20px;
		height: 20px;
	}
</style>
