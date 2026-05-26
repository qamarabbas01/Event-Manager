<script lang="ts">
	import Button from './ui/Button.svelte';
	import { Plus } from 'lucide-svelte';
	import Table from './ui/Table.svelte';
	import {
		initialEvents,
		tableColumns,
		eventsDashboardPage,
		tableUi,
		categories,
		statuses,
		type Event,
		type DashboardTableRow,
		type TableAction
	} from '$lib/data/dashboard';

	let events = $state<Event[]>([...initialEvents]);

	function handleAddEvent() {
		console.log('Add event clicked');
	}

	function handleEdit(id: number) {
		console.log('Edit event:', id);
	}

	function handleDelete(id: number) {
		events = events.filter((e) => e.id !== id);
	}

	function handleTableAction(action: TableAction, row: DashboardTableRow) {
		const eventId = Number(row.id);
		if (isNaN(eventId)) return;
		if (action === 'edit') handleEdit(eventId);
		if (action === 'delete') handleDelete(eventId);
	}

	const tableData: DashboardTableRow[] = $derived(
		events.map((event) => ({
			id: event.id,
			title: event.title,
			date: event.date,
			category: event.category,
			status: event.status,
			actions: ''
		}))
	);
</script>

<div class="bg-white min-h-screen p-3 md:p-5 max-w-full mx-auto md:mx-0">
	<div class="mb-5">
		<Button
			text={eventsDashboardPage.addEventButtonText}
			variant="default"
			size="default"
			onClick={handleAddEvent}
			customIcon={Plus}
		/>
	</div>

	<Table
		data={tableData}
		columns={tableColumns}
		emptyStateText={eventsDashboardPage.emptyStateText}
		searchPlaceholder={tableUi.searchPlaceholder}
		onAction={handleTableAction}
		filterableColumns={[
			{ key: 'category', options: categories, label: tableUi.filterCategoryLabel },
			{ key: 'status', options: statuses, label: tableUi.filterStatusLabel }
		]}
		clearFiltersText={tableUi.clearFiltersText}
	/>
</div>
