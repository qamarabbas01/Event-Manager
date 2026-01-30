<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getEventById } from '$lib/data/events';
	import LineChart from '$lib/components/ui/LineChart.svelte';
	import MetricCard from '$lib/components/ui/MetricCard.svelte';
	import CalendarIcon from '$lib/components/ui/icons/CalendarIcon.svelte';
	import MapPin from '$lib/components/ui/icons/MapPin.svelte';
	import Users from '$lib/components/ui/icons/Users.svelte';
	import Revenue from '$lib/components/ui/icons/Revenue.svelte';
	import Attendance from '$lib/components/ui/icons/Attendance.svelte';
	import Arrowleft from '$lib/components/ui/icons/Arrowleft.svelte';

	const eventId = $derived($page.params.id ?? '');
	const event = $derived(getEventById(eventId));

	function formatEventDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function backToEvents() {
		goto('/events');
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
	<div class="space-y-6">
		<a
			href="/events"
			onclick={(e) => {
				e.preventDefault();
				backToEvents();
			}}
			class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium mb-4"
		>
			<Arrowleft size={18} />
			Back to Events
		</a>

		{#if !event}
			<div class="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm text-center">
				<p class="text-gray-500 mb-4">Event not found.</p>
				<a
					href="/events"
					onclick={(e) => {
						e.preventDefault();
						backToEvents();
					}}
					class="text-blue-600 hover:underline font-medium"
				>
					Return to Browse Events
				</a>
			</div>
		{:else}
			<section class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
				<div class="aspect-21/9 md:aspect-3/1 relative">
					<img
						src={event.image}
						alt={event.title}
						class="w-full h-full object-cover"
					/>
				</div>
				<div class="p-6 md:p-8">
					<span
						class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3"
					>
						{event.category}
					</span>
					<h1 class="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
					<div class="flex flex-wrap gap-6 text-gray-600 mb-6">
						<div class="flex items-center gap-2">
							<CalendarIcon size={20} class="text-gray-400 shrink-0" />
							<span>{formatEventDate(event.date)}</span>
						</div>
						<div class="flex items-center gap-2">
							<MapPin size={20} class="text-gray-400 shrink-0" />
							<span>{event.venue}</span>
						</div>
					</div>
					<p class="text-gray-600 leading-relaxed">{event.description}</p>
				</div>
			</section>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					label="Attendees"
					value={event.attendees.toLocaleString()}
					icon={Users}
					iconBgColor="bg-blue-100"
					iconColor="text-blue-600"
				/>
				<MetricCard
					label="Tickets Sold"
					value={`${event.attendees.toLocaleString()}/${event.capacity.toLocaleString()}`}
					icon={CalendarIcon}
					iconBgColor="bg-green-100"
					iconColor="text-green-600"
				/>
				<MetricCard
					label="Revenue"
					value={event.revenue}
					icon={Revenue}
					iconBgColor="bg-purple-100"
					iconColor="text-purple-600"
				/>
				<MetricCard
					label="Availability"
					value={`${event.availabilityPercent}%`}
					icon={Attendance}
					iconBgColor="bg-orange-100"
					iconColor="text-orange-600"
				/>
			</div>

			<LineChart
				title="Ticket Sales Trend"
				data={event.ticketSalesTrend}
				height={280}
				color="#3b82f6"
				showDatePicker={false}
			/>
		{/if}
	</div>
</div>
