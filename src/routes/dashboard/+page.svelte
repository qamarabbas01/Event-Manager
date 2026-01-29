<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Plus from '$lib/components/ui/icons/Plus.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import CalendarIcon from '$lib/components/ui/icons/CalendarIcon.svelte';
	import CheckFilled from '$lib/components/ui/icons/CheckFilled.svelte';
	import PauseCircle from '$lib/components/ui/icons/PauseCircle.svelte';
	import AddEventModal from '$lib/components/dashboard/AddEventModal.svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import {
		initialEvents,
		tableColumns,
		eventsDashboardPage,
		eventsStatsLabels,
		tableUi,
		categories,
		statuses,
		type Event,
		type DashboardTableRow,
		type Status
	} from '$lib/data/dashboard';

	let events = $state<Event[]>([...initialEvents]);
	let addEventModalOpen = $state(false);
	let eventToEdit = $state<Event | null>(null);

	function handleAddEvent() {
		eventToEdit = null;
		addEventModalOpen = true;
	}

	function handleAddEventSubmit(payload: {
		title: string;
		date: string;
		category: Event['category'];
		status: Status;
	}) {
		const nextId = events.length === 0 ? 1 : Math.max(...events.map((e) => e.id), 0) + 1;
		events = [
			...events,
			{
				id: nextId,
				title: payload.title,
				date: payload.date,
				category: payload.category,
				status: payload.status
			}
		];
	}

	function handleEditEvent(
		id: number,
		payload: {
			title: string;
			date: string;
			category: Event['category'];
			status: Status;
		}
	) {
		events = events.map((e) =>
			e.id === id
				? {
						id: e.id,
						title: payload.title,
						date: payload.date,
						category: payload.category,
						status: payload.status
					}
				: e
		);
	}

	function handleEdit(id: number) {
		const event = events.find((e) => e.id === id);
		if (event) {
			eventToEdit = event;
			addEventModalOpen = true;
		}
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

	const totalEvents = $derived(events.length);
	const activeEvents = $derived(events.filter((e) => e.status === 'Active').length);
	const pendingEvents = $derived(events.filter((e) => e.status === 'Pending').length);
	const completedEvents = $derived(events.filter((e) => e.status === 'Completed').length);

	const upcomingEvents = $derived(
		[...events]
			.filter((e) => e.status === 'Active' || e.status === 'Pending')
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.slice(0, 5)
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

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusColor(status: Status): string {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Completed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="bg-gray-50 min-h-screen p-4 md:p-6 max-w-full mx-auto md:mx-0">
	<div class="max-w-full mx-auto space-y-6">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-3xl font-bold">{eventsDashboardPage.title}</h1>
				<p class="text-gray-600 mt-1">{eventsDashboardPage.subtitle}</p>
			</div>
			<Button
				text={eventsDashboardPage.addEventButtonText}
				variant="default"
				size="default"
				onClick={handleAddEvent}
				customIcon={Plus}
			/>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<StatCard
				label={eventsStatsLabels.totalEvents}
				value={totalEvents}
				icon={CalendarIcon}
				valueColor="text-[#59452B]"
				iconBg="bg-[#59452B1A]"
				iconColor="text-[#59452B]"
			/>
			<StatCard
				label={eventsStatsLabels.active}
				value={activeEvents}
				icon={CheckFilled}
				valueColor="text-green-600"
				iconBg="bg-green-100"
				iconColor="text-green-600"
			/>
			<StatCard
				label={eventsStatsLabels.pending}
				value={pendingEvents}
				icon={PauseCircle}
				valueColor="text-yellow-600"
				iconBg="bg-yellow-100"
				iconColor="text-yellow-600"
			/>
			<StatCard
				label={eventsStatsLabels.completed}
				value={completedEvents}
				icon={CheckFilled}
				valueColor="text-blue-600"
				iconBg="bg-blue-100"
				iconColor="text-blue-600"
			/>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2">
				<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-semibold">
							{eventsDashboardPage.allEventsTitle}
						</h2>
						<a
							href="/events"
							class="text-sm text-[#7B6242] hover:text-[#59452B] underline underline-offset-2 cursor-pointer"
						>
							View All Events
						</a>
					</div>
					<Table
						data={tableData}
						columns={tableColumns}
						emptyStateText={eventsDashboardPage.emptyStateText}
						searchPlaceholder={tableUi.searchPlaceholder}
						filterableColumns={[
							{ key: 'category', options: categories, label: tableUi.filterCategoryLabel },
							{ key: 'status', options: statuses, label: tableUi.filterStatusLabel }
						]}
						clearFiltersText={tableUi.clearFiltersText}
					/>
				</div>
			</div>

			<div class="lg:col-span-1">
				<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
					<h2 class="text-xl font-semibold mb-4">
						{eventsDashboardPage.upcomingTitle}
					</h2>
					{#if upcomingEvents.length === 0}
						<p class="text-[#ADA295] text-sm">{eventsDashboardPage.noUpcomingText}</p>
					{:else}
						<div class="space-y-3">
							{#each upcomingEvents as event}
								<div
									class="p-4 rounded-lg border border-gray-200 hover:border-[#59452B] transition-colors"
								>
									<div class="flex items-start justify-between gap-2">
										<div class="flex-1 min-w-0">
											<h3 class="font-medium text-[#59452B] truncate">{event.title}</h3>
											<p class="text-sm text-[#7B6242] mt-1">{formatDate(event.date)}</p>
											<div class="flex items-center gap-2 mt-2">
												<span class="text-xs px-2 py-1 rounded-full {getStatusColor(event.status)}">
													{event.status}
												</span>
												<span class="text-xs text-[#ADA295]">{event.category}</span>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<AddEventModal
		bind:open={addEventModalOpen}
		{eventToEdit}
		onAdd={handleAddEventSubmit}
		onEdit={handleEditEvent}
		onClose={() => {
			addEventModalOpen = false;
			eventToEdit = null;
		}}
	/>
</div>
