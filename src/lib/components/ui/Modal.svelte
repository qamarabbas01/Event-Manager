<script lang="ts">
	import type { Snippet } from 'svelte';
	import Close from './icons/Close.svelte';

	interface Props {
		open?: boolean;
		title?: string;
		onClose?: () => void;
		children?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(false),
		title = '',
		onClose,
		children,
		class: className = ''
	}: Props = $props();

	let dialogRef: HTMLDivElement | undefined = $state();

	function close() {
		open = false;
		onClose?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}

	$effect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => handleKeydown(e);
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	});

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			bind:this={dialogRef}
			role="document"
			class="bg-white rounded-2xl border border-gray-200 shadow-xl max-h-[90vh] w-full max-w-lg flex flex-col {className}"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between shrink-0 px-6 py-4 border-b border-gray-200">
				<h2 id="modal-title" class="text-xl font-semibold text-[#59452B]">
					{title}
				</h2>
				<button
					type="button"
					onclick={close}
					class="p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
					aria-label="Close"
				>
					<Close size={12} />
				</button>
			</div>
			<div class="flex-1 overflow-y-auto px-6 py-4">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}
