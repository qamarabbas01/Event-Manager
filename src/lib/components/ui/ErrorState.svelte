<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		onRetry?: (() => void) | undefined;
		retryLabel?: string;
	}

	let {
		title = 'Something went wrong',
		description = 'Please try again.',
		onRetry,
		retryLabel = 'Retry'
	}: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-6 py-10 text-center"
	role="alert"
>
	<p class="text-base font-semibold text-red-800 dark:text-red-200">{title}</p>
	<p class="mt-1 max-w-md text-sm text-red-700 dark:text-red-300">{description}</p>
	{#if onRetry}
		<button
			type="button"
			onclick={onRetry}
			class="mt-4 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
		>
			{retryLabel}
		</button>
	{/if}
</div>
