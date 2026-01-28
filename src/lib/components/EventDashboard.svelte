<script lang="ts">
	import Button from './ui/Button.svelte';
	import Plus from './ui/icons/Plus.svelte';
	import Table from './ui/Table.svelte';
	import {
		initialEvents,
		tableColumns,
		type Event,
		type DashboardTableRow
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

	$effect(() => {
		function handleTableAction(e: MouseEvent) {
			const target = e.target as HTMLElement;
			const button = target.closest('button[data-action]') as HTMLButtonElement;
			if (!button) return;

			const action = button.getAttribute('data-action');
			const eventIdStr = button.getAttribute('data-event-id');
			if (!action || !eventIdStr) return;

			const eventId = parseInt(eventIdStr, 10);
			if (isNaN(eventId)) return;

			e.stopPropagation();
			e.preventDefault();

			if (action === 'edit') {
				handleEdit(eventId);
			} else if (action === 'delete') {
				handleDelete(eventId);
			}
		}

		document.addEventListener('click', handleTableAction as EventListener);
		return () => {
			document.removeEventListener('click', handleTableAction as EventListener);
		};
	});
</script>

<div class="bg-white min-h-screen p-3 md:p-5 max-w-full mx-auto md:mx-0">
	<div class="mb-5">
		<Button
			text="Add Event"
			variant="default"
			size="default"
			onClick={handleAddEvent}
			customIcon={Plus}
		/>
	</div>

	<Table
		data={tableData}
		columns={tableColumns}
		emptyStateText="No events found"
		itemsCountText="events"
	/>
</div>
