<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Loading...' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-10 text-center" role="status" aria-live="polite">
	<div
		class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400"
		aria-hidden="true"
	></div>
	<p class="mt-3 text-sm text-gray-600 dark:text-gray-400">{label}</p>
</div>
