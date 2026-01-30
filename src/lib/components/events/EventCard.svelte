<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import CalendarIcon from '$lib/components/ui/icons/CalendarIcon.svelte';
	import MapPin from '$lib/components/ui/icons/MapPin.svelte';
	import Users from '$lib/components/ui/icons/Users.svelte';
	import type { BrowseEvent } from '$lib/data/events';

	interface Props {
		event: BrowseEvent;
		onViewDetails?: (id: string) => void;
	}

	let { event, onViewDetails }: Props = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toISOString().slice(0, 10);
	}

	function availabilityPercent(attendees: number, capacity: number): number {
		return capacity > 0 ? Math.round((attendees / capacity) * 100) : 0;
	}

	const availability = $derived(availabilityPercent(event.attendees, event.capacity));
</script>

<article
	class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
>
	<div class="relative aspect-16/10 shrink-0">
		<img
			src={event.image}
			alt={event.title}
			class="w-full h-full object-cover"
		/>
		<span
			class="absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-200 text-blck"
		>
			{event.category}
		</span>
	</div>
	<div class="p-4 flex flex-col flex-1">
		<h2 class="text-lg font-bold text-gray-800 mb-3">{event.title}</h2>
		<div class="space-y-2 text-sm text-gray-500 mb-4">
			<div class="flex items-center gap-2">
				<CalendarIcon size={16} class="text-gray-400 shrink-0" />
				<span>{formatDate(event.date)}</span>
			</div>
			<div class="flex items-center gap-2">
				<MapPin size={16} class="text-gray-400 shrink-0" />
				<span>{event.location}</span>
			</div>
			<div class="flex items-center gap-2">
				<Users size={16} class="text-gray-400 shrink-0" />
				<span>{event.attendees.toLocaleString()} / {event.capacity.toLocaleString()} attendees</span>
			</div>
		</div>
		<div class="mt-auto space-y-3">
			<div>
				<div class="flex items-center justify-between text-xs text-gray-500 mb-1">
					<span>Availability</span>
					<span class="font-medium text-gray-700">{availability}%</span>
				</div>
				<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-500 rounded-full transition-all"
						style="width: {availability}%"
					></div>
				</div>
			</div>
			{#if onViewDetails}
				<Button
					text="View details"
					type="button"
					variant="primary-blue"
					size="sm"
					rounded="lg"
					class="w-full"
					onClick={() => onViewDetails(event.id)}
				/>
			{/if}
		</div>
	</div>
</article>
