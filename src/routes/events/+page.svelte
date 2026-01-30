<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EventCard from '$lib/components/events/EventCard.svelte';
	import MagnifyingGlass from '$lib/components/ui/icons/MagnifyingGlass.svelte';
	import FilterIcon from '$lib/components/ui/icons/FilterIcon.svelte';
	import { browseEvents } from '$lib/data/events';

	let searchQuery = $state('');
	const filteredEvents = $derived(
		searchQuery.trim() === ''
			? browseEvents
			: browseEvents.filter(
					(e) =>
						e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
						e.location.toLowerCase().includes(searchQuery.toLowerCase())
				)
	);

	function viewDetails(id: string) {
		goto(`/events/${id}`);
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
	<div class="max-w-full space-y-6">
		<header>
			<h1 class="text-3xl font-bold text-gray-800">Browse Events</h1>
			<p class="text-gray-500 mt-1">Discover and manage all your events</p>
		</header>

		<div class="flex flex-col sm:flex-row gap-3">
			<div class="flex-1 max-w-xl">
				<Input
					bind:value={searchQuery}
					placeholder="Search events..."
					leftIcon={MagnifyingGlass}
					class="w-full rounded-lg border-gray-300"
				/>
			</div>
			<Button
				text="Filters"
				type="button"
				variant="default"
				size="default"
				customIcon={FilterIcon}
				rounded="lg"
				class="shrink-0 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
			/>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredEvents as event}
				<EventCard {event} onViewDetails={viewDetails} />
			{/each}
		</div>

		{#if filteredEvents.length === 0}
			<p class="text-center text-gray-500 py-12">No events match your search.</p>
		{/if}
	</div>
</div>
