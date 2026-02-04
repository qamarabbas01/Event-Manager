<script lang="ts">
	import SearchIcon from './icons/SearchIcon.svelte';
	import Pagination from './Pagination.svelte';
	import Input from './Input.svelte';
	import SelectDropdown from './SelectDropdown.svelte';
	import { categories, statuses, tableUi } from '$lib/data/dashboard';
	import type { DashboardTableColumn, DashboardTableRow, TableAction } from '$lib/data/dashboard';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import Editicon from './icons/Editicon.svelte';

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

	$effect.pre(() => {
		const defaults = Object.fromEntries(
			filterableColumns.map((f) => [f.key, f.options[0] || 'All'])
		) as Record<string, string>;

		const next = { ...filterValues };
		let changed = false;

		for (const [key, defaultValue] of Object.entries(defaults)) {
			if (next[key] === undefined || next[key] === '') {
				next[key] = defaultValue;
				changed = true;
			}
		}

		const isEmpty = Object.keys(next).length === 0;
		if (isEmpty) {
			filterValues = defaults;
			return;
		}

		if (changed) filterValues = next;
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

	function getCellText(row: DashboardTableRow, key: string): string {
		const value = row[key];
		if (value === null || value === undefined) return '';
		return String(value);
	}

	const filteredData = $derived.by(() => {
		let result = [...data];

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((row) =>
				searchableColumns.some((key) => getCellText(row, key).toLowerCase().includes(query))
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

	const dataColumns = $derived(sortedColumns.filter((c) => c.key !== 'actions'));

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
				<div class="block sm:hidden space-y-3 py-2">
					{#each paginatedData as row (row.id)}
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<div
							class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-colors"
							role={onRowClick ? 'button' : undefined}
							tabindex={onRowClick ? 0 : undefined}
							onclick={() => onRowClick?.(row)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') onRowClick?.(row);
							}}
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
										{getCellText(row, dataColumns[0]?.key ?? 'id') || `Row ${row.id}`}
									</p>
								</div>

								{#if onAction}
									<div class="flex items-center gap-2 shrink-0">
										<button
											type="button"
											class="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
											aria-label={`Edit row ${row.id}`}
											onclick={(e) => {
												e.stopPropagation();
												onAction?.('edit', row);
											}}
										>
											<Editicon size={18} class="text-gray-900 dark:text-gray-100" />
										</button>
										<button
											type="button"
											class="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
											aria-label={`Delete row ${row.id}`}
											onclick={(e) => {
												e.stopPropagation();
												onAction?.('delete', row);
											}}
										>
											<DeleteIcon size={18} class="text-red-600 dark:text-red-400" />
										</button>
									</div>
								{/if}
							</div>

							<div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
								{#each dataColumns as col (col.key)}
									<div class="min-w-0">
										<p class="text-[11px] font-medium text-[#7B6242] dark:text-gray-400">
											{col.label}
										</p>
										<p class="text-sm text-gray-900 dark:text-gray-100 truncate">
											{getCellText(row, col.key)}
										</p>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="hidden sm:block overflow-x-auto -mx-3 sm:mx-0">
					<table class="min-w-176 w-full border-collapse">
						<thead>
							<tr class="h-16 text-left">
								{#each sortedColumns as col (col.key)}
									<th
										class="px-4 text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-[#7B6242] dark:text-gray-400 whitespace-nowrap {col.class ??
											''}"
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
										<td class="px-4 py-4 text-gray-900 dark:text-gray-100 {col.class ?? ''}">
											{#if col.key === 'actions'}
												{#if onAction}
													<div class="flex gap-3">
														<button
															type="button"
															class="rounded text-xs cursor-pointer"
															aria-label={`edit row ${row.id}`}
															onclick={(e) => {
																e.stopPropagation();
																onAction?.('edit', row);
															}}
														>
															<Editicon size={18} class="text-gray-900 dark:text-gray-100" />
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
															<DeleteIcon size={18} class="text-red-600 dark:text-red-400" />
														</button>
													</div>
												{/if}
											{:else}
												{getCellText(row, col.key)}
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
