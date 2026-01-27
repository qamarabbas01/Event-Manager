<script lang="ts">
	import { tick } from 'svelte';
	import Arrowleft from './icons/Arrowleft.svelte';
	import RightArrow from './icons/RightArrow.svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		maxVisible?: number;
		backText?: string;
		nextText?: string;
		scrollTarget?: string | null;
		scrollOffset?: number;
		width?: string;
		buttonBg?: string;
	}

	let {
		currentPage,
		totalPages,
		onPageChange,
		maxVisible = 3,
		backText = 'Back',
		nextText = 'Next',
		scrollTarget = null,
		scrollOffset = 20,
		width = 'max-w-[779px]',
		buttonBg = 'bg-sand',
	}: Props = $props();

	const pageNumbers = $derived.by(() => {
		if (totalPages <= 1) return [];

		const pages: number[] = [];
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let end = Math.min(totalPages, start + maxVisible - 1);

		if (end - start < maxVisible - 1) {
			start = Math.max(1, end - maxVisible + 1);
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	});

	async function scrollToTarget(): Promise<void> {
		if (!scrollTarget) return;

		await tick();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const id = scrollTarget.startsWith('#') ? scrollTarget.slice(1) : scrollTarget;
				const targetElement = document.getElementById(id);

				if (targetElement) {
					const top = targetElement.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
					window.scrollTo({ top, behavior: 'smooth' });
				}
			});
		});
	}

	async function goToPage(pageNum: number): Promise<void> {
		if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
			onPageChange(pageNum);
			await scrollToTarget();
		}
	}
</script>

{#if totalPages > 1}
	<div class="mx-auto flex {width} items-center justify-between gap-4">
		<button
			class="flex h-9 cursor-pointer items-center justify-center gap-1.25 rounded-[6.32813rem] {buttonBg} px-4 py-1.25 transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={currentPage === 1}
			onclick={() => goToPage(currentPage - 1)}
		>
			<Arrowleft size={16} class="text-bark-brown" />
			<span class="text-[0.9375rem] leading-[150%] font-semibold text-brand-primary"
				>{backText}</span
			>
		</button>
		<div class="flex items-center gap-2">
			{#each pageNumbers as pageNum}
				<button
					class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base font-normal transition-colors {pageNum ===
					currentPage
						? 'bg-brand-orange text-[15px] leading-[150%] font-semibold text-brand-primary'
						: 'bg-[#E8E2DB] text-[15px] leading-[150%] font-semibold text-[#59452B] hover:bg-brand-gray-3'}"
					onclick={() => goToPage(pageNum)}
				>
					{pageNum}
				</button>
			{/each}
		</div>
		<button
			class="flex h-9 cursor-pointer items-center justify-center gap-1.25 rounded-[6.32813rem] {buttonBg} px-4 py-1.25 transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={currentPage === totalPages}
			onclick={() => goToPage(currentPage + 1)}
		>
			<span class="text-[0.9375rem] leading-[150%] font-semibold text-bark-brown">{nextText}</span>
			<RightArrow size={16} class="text-bark-brown" />
		</button>
	</div>
{/if}
