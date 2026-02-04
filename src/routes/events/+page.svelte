<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EventCard from '$lib/components/events/EventCard.svelte';
	import MagnifyingGlass from '$lib/components/ui/icons/MagnifyingGlass.svelte';
	import FilterIcon from '$lib/components/ui/icons/FilterIcon.svelte';
	import { browseEvents } from '$lib/data/events';
	import { browseEventsPage } from '$lib/data/dashboard';
	import Arrowleft from '$lib/components/ui/icons/Arrowleft.svelte';

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
		goto(resolve(`/events/${id}`));
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="max-w-full space-y-6">
		<header class="flex flex-col sm:flex-row justify-between gap-4">
			<div class="flex flex-col gap-2">
				<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
					{browseEventsPage.title}
				</h1>
				<p class="text-gray-500 dark:text-gray-400">{browseEventsPage.subtitle}</p>
			</div>
			<div class="flex gap-2 md:hidden">
				<a href="/dashboard" class="text-sm items-center flex gap-2 text-black dark:text-white cursor-pointer">
					<Arrowleft size={16} class="text-black dark:text-white shrink-0" />
					Back to Dashboard
				</a>
			</div>
		</header>

		<div class="flex flex-col sm:flex-row gap-3">
			<div class="flex-1 max-w-xl">
				<Input
					bind:value={searchQuery}
					placeholder={browseEventsPage.searchPlaceholder}
					leftIcon={MagnifyingGlass}
					class="w-full rounded-lg border-gray-300"
				/>
			</div>
			<Button
				text={browseEventsPage.filtersButtonText}
				type="button"
				variant="default"
				size="default"
				customIcon={FilterIcon}
				iconSize={24}
				rounded="lg"
				class="shrink-0 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700"
			/>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredEvents as event (event.id)}
				<EventCard {event} onViewDetails={viewDetails} />
			{/each}
		</div>

		{#if filteredEvents.length === 0}
			<p class="text-center text-gray-500 dark:text-gray-400 py-12">
				{browseEventsPage.noResultsText}
			</p>
		{/if}
	</div>
</div>
