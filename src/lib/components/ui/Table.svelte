<script lang="ts">
	import SearchIcon from './icons/SearchIcon.svelte';
	import Pagination from './Pagination.svelte';
	import Input from './Input.svelte';
	import SelectDropdown from './SelectDropdown.svelte';
	import { categories, statuses, tableUi } from '$lib/data/dashboard';
	import type { DashboardTableColumn, DashboardTableRow, TableAction } from '$lib/data/dashboard';

	interface Props {
		data: DashboardTableRow[];
		columns: DashboardTableColumn[];
		title?: string;
		emptyStateText?: string;
		searchPlaceholder?: string;
		clearFiltersText?: string;
		searchableColumns?: string[];
		filterableColumns?: { key: string; options: readonly string[]; label: string }[];
		onRowClick?: (row: DashboardTableRow) => void;
		onAction?: (action: TableAction, row: DashboardTableRow) => void;
	}

	let {
		data,
		columns,
		title,
		emptyStateText,
		searchPlaceholder = tableUi.searchPlaceholder,
		clearFiltersText = tableUi.clearFiltersText,
		searchableColumns = ['title'],
		filterableColumns = [
			{
				key: 'category',
				options: categories as readonly string[],
				label: tableUi.filterCategoryLabel
			},
			{ key: 'status', options: statuses as readonly string[], label: tableUi.filterStatusLabel }
		],
		onRowClick,
		onAction
	}: Props = $props();

	let currentPage = $state(1);
	const pageSize = 10;

	let searchQuery = $state('');
	let filterValues = $state<Record<string, string>>({});

	let lastSearchQuery = $state('');
	let lastFilterValuesKey = $state('');

	$effect(() => {
		filterableColumns.forEach((filter) => {
			if (filterValues[filter.key] === undefined || filterValues[filter.key] === '') {
				filterValues = { ...filterValues, [filter.key]: filter.options[0] || 'All' };
			}
		});
	});

	$effect(() => {
		const nextFilterValuesKey = JSON.stringify(filterValues);
		const shouldResetPage =
			searchQuery !== lastSearchQuery || nextFilterValuesKey !== lastFilterValuesKey;

		if (!shouldResetPage) return;

		currentPage = 1;
		lastSearchQuery = searchQuery;
		lastFilterValuesKey = nextFilterValuesKey;
	});

	const filteredData = $derived.by(() => {
		let result = [...data];

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((row) =>
				searchableColumns.some((key) =>
					String(row[key] || '')
						.toLowerCase()
						.includes(query)
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

	$effect(() => {
		if (currentPage > totalPages) currentPage = totalPages;
		if (currentPage < 1) currentPage = 1;
	});

	const sortedColumns = $derived.by(() => {
		const actions = columns.find((c) => c.key === 'actions');
		const rest = columns.filter((c) => c.key !== 'actions');
		return actions ? [...rest, actions] : columns;
	});

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function clearFilters() {
		searchQuery = '';
		filterValues = {
			...filterValues,
			...Object.fromEntries(filterableColumns.map((f) => [f.key, f.options[0] || 'All']))
		};
		currentPage = 1;
	}

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || filterableColumns.some((f) => filterValues[f.key] !== 'All')
	);
</script>

<div class="w-full">
	{#if title}
		<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
	{/if}
	<div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
		<div class="flex-1 min-w-0 sm:max-w-xs">
			<Input placeholder={searchPlaceholder} bind:value={searchQuery} leftIcon={SearchIcon} />
		</div>
		<div class="flex flex-wrap items-center gap-3">
			{#each filterableColumns as filter (filter.key)}
				<SelectDropdown
					options={filter.options}
					bind:value={filterValues[filter.key]}
					placeholder={`All ${filter.label}`}
				/>
			{/each}
			{#if hasActiveFilters}
				<button
					type="button"
					onclick={clearFilters}
					class="text-sm text-[#7B6242] dark:text-amber-200 hover:text-[#59452B] dark:hover:text-amber-100 underline underline-offset-2 cursor-pointer shrink-0"
				>
					{clearFiltersText}
				</button>
			{/if}
		</div>
	</div>

	<div class="overflow-hidden rounded-3xl bg-[#59452B1A] dark:bg-gray-700 p-px">
		<div class="rounded-3xl bg-white dark:bg-gray-800 px-3 sm:px-6 py-2 transition-colors">
			{#if totalItems === 0}
				<div class="py-10 text-center text-[#BDB8B4] dark:text-gray-500">
					{emptyStateText}
				</div>
			{:else}
				<div class="block sm:hidden">
					{#each paginatedData as row (row.id)}
						<div class="border-b border-gray-200 dark:border-gray-700 py-4 space-y-2">
							{#each sortedColumns as col (col.key)}
								<div>
									<span class="text-xs text-[#7B6242] dark:text-gray-400">{col.label}</span>
									<div>
										{#if col.key === 'actions'}
											{#if onAction}
												<div class="flex gap-3 flex-col md:flex-row">
													<button
														type="button"
														class="rounded text-xs cursor-pointer"
														aria-label={`edit row ${row.id}`}
														onclick={(e) => {
															e.stopPropagation();
															onAction?.('edit', row);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="text-gray-900 dark:text-gray-100"
															aria-hidden="true"
														>
															<path d="M12 20h9" />
															<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
														</svg>
													</button>
													<button
														type="button"
														class="rounded text-xs cursor-pointer"
														aria-label={`delete row ${row.id}`}
														onclick={(e) => {
															e.stopPropagation();
															onAction?.('delete', row);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="text-red-600 dark:text-red-400"
															aria-hidden="true"
														>
															<polyline points="3 6 5 6 21 6" />
															<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
															<path d="M10 11v6" />
															<path d="M14 11v6" />
															<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
														</svg>
													</button>
												</div>
											{/if}
										{:else}
											{row[col.key]}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>

				<div class="hidden sm:block overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="h-16 text-left">
								{#each sortedColumns as col (col.key)}
									<th
										class="px-4 text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-[#7B6242] dark:text-gray-400"
									>
										{col.label}
									</th>
								{/each}
							</tr>
						</thead>

						<tbody>
							{#each paginatedData as row (row.id)}
								<tr
									class="border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
									onclick={() => onRowClick?.(row)}
								>
									{#each sortedColumns as col (col.key)}
										<td class="px-4 py-4 text-gray-900 dark:text-gray-100">
											{#if col.key === 'actions'}
												{#if onAction}
													<div class="flex gap-3 flex-col md:flex-row">
														<button
															type="button"
															class="rounded text-xs cursor-pointer"
															aria-label={`edit row ${row.id}`}
															onclick={(e) => {
																e.stopPropagation();
																onAction?.('edit', row);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
																class="text-gray-900 dark:text-gray-100"
																aria-hidden="true"
															>
																<path d="M12 20h9" />
																<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
															</svg>
														</button>
														<button
															type="button"
															class="rounded text-xs cursor-pointer"
															aria-label={`delete row ${row.id}`}
															onclick={(e) => {
																e.stopPropagation();
																onAction?.('delete', row);
															}}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="18"
																height="18"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
																class="text-red-600 dark:text-red-400"
																aria-hidden="true"
															>
																<polyline points="3 6 5 6 21 6" />
																<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
																<path d="M10 11v6" />
																<path d="M14 11v6" />
																<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
															</svg>
														</button>
													</div>
												{/if}
											{:else}
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

	<div class="py-6">
		<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} width="800" />
	</div>
</div>
