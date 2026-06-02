<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EventCard from '$lib/components/events/EventCard.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import { Search, ListFilter, ArrowLeft, CalendarDays, Sparkles, Tag, X } from 'lucide-svelte';
	import {
		browseEvents,
		countUpcomingEvents,
		getEventTimeStatus,
		type EventTimeStatus
	} from '$lib/data/events';
	import { browseEventsPage } from '$lib/data/dashboard';

	let searchQuery = $state('');
	let isFiltersOpen = $state(false);
	let selectedCategory = $state('All');
	let timeFilter = $state<'all' | 'upcoming' | 'past'>('all');
	let sortBy = $state<'recommended' | 'date_desc' | 'date_asc' | 'availability'>('recommended');

	const pageSize = 12;
	let currentPage = $state(1);
	let isLoading = $state(true);
	let hasLoadError = $state(false);

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

	function filterByTime(
		events: typeof browseEvents,
		filter: typeof timeFilter,
		reference: Date
	): typeof browseEvents {
		if (filter === 'all') return events;
		return events.filter((e) => {
			const status = getEventTimeStatus(e.date, reference);
			return filter === 'upcoming' ? status !== 'past' : status === 'past';
		});
	}

	function timeStatusOrder(status: EventTimeStatus): number {
		if (status === 'upcoming') return 0;
		if (status === 'today') return 1;
		return 2;
	}

	function sortEvents(events: typeof browseEvents, sort: typeof sortBy): typeof browseEvents {
		const copy = [...events];

		if (sort === 'recommended') {
			const refDate = new Date();
			return copy.sort((a, b) => {
				const orderDiff =
					timeStatusOrder(getEventTimeStatus(a.date, refDate)) -
					timeStatusOrder(getEventTimeStatus(b.date, refDate));
				if (orderDiff !== 0) return orderDiff;
				return a.date.localeCompare(b.date);
			});
		}

		if (sort === 'availability') {
			return copy.sort((a, b) => {
				const leftA = a.capacity - a.attendees;
				const leftB = b.capacity - b.attendees;
				return leftB - leftA;
			});
		}

		copy.sort((a, b) => a.date.localeCompare(b.date));
		return sort === 'date_desc' ? copy.reverse() : copy;
	}

	function buildFilteredEvents(): typeof browseEvents {
		const reference = new Date();
		const query = normalizeQuery(searchQuery);
		const searched = browseEvents.filter((e) => matchesQuery(e, query));
		const categorized = filterByCategory(searched, selectedCategory);
		const timed = filterByTime(categorized, timeFilter, reference);
		return sortEvents(timed, sortBy);
	}

	const categories = $derived([
		'All',
		...Array.from(new Set(browseEvents.map((e) => e.category))).sort((a, b) => a.localeCompare(b))
	]);

	const filteredEvents = $derived(buildFilteredEvents());
	const totalResults = $derived(filteredEvents.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalResults / pageSize)));
	const filterSignature = $derived(
		`${normalizeQuery(searchQuery)}|${selectedCategory}|${timeFilter}|${sortBy}`
	);
	const startIndex = $derived((currentPage - 1) * pageSize);
	const endIndex = $derived(Math.min(startIndex + pageSize, totalResults));
	const pagedEvents = $derived(filteredEvents.slice(startIndex, endIndex));

	const upcomingCount = $derived(countUpcomingEvents());
	const hasActiveFilters = $derived(
		normalizeQuery(searchQuery) !== '' ||
			selectedCategory !== 'All' ||
			timeFilter !== 'all' ||
			sortBy !== 'recommended'
	);

	const activeFilterChips = $derived.by(() => {
		const chips: { key: string; label: string; clear: () => void }[] = [];
		const q = normalizeQuery(searchQuery);
		if (q) {
			chips.push({
				key: 'search',
				label: `"${searchQuery.trim()}"`,
				clear: () => {
					searchQuery = '';
				}
			});
		}
		if (selectedCategory !== 'All') {
			chips.push({
				key: 'category',
				label: selectedCategory,
				clear: () => {
					selectedCategory = 'All';
				}
			});
		}
		if (timeFilter !== 'all') {
			chips.push({
				key: 'time',
				label:
					timeFilter === 'upcoming'
						? browseEventsPage.timeUpcoming
						: browseEventsPage.timePast,
				clear: () => {
					timeFilter = 'all';
				}
			});
		}
		if (sortBy !== 'recommended') {
			const sortLabels = {
				recommended: browseEventsPage.sortRecommended,
				date_desc: browseEventsPage.sortDateDesc,
				date_asc: browseEventsPage.sortDateAsc,
				availability: browseEventsPage.sortAvailability
			} as const;
			chips.push({
				key: 'sort',
				label: sortLabels[sortBy],
				clear: () => {
					sortBy = 'recommended';
				}
			});
		}
		return chips;
	});

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

	function toggleFilters() {
		isFiltersOpen = !isFiltersOpen;
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = 'All';
		timeFilter = 'all';
		sortBy = 'recommended';
		isFiltersOpen = false;
	}

	function selectCategory(category: string) {
		selectedCategory = category;
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function initializeEventsPage() {
		isLoading = true;
		hasLoadError = false;
		window.setTimeout(() => {
			isLoading = false;
		}, 250);
	}

	$effect(() => {
		initializeEventsPage();
	});
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="max-w-7xl mx-auto space-y-6">
		<header class="flex flex-col gap-4">
			<a
				href={resolve('/')}
				class="text-sm inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 w-fit transition-colors"
			>
				<ArrowLeft size={16} class="shrink-0" aria-hidden="true" />
				<span>{browseEventsPage.backToHomeLink}</span>
			</a>
			<div>
				<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
					{browseEventsPage.title}
				</h1>
				<p class="mt-1 text-gray-500 dark:text-gray-400">{browseEventsPage.subtitle}</p>
			</div>
		</header>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div
				class="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
				>
					<CalendarDays size={20} aria-hidden="true" />
				</div>
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{browseEventsPage.statTotal}
					</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{browseEvents.length}</p>
				</div>
			</div>
			<div
				class="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
				>
					<Sparkles size={20} aria-hidden="true" />
				</div>
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{browseEventsPage.statUpcoming}
					</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{upcomingCount}</p>
				</div>
			</div>
			<div
				class="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
				>
					<Tag size={20} aria-hidden="true" />
				</div>
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{browseEventsPage.statCategories}
					</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{categories.length - 1}
					</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row gap-3">
			<div class="flex-1 max-w-xl">
				<Input
					bind:value={searchQuery}
					placeholder={browseEventsPage.searchPlaceholder}
					leftIcon={Search}
					class="w-full rounded-lg border-gray-300"
				/>
			</div>
			<Button
				text={browseEventsPage.filtersButtonText}
				type="button"
				variant="default"
				size="default"
				customIcon={ListFilter}
				iconSize={20}
				rounded="lg"
				class="shrink-0 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 {isFiltersOpen
					? 'ring-2 ring-blue-500/40'
					: ''}"
				onClick={toggleFilters}
			/>
		</div>

		<div class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
			{#each categories as category (category)}
				<button
					type="button"
					onclick={() => selectCategory(category)}
					aria-pressed={selectedCategory === category}
					class="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors {selectedCategory ===
					category
						? 'bg-blue-600 text-white border-blue-600'
						: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}"
				>
					{category}
				</button>
			{/each}
		</div>

		{#if isFiltersOpen}
			<section
				class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 transition-colors"
			>
				<div class="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
						<label class="block">
							<span class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
								>{browseEventsPage.categoryLabel}</span
							>
							<select
								bind:value={selectedCategory}
								class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							>
								{#each categories as category (category)}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</label>

						<label class="block">
							<span class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
								>{browseEventsPage.timeFilterLabel}</span
							>
							<select
								bind:value={timeFilter}
								class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							>
								<option value="all">{browseEventsPage.timeAll}</option>
								<option value="upcoming">{browseEventsPage.timeUpcoming}</option>
								<option value="past">{browseEventsPage.timePast}</option>
							</select>
						</label>

						<label class="block">
							<span class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
								>{browseEventsPage.sortLabel}</span
							>
							<select
								bind:value={sortBy}
								class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							>
								<option value="recommended">{browseEventsPage.sortRecommended}</option>
								<option value="date_desc">{browseEventsPage.sortDateDesc}</option>
								<option value="date_asc">{browseEventsPage.sortDateAsc}</option>
								<option value="availability">{browseEventsPage.sortAvailability}</option>
							</select>
						</label>
					</div>

					<Button
						text={browseEventsPage.clearFiltersText}
						type="button"
						size="sm"
						variant="default"
						rounded="lg"
						onClick={clearFilters}
					/>
				</div>
			</section>
		{/if}

		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-400"
		>
			<p>
				{#if totalResults > 0}
					{browseEventsPage.resultsShowing}
					<span class="font-semibold text-gray-900 dark:text-gray-100"
						>{startIndex + 1}–{endIndex}</span
					>
					{browseEventsPage.resultsOf}
					<span class="font-semibold text-gray-900 dark:text-gray-100">{totalResults}</span>
					{browseEventsPage.resultsEvents}
				{:else}
					<span class="font-semibold text-gray-900 dark:text-gray-100">0</span>
					{browseEventsPage.resultsEvents}
				{/if}
			</p>
		</div>

		{#if activeFilterChips.length > 0}
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>{browseEventsPage.activeFiltersLabel}:</span
				>
				{#each activeFilterChips as chip (chip.key)}
					<button
						type="button"
						onclick={chip.clear}
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200/60 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
					>
						{chip.label}
						<X size={12} aria-hidden="true" />
					</button>
				{/each}
				{#if hasActiveFilters}
					<button
						type="button"
						onclick={clearFilters}
						class="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline-offset-2 hover:underline"
					>
						{browseEventsPage.clearFiltersText}
					</button>
				{/if}
			</div>
		{/if}

		{#if isLoading}
			<LoadingState label="Loading events..." />
		{:else if hasLoadError}
			<ErrorState
				title="Could not load events"
				description="Please retry to load event listings."
				onRetry={initializeEventsPage}
			/>
		{:else if filteredEvents.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 py-16 px-6 text-center"
			>
				<div
					class="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4"
				>
					<Search size={28} aria-hidden="true" />
				</div>
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{browseEventsPage.noResultsTitle}
				</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
					{browseEventsPage.noResultsText}
				</p>
				{#if hasActiveFilters}
					<Button
						text={browseEventsPage.clearFiltersText}
						type="button"
						variant="primary-blue"
						rounded="lg"
						class="mt-6"
						onClick={clearFilters}
					/>
				{/if}
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each pagedEvents as event (event.id)}
					<EventCard {event} onViewDetails={viewDetails} />
				{/each}
			</div>

			{#if totalPages > 1}
				<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} width="w-full" />
			{/if}
		{/if}
	</div>
</div>
