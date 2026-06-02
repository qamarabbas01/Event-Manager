<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';
	import { modalCloseAriaLabel } from '$lib/data/dashboard';

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
	let previouslyFocused: HTMLElement | null = null;

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

		if (e.key !== 'Tab' || !dialogRef) return;
		const focusable = Array.from(
			dialogRef.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
			return;
		}

		if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (!open) return;
		previouslyFocused = document.activeElement as HTMLElement | null;
		const handler = (e: KeyboardEvent) => handleKeydown(e);
		document.addEventListener('keydown', handler);
		queueMicrotask(() => {
			const firstFocusable = dialogRef?.querySelector<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			(firstFocusable ?? dialogRef)?.focus();
		});
		return () => document.removeEventListener('keydown', handler);
	});

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
			previouslyFocused?.focus();
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
			class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-h-[90vh] w-full max-w-lg flex flex-col transition-colors {className}"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div
				class="flex items-center justify-between shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700"
			>
				<h2 id="modal-title" class="text-xl font-semibold text-[#59452B] dark:text-amber-200">
					{title}
				</h2>
				<button
					type="button"
					onclick={close}
					class="p-2 rounded-full cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
					aria-label={modalCloseAriaLabel}
				>
					<X size={12} />
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
