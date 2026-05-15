<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getEventById } from '$lib/data/events';
	import { eventDetailPage } from '$lib/data/dashboard';
	import LineChart from '$lib/components/ui/LineChart.svelte';
	import MetricCard from '$lib/components/ui/MetricCard.svelte';
	import CalendarIcon from '$lib/components/ui/icons/CalendarIcon.svelte';
	import MapPin from '$lib/components/ui/icons/MapPin.svelte';
	import Users from '$lib/components/ui/icons/Users.svelte';
	import Revenue from '$lib/components/ui/icons/Revenue.svelte';
	import Attendance from '$lib/components/ui/icons/Attendance.svelte';
	import Arrowleft from '$lib/components/ui/icons/Arrowleft.svelte';

	const eventId = $derived(page.params.id ?? '');
	const event = $derived(getEventById(eventId));
	const eventsHref = resolve('/events');

	function formatEventDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function backToEvents() {
		goto(eventsHref);
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="space-y-6">
		<a
			href={eventsHref}
			onclick={(e) => {
				e.preventDefault();
				backToEvents();
			}}
			class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium mb-4 transition-colors"
		>
			<Arrowleft size={18} />
			{eventDetailPage.backLink}
		</a>

		{#if !event}
			<div
				class="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors"
			>
				<p class="text-gray-500 dark:text-gray-400 mb-4">{eventDetailPage.notFoundMessage}</p>
				<a
					href={eventsHref}
					onclick={(e) => {
						e.preventDefault();
						backToEvents();
					}}
					class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
				>
					{eventDetailPage.returnToBrowse}
				</a>
			</div>
		{:else}
			<section
				class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors"
			>
				<div class="aspect-21/9 md:aspect-3/1 relative">
					<img src={event.image} alt={event.title} class="w-full h-full object-cover" />
				</div>
				<div class="p-6 md:p-8">
					<span
						class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 mb-3"
					>
						{event.category}
					</span>
					<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{event.title}</h1>
					<div class="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 mb-6">
						<div class="flex items-center gap-2">
							<CalendarIcon size={20} class="text-gray-400 dark:text-gray-500 shrink-0" />
							<span>{formatEventDate(event.date)}</span>
						</div>
						<div class="flex items-center gap-2">
							<MapPin size={20} class="text-gray-400 dark:text-gray-500 shrink-0" />
							<span>{event.venue}</span>
						</div>
					</div>
					<p class="text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
				</div>
			</section>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					label={eventDetailPage.metrics.attendees}
					value={event.attendees.toLocaleString()}
					icon={Users}
					iconBgColor="bg-blue-100"
					iconColor="text-blue-600"
				/>
				<MetricCard
					label={eventDetailPage.metrics.ticketsSold}
					value={`${event.attendees.toLocaleString()}/${event.capacity.toLocaleString()}`}
					icon={CalendarIcon}
					iconBgColor="bg-green-100"
					iconColor="text-green-600"
				/>
				<MetricCard
					label={eventDetailPage.metrics.revenue}
					value={event.revenue}
					icon={Revenue}
					iconBgColor="bg-purple-100"
					iconColor="text-purple-600"
				/>
				<MetricCard
					label={eventDetailPage.metrics.availability}
					value={`${event.availabilityPercent}%`}
					icon={Attendance}
					iconBgColor="bg-orange-100"
					iconColor="text-orange-600"
				/>
			</div>

			<LineChart
				title={eventDetailPage.ticketSalesTrendTitle}
				data={event.ticketSalesTrend}
				height={280}
				color="#3b82f6"
				showDatePicker={false}
			/>
		{/if}
	</div>
</div>
