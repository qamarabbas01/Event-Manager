<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description = '' }: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/30 px-6 py-12 text-center"
>
	<p class="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</p>
	{#if description}
		<p class="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">{description}</p>
	{/if}
</div>
