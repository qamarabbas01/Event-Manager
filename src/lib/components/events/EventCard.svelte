<script lang="ts">
	import { Calendar, MapPin, Users, ArrowRight, DollarSign } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { BrowseEvent } from '$lib/data/events';
	import {
		formatBrowseDateShort,
		getEventTimeStatus,
		isAlmostFull
	} from '$lib/data/events';
	import { eventCardUi } from '$lib/data/dashboard';

	interface Props {
		event: BrowseEvent;
		onViewDetails?: (id: string) => void;
	}

	let { event, onViewDetails }: Props = $props();

	const availability = $derived(
		event.capacity > 0 ? Math.round((event.attendees / event.capacity) * 100) : 0
	);
	const timeStatus = $derived(getEventTimeStatus(event.date));
	const almostFull = $derived(isAlmostFull(event.attendees, event.capacity));
	const barColor = $derived(
		availability >= 90 ? 'bg-red-500' : availability >= 70 ? 'bg-amber-500' : 'bg-blue-500'
	);

	const statusLabel = $derived(
		almostFull && timeStatus !== 'past'
			? eventCardUi.statusAlmostFull
			: timeStatus === 'today'
				? eventCardUi.statusToday
				: timeStatus === 'past'
					? eventCardUi.statusPast
					: eventCardUi.statusUpcoming
	);

	const statusClass = $derived(
		almostFull && timeStatus !== 'past'
			? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
			: timeStatus === 'today'
				? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
				: timeStatus === 'past'
					? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
					: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
	);

	const viewDetailsLabel = $derived(`${eventCardUi.viewDetailsButtonText} — ${event.title}`);

	function handleViewDetails() {
		onViewDetails?.(event.id);
	}
</script>

<article
	class="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
>
	<div class="relative aspect-16/10 shrink-0 overflow-hidden">
		<img
			src={event.image}
			alt=""
			class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
		<div class="absolute top-3 left-3 right-3 flex flex-wrap gap-2 justify-between">
			<span
				class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-100 backdrop-blur-sm"
			>
				{event.category}
			</span>
			<span class="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm {statusClass}">
				{statusLabel}
			</span>
		</div>
	</div>

	<div class="p-4 flex flex-col flex-1">
		<h2
			id="event-title-{event.id}"
			class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
		>
			{event.title}
		</h2>

		<div class="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
			<div class="flex items-center gap-2">
				<Calendar size={16} class="text-gray-400 shrink-0" aria-hidden="true" />
				<time datetime={event.date}>{formatBrowseDateShort(event.date)}</time>
			</div>
			<div class="flex items-center gap-2">
				<MapPin size={16} class="text-gray-400 shrink-0" aria-hidden="true" />
				<span class="line-clamp-1">{event.location}</span>
			</div>
			<div class="flex items-center gap-2">
				<Users size={16} class="text-gray-400 shrink-0" aria-hidden="true" />
				<span>
					{event.attendees.toLocaleString()} / {event.capacity.toLocaleString()}
					{eventCardUi.attendeesSuffix}
				</span>
			</div>
			<div class="flex items-center gap-2">
				<DollarSign size={16} class="text-gray-400 shrink-0" aria-hidden="true" />
				<span>{event.revenue} {eventCardUi.revenueLabel}</span>
			</div>
		</div>

		<div class="mt-auto space-y-3">
			<div>
				<div
					class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1"
				>
					<span>{eventCardUi.availabilityLabel}</span>
					<span class="font-medium text-gray-700 dark:text-gray-300">{availability}%</span>
				</div>
				<div
					class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
					role="progressbar"
					aria-valuenow={availability}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-labelledby="event-title-{event.id}"
				>
					<div class="h-full {barColor} rounded-full transition-all" style="width: {availability}%"></div>
				</div>
			</div>

			<Button
				text={eventCardUi.viewDetailsButtonText}
				type="button"
				variant="primary-blue"
				size="sm"
				rounded="lg"
				class="w-full after:absolute after:inset-0 after:z-[1] after:content-['']"
				stretchedLink
				ariaLabel={viewDetailsLabel}
				customIcon={ArrowRight}
				customIconPosition="right"
				iconSize={16}
				onClick={handleViewDetails}
			/>
		</div>
	</div>
</article>
