<script lang="ts">
	import SearchIcon from './icons/SearchIcon.svelte';
	import Pagination from './Pagination.svelte';
	import Input from './Input.svelte';
	import SelectDropdown from './SelectDropdown.svelte';
	import { categories, statuses, tableUi } from '$lib/data/dashboard';
	import type { DashboardTableColumn, DashboardTableRow } from '$lib/data/dashboard';

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
	}

	let {
		data,
		columns,
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
		onRowClick
	}: Props = $props();

	let currentPage = $state(1);
	const pageSize = 10;

	let searchQuery = $state('');
	let filterValues = $state<Record<string, string>>(
		Object.fromEntries(
			// svelte-ignore state_referenced_locally
			filterableColumns.map((f) => [f.key, f.options[0] || 'All'])
		)
	);

	$effect(() => {
		filterableColumns.forEach((filter) => {
			if (filterValues[filter.key] === undefined || filterValues[filter.key] === '') {
				filterValues = { ...filterValues, [filter.key]: filter.options[0] || 'All' };
			}
		});
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
	<div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
		<div class="flex-1 min-w-0 sm:max-w-xs">
			<Input placeholder={searchPlaceholder} bind:value={searchQuery} leftIcon={SearchIcon} />
		</div>
		<div class="flex flex-wrap items-center gap-3">
			{#each filterableColumns as filter}
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
					class="text-sm text-[#7B6242] hover:text-[#59452B] underline underline-offset-2 cursor-pointer shrink-0"
				>
					{clearFiltersText}
				</button>
			{/if}
		</div>
	</div>

	<div class="overflow-hidden rounded-3xl bg-[#59452B1A] p-px">
		<div class="rounded-3xl bg-white px-3 sm:px-6 py-2">
			{#if totalItems === 0}
				<div class="py-10 text-center text-[#BDB8B4]">
					{emptyStateText}
				</div>
			{:else}
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

				<div class="hidden sm:block overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="h-16 text-left">
								{#each sortedColumns as col}
									<th class="px-4 text-sm font-medium border-b border-gray-200 text-[#7B6242]">
										{col.label}
									</th>
								{/each}
							</tr>
						</thead>

						<tbody>
							{#each paginatedData as row (row.id)}
								<tr
									class="border-b border-gray-200 cursor-pointer hover:bg-gray-50"
									onclick={() => onRowClick?.(row)}
								>
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

	<div class="py-6">
		<Pagination {currentPage} {totalPages} onPageChange={handlePageChange} width="800" />
	</div>
</div>
