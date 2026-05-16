<script lang="ts">
	import NotificationItem from '$lib/components/ui/NotificationItem.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CheckFilled from '$lib/components/ui/icons/CheckFilled.svelte';
	import InfoIcon from '$lib/components/ui/icons/InfoIcon.svelte';
	import WarningIcon from '$lib/components/ui/icons/WarningIcon.svelte';
	import {
		notificationsPage,
		notificationsInboxData,
		type NotificationType
	} from '$lib/data/dashboard';
	import type { IconComponent } from '$lib/types/components';

	type FilterKey = 'all' | NotificationType;

	const iconMap: Record<string, IconComponent> = {
		CheckFilled,
		InfoIcon,
		WarningIcon
	};

	const filterOptions: { key: FilterKey; label: string }[] = [
		{ key: 'all', label: notificationsPage.filters.all },
		{ key: 'success', label: notificationsPage.filters.success },
		{ key: 'warning', label: notificationsPage.filters.warning },
		{ key: 'info', label: notificationsPage.filters.info }
	];

	let activeFilter = $state<FilterKey>('all');
	let readIds = $state<number[]>([]);

	const notifications = $derived(
		notificationsInboxData.map((n, index) => ({
			...n,
			id: index,
			icon: iconMap[n.iconKey] ?? InfoIcon
		}))
	);

	const filteredNotifications = $derived(
		activeFilter === 'all'
			? notifications
			: notifications.filter((n) => n.type === activeFilter)
	);

	const unreadCount = $derived(notifications.length - readIds.length);

	const stats = $derived({
		unread: unreadCount,
		today: notifications.filter((n) => n.timestamp.includes('hour')).length,
		thisWeek: notifications.filter((n) => !n.timestamp.includes('days ago')).length
	});

	function markAllRead() {
		readIds = notifications.map((n) => n.id);
	}

	function toggleRead(id: number) {
		readIds = readIds.includes(id) ? readIds.filter((readId) => readId !== id) : [...readIds, id];
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="max-w-3xl flex flex-col gap-6">
		<header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
					{notificationsPage.title}
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">{notificationsPage.subtitle}</p>
			</div>
			{#if unreadCount > 0}
				<Button
					text={notificationsPage.markAllReadText}
					variant="default"
					rounded="lg"
					size="sm"
					onClick={markAllRead}
				/>
			{/if}
		</header>

		<div class="grid grid-cols-3 gap-3">
			<div
				class="rounded-2xl bg-white dark:bg-[#212932] border border-gray-200 dark:border-gray-700/50 p-4 shadow-sm"
			>
				<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
					{notificationsPage.stats.unread}
				</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.unread}</p>
			</div>
			<div
				class="rounded-2xl bg-white dark:bg-[#212932] border border-gray-200 dark:border-gray-700/50 p-4 shadow-sm"
			>
				<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
					{notificationsPage.stats.today}
				</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.today}</p>
			</div>
			<div
				class="rounded-2xl bg-white dark:bg-[#212932] border border-gray-200 dark:border-gray-700/50 p-4 shadow-sm"
			>
				<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
					{notificationsPage.stats.thisWeek}
				</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.thisWeek}</p>
			</div>
		</div>

		<div
			class="flex flex-wrap gap-2 p-1 rounded-xl bg-white dark:bg-[#212932] border border-gray-200 dark:border-gray-700/50 shadow-sm"
			role="tablist"
			aria-label="Filter notifications"
		>
			{#each filterOptions as option (option.key)}
				<button
					type="button"
					role="tab"
					aria-selected={activeFilter === option.key}
					onclick={() => (activeFilter = option.key)}
					class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeFilter === option.key
						? 'bg-blue-600 text-white'
						: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}"
				>
					{option.label}
				</button>
			{/each}
		</div>

		<div class="space-y-3">
			{#each filteredNotifications as notification (notification.id)}
				<button
					type="button"
					onclick={() => toggleRead(notification.id)}
					class="w-full text-left rounded-lg transition-opacity {readIds.includes(notification.id)
						? 'opacity-60'
						: ''}"
				>
					<NotificationItem
						type={notification.type}
						title={notification.title}
						message={notification.message}
						timestamp={notification.timestamp}
						icon={notification.icon}
					/>
				</button>
			{:else}
				<p class="text-center text-gray-500 dark:text-gray-400 py-12">
					{notificationsPage.emptyText}
				</p>
			{/each}
		</div>
	</div>
</div>
