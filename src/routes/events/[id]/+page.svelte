<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		getEventById,
		getRelatedEvents,
		formatBrowseDate,
		getEventTimeStatus,
		spotsRemaining,
		isAlmostFull
	} from '$lib/data/events';
	import { eventDetailPage, eventCardUi } from '$lib/data/dashboard';
	import LineChart from '$lib/components/ui/LineChart.svelte';
	import MetricCard from '$lib/components/ui/MetricCard.svelte';
	import EventCard from '$lib/components/events/EventCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Calendar,
		MapPin,
		Users,
		TrendingUp,
		UserCheck,
		ArrowLeft,
		Ticket,
		Share2,
		Building2
	} from 'lucide-svelte';

	const eventId = $derived(page.params.id ?? '');
	const event = $derived(getEventById(eventId));
	const relatedEvents = $derived(event ? getRelatedEvents(event.id) : []);
	const eventsHref = resolve('/events');

	const timeStatus = $derived(event ? getEventTimeStatus(event.date) : 'upcoming');
	const remaining = $derived(event ? spotsRemaining(event.attendees, event.capacity) : 0);
	const almostFull = $derived(event ? isAlmostFull(event.attendees, event.capacity) : false);

	const statusLabel = $derived(
		!event
			? ''
			: almostFull && timeStatus !== 'past'
				? eventCardUi.statusAlmostFull
				: timeStatus === 'today'
					? eventCardUi.statusToday
					: timeStatus === 'past'
						? eventCardUi.statusPast
						: eventCardUi.statusUpcoming
	);

	function backToEvents() {
		goto(eventsHref);
	}

	function viewDetails(id: string) {
		goto(resolve(`/events/${id}`));
	}

	function handleGetTickets() {
		// Demo: no checkout flow yet
	}

	function handleShare() {
		if (!event || typeof navigator === 'undefined' || !navigator.share) return;
		navigator
			.share({
				title: event.title,
				text: event.description,
				url: window.location.href
			})
			.catch((err) => {
				console.error('Error sharing event:', err);
			});
	}

	const canShare = $derived(typeof navigator !== 'undefined' && !!navigator.share);
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="max-w-6xl mx-auto space-y-6">
		<a
			href={eventsHref}
			onclick={(e) => {
				e.preventDefault();
				backToEvents();
			}}
			class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
		>
			<ArrowLeft size={18} aria-hidden="true" />
			{eventDetailPage.backLink}
		</a>

		{#if !event}
			<div
				class="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors"
			>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400"
				>
					<Calendar size={32} aria-hidden="true" />
				</div>
				<p class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
					{eventDetailPage.notFoundMessage}
				</p>
				<p class="text-gray-500 dark:text-gray-400 mb-6">{eventDetailPage.notFoundHint}</p>
				<Button
					text={eventDetailPage.returnToBrowse}
					variant="primary-blue"
					rounded="lg"
					onClick={backToEvents}
				/>
			</div>
		{:else}
			<section
				class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors"
			>
				<div class="aspect-21/9 md:aspect-3/1 relative">
					<img src={event.image} alt="" class="w-full h-full object-cover" />
					<div
						class="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
					></div>
					<div class="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
						<div class="flex flex-wrap gap-2 mb-2">
							<span
								class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm"
							>
								{event.category}
							</span>
							<span
								class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-sm"
							>
								{statusLabel}
							</span>
						</div>
						<h1 class="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">{event.title}</h1>
					</div>
				</div>

				<div class="p-6 md:p-8">
					<div class="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 mb-6">
						<div class="flex items-center gap-2">
							<Calendar size={20} class="text-gray-400 dark:text-gray-500 shrink-0" aria-hidden="true" />
							<time datetime={event.date}>{formatBrowseDate(event.date)}</time>
						</div>
						<div class="flex items-center gap-2">
							<MapPin size={20} class="text-gray-400 dark:text-gray-500 shrink-0" aria-hidden="true" />
							<span>{event.location}</span>
						</div>
					</div>

					<div class="flex flex-wrap gap-3 mb-8">
						{#if timeStatus !== 'past'}
							<Button
								text={eventDetailPage.getTicketsCta}
								variant="primary-blue"
								rounded="lg"
								customIcon={Ticket}
								iconSize={18}
								onClick={handleGetTickets}
							/>
						{/if}
						{#if canShare}
							<Button
								text={eventDetailPage.shareCta}
								variant="default"
								rounded="lg"
								customIcon={Share2}
								iconSize={18}
								class="border border-gray-300 dark:border-gray-600"
								onClick={handleShare}
							/>
						{/if}
					</div>

					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
						{eventDetailPage.aboutTitle}
					</h2>
					<p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{event.description}</p>

					<div
						class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5"
					>
						<div class="flex items-start gap-3">
							<Building2
								size={22}
								class="text-gray-400 shrink-0 mt-0.5"
								aria-hidden="true"
							/>
							<div>
								<h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
									{eventDetailPage.venueTitle}
								</h3>
								<p class="mt-1 text-gray-600 dark:text-gray-400">{event.venue}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					label={eventDetailPage.metrics.attendees}
					value={event.attendees.toLocaleString()}
					icon={Users}
					iconBgColor="bg-blue-100 dark:bg-blue-900/30"
					iconColor="text-blue-600 dark:text-blue-400"
				/>
				<MetricCard
					label={eventDetailPage.metrics.ticketsSold}
					value={`${event.attendees.toLocaleString()}/${event.capacity.toLocaleString()}`}
					icon={Calendar}
					iconBgColor="bg-green-100 dark:bg-green-900/30"
					iconColor="text-green-600 dark:text-green-400"
				/>
				<MetricCard
					label={eventDetailPage.metrics.revenue}
					value={event.revenue}
					icon={TrendingUp}
					iconBgColor="bg-purple-100 dark:bg-purple-900/30"
					iconColor="text-purple-600 dark:text-purple-400"
				/>
				<MetricCard
					label={eventDetailPage.metrics.availability}
					value={`${event.availabilityPercent}%`}
					icon={UserCheck}
					iconBgColor="bg-orange-100 dark:bg-orange-900/30"
					iconColor="text-orange-600 dark:text-orange-400"
				/>
			</div>

			<section
				class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors"
			>
				<div class="flex items-center justify-between mb-3">
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
						{eventDetailPage.capacityTitle}
					</h2>
					<span class="text-sm text-gray-500 dark:text-gray-400">
						{remaining.toLocaleString()}
						{eventDetailPage.spotsRemaining}
					</span>
				</div>
				<div
					class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
					role="progressbar"
					aria-valuenow={event.availabilityPercent}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div
						class="h-full rounded-full transition-all {event.availabilityPercent >= 90
							? 'bg-red-500'
							: event.availabilityPercent >= 70
								? 'bg-amber-500'
								: 'bg-blue-500'}"
						style="width: {event.availabilityPercent}%"
					></div>
				</div>
			</section>

			<LineChart
				title={eventDetailPage.ticketSalesTrendTitle}
				data={event.ticketSalesTrend}
				height={280}
				color="#3b82f6"
				showDatePicker={false}
			/>

			{#if relatedEvents.length > 0}
				<section class="space-y-4">
					<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
						{eventDetailPage.relatedTitle}
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each relatedEvents as related (related.id)}
							<EventCard event={related} onViewDetails={viewDetails} />
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</div>
</div>
