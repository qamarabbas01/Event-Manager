<script lang="ts">
	import { tick } from 'svelte';
	import Arrowleft from './icons/Arrowleft.svelte';
	import RightArrow from './icons/RightArrow.svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		maxVisible?: number;
		scrollTarget?: string | null;
		scrollOffset?: number;
		width?: string;
		buttonBg?: string;
	}

	let {
		currentPage,
		totalPages,
		onPageChange,
		maxVisible = 5,
		scrollTarget = null,
		scrollOffset = 20,
		width = 'max-w-3xl',
		buttonBg = 'bg-[#E8E2DB]'
	}: Props = $props();

	const pageNumbers = $derived.by(() => {
		if (totalPages <= 1) return [];

		const pages: (number | '...')[] = [];
		const half = Math.floor(maxVisible / 2);

		let start = Math.max(1, currentPage - half);
		let end = Math.min(totalPages, currentPage + half);

		if (start > 1) {
			pages.push(1);
			if (start > 2) pages.push('...');
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (end < totalPages) {
			if (end < totalPages - 1) pages.push('...');
			pages.push(totalPages);
		}

		return pages;
	});

	async function scrollToTarget() {
		if (!scrollTarget) return;
		await tick();

		const id = scrollTarget.startsWith('#') ? scrollTarget.slice(1) : scrollTarget;

		const el = document.getElementById(id);
		if (!el) return;

		const top = el.getBoundingClientRect().top + window.pageYOffset - scrollOffset;

		window.scrollTo({ top, behavior: 'smooth' });
	}

	async function goToPage(page: number) {
		if (page === currentPage || page < 1 || page > totalPages) return;
		onPageChange(page);
		await scrollToTarget();
	}
</script>

{#if totalPages > 1}
	<nav
		aria-label="Pagination"
		class="mx-auto flex {width} flex-wrap items-center justify-between gap-3 px-2 sm:px-0"
	>
		<button
			aria-label="Previous page"
			disabled={currentPage === 1}
			onclick={() => goToPage(currentPage - 1)}
			class="flex items-center gap-2 rounded-full {buttonBg} px-4 py-2 text-sm font-semibold text-[#59452B]
		       transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Arrowleft size={14} />
			<span class="hidden sm:inline">Back</span>
		</button>

		<div class="flex items-center gap-1 sm:gap-2">
			{#each pageNumbers as page, idx (typeof page === 'number' ? page : `ellipsis-${idx}`)}
				{#if page === '...'}
					<span class="px-2 text-sm text-gray-500">…</span>
				{:else}
					<button
						aria-label={`Go to page ${page}`}
						aria-current={page === currentPage ? 'page' : undefined}
						onclick={() => goToPage(page)}
						class="flex h-9 w-9 items-center cursor-pointer justify-center rounded-full text-sm font-semibold
					transition
					{page === currentPage
							? 'bg-orange-300 text-brand-primary'
							: 'bg-[#E8E2DB] text-[#59452B] hover:bg-brand-gray-3'}"
					>
						{page}
					</button>
				{/if}
			{/each}
		</div>

		<button
			aria-label="Next page"
			disabled={currentPage === totalPages}
			onclick={() => goToPage(currentPage + 1)}
			class="flex items-center gap-2 rounded-full {buttonBg} px-4 py-2 text-sm font-semibold text-[#59452B]
		       transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<span class="hidden sm:inline">Next</span>
			<RightArrow size={14} />
		</button>
	</nav>
{/if}
