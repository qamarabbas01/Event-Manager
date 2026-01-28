<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import SideBar from '$lib/components/SideBar.svelte';
	import "./app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen">
	<SideBar />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
