<script lang="ts">
	import SearchIcon from './icons/SearchIcon.svelte';
	import Filter from './icons/Filter.svelte';
	import Pagination from './Pagination.svelte';
	import Input from './Input.svelte';
	import SelectDropdown from './SelectDropdown.svelte';
	import { categories, statuses } from '$lib/data/dashboard';
	import type { DashboardTableColumn, DashboardTableRow } from '$lib/data/dashboard';

	interface Props {
		data: DashboardTableRow[];
		columns: DashboardTableColumn[];
		title?: string;
		emptyStateText?: string;
		itemsCountText?: string;
		searchableColumns?: string[];
		filterableColumns?: { key: string; options: string[] }[];
	}

	let {
		data,
		columns,
		title = '',
		emptyStateText = '',
		itemsCountText = '',
		searchableColumns = ['title'],
		filterableColumns = [
			{ key: 'category', options: categories },
			{ key: 'status', options: statuses }
		]
	}: Props = $props();

	let currentPage = $state(1);
	const pageSize = 10;

	let showSearch = $state(false);
	let showFilters = $state(false);
	let searchQuery = $state('');
	let filterValues = $state<Record<string, string>>({});

	$effect(() => {
		filterableColumns.forEach((filter) => {
			if (!filterValues[filter.key]) {
				filterValues[filter.key] = filter.options[0] || 'All';
			}
		});
	});

	const filteredData = $derived.by(() => {
		let result = [...data];

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((row) =>
				searchableColumns.some((key) =>
					String(row[key] || '').toLowerCase().includes(query)
				)
			);
		}

		filterableColumns.forEach((filter) => {
			const value = filterValues[filter.key];
			if (value && value !== 'All') {
				result = result.filter((row) => row[filter.key] === value);
			}
		});

		return result;
	});

	const totalItems = $derived(filteredData.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)));
	const paginatedData = $derived(
		filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	// 🔥 Actions column ALWAYS LAST
	const sortedColumns = $derived.by(() => {
		const actions = columns.find((c) => c.key === 'actions');
		const rest = columns.filter((c) => c.key !== 'actions');
		return actions ? [...rest, actions] : columns;
	});

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) showFilters = false;
	}

	function toggleFilters() {
		showFilters = !showFilters;
		if (showFilters) showSearch = false;
	}

	function clearFilters() {
		searchQuery = '';
		filterableColumns.forEach((f) => {
			filterValues[f.key] = f.options[0] || 'All';
		});
		currentPage = 1;
	}

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' ||
			filterableColumns.some((f) => filterValues[f.key] !== 'All')
	);
</script>

<div class="w-full">
	<!-- HEADER -->
	<div class="flex flex-col sm:flex-row justify-between gap-4 py-5">
		{#if title}
			<h2 class="text-lg font-semibold text-[#3B2617]">{title}</h2>
		{/if}

		<div class="flex items-center gap-3">
			<span class="text-xs text-[#ADA295]">
				{totalItems} {itemsCountText}
			</span>

			<button on:click={toggleSearch} class="rounded-full bg-[#E8E2DB] p-2">
				<SearchIcon class="h-5 w-5" />
			</button>

			<button on:click={toggleFilters} class="rounded-full bg-[#E8E2DB] p-2">
				<Filter class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- SEARCH -->
	{#if showSearch}
		<Input
			placeholder="Search..."
			bind:value={searchQuery}
			leftIcon={SearchIcon}
			class="max-w-md mb-4"
		/>
	{/if}

	<!-- FILTERS -->
	{#if showFilters}
		<div class="flex flex-wrap gap-3 mb-4">
			{#each filterableColumns as filter}
				<SelectDropdown
					options={filter.options}
					bind:value={filterValues[filter.key]}
				/>
			{/each}

			{#if hasActiveFilters}
				<button
					on:click={clearFilters}
					class="text-xs underline text-[#7B6242]"
				>
					Clear filters
				</button>
			{/if}
		</div>
	{/if}

	<!-- TABLE WRAPPER -->
	<div class="overflow-hidden rounded-3xl bg-[#59452B1A] p-[2px]">
		<div class="rounded-3xl bg-white px-3 sm:px-6 py-2">

			{#if totalItems === 0}
				<div class="py-10 text-center text-[#BDB8B4]">
					{emptyStateText}
				</div>

			{:else}

				<!-- 📱 MOBILE -->
				<div class="block sm:hidden">
					{#each paginatedData as row (row.id)}
						<div class="border-b py-4 space-y-2">
							{#each sortedColumns as col}
								<div>
									<span class="text-xs text-[#7B6242]">{col.label}</span>
									<div>
										{#if col.render}
											{@html col.render(row)}
										{:else if col.key !== 'actions'}
											{row[col.key]}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<!-- 🖥 DESKTOP (SEMANTIC TABLE) -->
				<div class="hidden sm:block overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="h-16 text-left">
								{#each sortedColumns as col}
									<th class="px-4 text-xs text-[#7B6242]">
										{col.label}
									</th>
								{/each}
							</tr>
						</thead>

						<tbody>
							{#each paginatedData as row (row.id)}
								<tr class="border-b hover:bg-gray-50">
									{#each sortedColumns as col}
										<td class="px-4 py-4">
											{#if col.render}
												{@html col.render(row)}
											{:else if col.key !== 'actions'}
												{row[col.key]}
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

			{/if}
		</div>
	</div>

	<!-- PAGINATION -->
	<div class="py-6">
		<Pagination
			{currentPage}
			{totalPages}
			onPageChange={handlePageChange}
			width="800"
		/>
	</div>
</div>