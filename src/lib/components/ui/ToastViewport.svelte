<script lang="ts">
	import { CircleCheck, CircleAlert, Info, X } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toast';

	function getTypeClasses(type: 'success' | 'error' | 'info'): string {
		if (type === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
		if (type === 'error') return 'border-red-200 bg-red-50 text-red-900';
		return 'border-blue-200 bg-blue-50 text-blue-900';
	}
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-4 z-80 mx-auto flex w-full max-w-md flex-col gap-2 px-4"
	aria-live="polite"
	aria-atomic="true"
>
	{#each $toastStore as toast (toast.id)}
		<div
			class="pointer-events-auto rounded-xl border shadow-sm backdrop-blur px-3 py-3 dark:bg-gray-900/90 dark:text-gray-100 {getTypeClasses(toast.type)}"
			role="status"
		>
			<div class="flex items-start gap-2.5">
				<div class="mt-0.5 shrink-0">
					{#if toast.type === 'success'}
						<CircleCheck size={16} />
					{:else if toast.type === 'error'}
						<CircleAlert size={16} />
					{:else}
						<Info size={16} />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-semibold">{toast.title}</p>
					{#if toast.message}
						<p class="mt-0.5 text-xs opacity-90">{toast.message}</p>
					{/if}
				</div>
				<button
					type="button"
					class="shrink-0 rounded p-1 hover:bg-black/10 dark:hover:bg-white/10"
					onclick={() => toastStore.dismiss(toast.id)}
					aria-label="Dismiss notification"
				>
					<X size={14} />
				</button>
			</div>
		</div>
	{/each}
</div>
