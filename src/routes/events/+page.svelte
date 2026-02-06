<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EventCard from '$lib/components/events/EventCard.svelte';
	import MagnifyingGlass from '$lib/components/ui/icons/MagnifyingGlass.svelte';
	import FilterIcon from '$lib/components/ui/icons/FilterIcon.svelte';
	import { browseEvents } from '$lib/data/events';
	import { browseEventsPage } from '$lib/data/dashboard';
	import Arrowleft from '$lib/components/ui/icons/Arrowleft.svelte';

	let searchQuery = $state('');
	let isFiltersOpen = $state(false);
	let selectedCategory = $state('All');
	let sortBy = $state<'recommended' | 'date_desc' | 'date_asc'>('recommended');

	const pageSize = 12;
	let currentPage = $state(1);

	function normalizeQuery(value: string): string {
		return value.trim().toLowerCase();
	}

	function matchesQuery(event: (typeof browseEvents)[number], query: string): boolean {
		if (!query) return true;
		return (
			event.title.toLowerCase().includes(query) ||
			event.category.toLowerCase().includes(query) ||
			event.location.toLowerCase().includes(query)
		);
	}

	function filterByCategory(events: typeof browseEvents, category: string): typeof browseEvents {
		if (category === 'All') return events;
		return events.filter((e) => e.category === category);
	}

	function sortEvents(events: typeof browseEvents, sort: typeof sortBy): typeof browseEvents {
		if (sort === 'recommended') return events;

		const copy = [...events];
		copy.sort((a, b) => a.date.localeCompare(b.date));
		return sort === 'date_desc' ? copy.reverse() : copy;
	}

	function buildFilteredEvents(): typeof browseEvents {
		const query = normalizeQuery(searchQuery);

		const searched = browseEvents.filter((e) => matchesQuery(e, query));
		const categorized = filterByCategory(searched, selectedCategory);
		const sorted = sortEvents(categorized, sortBy);

		return sorted;
	}

	const categories = $derived([
		'All',
		...Array.from(new Set(browseEvents.map((e) => e.category))).sort((a, b) => a.localeCompare(b))
	]);

	const filteredEvents = $derived(buildFilteredEvents());

	const totalResults = $derived(filteredEvents.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalResults / pageSize)));
	const filterSignature = $derived(`${normalizeQuery(searchQuery)}|${selectedCategory}|${sortBy}`);
	const startIndex = $derived((currentPage - 1) * pageSize);
	const endIndex = $derived(startIndex + pageSize);
	const pagedEvents = $derived(filteredEvents.slice(startIndex, endIndex));

	$effect(() => {
		if (filterSignature) currentPage = 1;
	});

	$effect(() => {
		const pages = totalPages;
		if (currentPage < 1) currentPage = 1;
		if (currentPage > pages) currentPage = pages;
	});

	function viewDetails(id: string) {
		goto(resolve(`/events/${id}`));
	}

	function previousPage() {
		if (currentPage <= 1) return;
		currentPage -= 1;
	}

	function nextPage() {
		if (currentPage >= totalPages) return;
		currentPage += 1;
	}

	function toggleFilters() {
		isFiltersOpen = !isFiltersOpen;
	}

	function clearFilters() {
		selectedCategory = 'All';
		sortBy = 'recommended';
		isFiltersOpen = false;
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="max-w-full space-y-6">
		<header class="flex flex-col sm:flex-row justify-between gap-4">
			<div class="flex flex-col gap-2">
				<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
					{browseEventsPage.title}
				</h1>
				<p class="text-gray-500 dark:text-gray-400">{browseEventsPage.subtitle}</p>
			</div>
			<div class="flex gap-2 md:hidden">
				<a
					href={resolve('/dashboard')}
					class="text-sm items-center flex gap-2 text-black dark:text-white cursor-pointer"
				>
					<Arrowleft size={16} class="text-black dark:text-white shrink-0" />
					Back to Dashboard
				</a>
			</div>
		</header>

		<div class="flex flex-col sm:flex-row gap-3">
			<div class="flex-1 max-w-xl">
				<Input
					bind:value={searchQuery}
					placeholder={browseEventsPage.searchPlaceholder}
					leftIcon={MagnifyingGlass}
					class="w-full rounded-lg border-gray-300"
				/>
			</div>
			<Button
				text={browseEventsPage.filtersButtonText}
				type="button"
				variant="default"
				size="default"
				customIcon={FilterIcon}
				iconSize={24}
				rounded="lg"
				class="shrink-0 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700"
				onClick={toggleFilters}
			/>
		</div>

		{#if isFiltersOpen}
			<section
				class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 transition-colors"
			>
				<div class="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
						<label class="block">
							<span class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
								>Category</span
							>
							<select
								bind:value={selectedCategory}
								class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-amber-500/50"
							>
								{#each categories as category (category)}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</label>

						<label class="block">
							<span class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
								>Sort</span
							>
							<select
								bind:value={sortBy}
								class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-amber-500/50"
							>
								<option value="recommended">Recommended</option>
								<option value="date_desc">Date: Newest first</option>
								<option value="date_asc">Date: Oldest first</option>
							</select>
						</label>
					</div>

					<div class="flex items-center gap-2">
						<Button
							text="Clear"
							type="button"
							size="sm"
							variant="default"
							rounded="lg"
							onClick={clearFilters}
						/>
					</div>
				</div>
			</section>
		{/if}

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each pagedEvents as event (event.id)}
				<EventCard {event} onViewDetails={viewDetails} />
			{/each}
		</div>

		{#if totalResults > pageSize}
			<div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Showing {Math.min(endIndex, totalResults)} of {totalResults}
				</p>

				<div class="flex items-center gap-2">
					<Button
						text="Previous"
						type="button"
						size="sm"
						variant="default"
						rounded="lg"
						disabled={currentPage <= 1}
						onClick={previousPage}
					/>
					<span class="text-sm text-gray-600 dark:text-gray-300">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						text="Next"
						type="button"
						size="sm"
						variant="default"
						rounded="lg"
						disabled={currentPage >= totalPages}
						onClick={nextPage}
					/>
				</div>
			</div>
		{/if}

		{#if filteredEvents.length === 0}
			<p class="text-center text-gray-500 dark:text-gray-400 py-12">
				{browseEventsPage.noResultsText}
			</p>
		{/if}
	</div>
</div>
