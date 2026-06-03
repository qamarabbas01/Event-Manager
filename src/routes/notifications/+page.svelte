<script lang="ts">
	import NotificationItem from '$lib/components/ui/NotificationItem.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MetricCard from '$lib/components/ui/MetricCard.svelte';
	import { CircleCheck, Info, TriangleAlert, Bell, Calendar, Check } from 'lucide-svelte';
	import {
		notificationsPage,
		notificationsInboxData,
		type NotificationType
	} from '$lib/data/dashboard';
	import type { IconComponent } from '$lib/types/components';

	type FilterKey = 'all' | NotificationType;

	const iconMap: Record<string, IconComponent> = {
		CheckFilled: CircleCheck,
		InfoIcon: Info,
		WarningIcon: TriangleAlert
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
			icon: iconMap[n.iconKey] ?? Info
		}))
	);

	const filteredNotifications = $derived(
		activeFilter === 'all' ? notifications : notifications.filter((n) => n.type === activeFilter)
	);

	const unreadCount = $derived(notifications.length - readIds.length);

	const stats = $derived({
		unread: unreadCount,
		today: notifications.filter((n) => n.timestamp.includes('hour')).length,
		thisWeek: notifications.filter((n) => !n.timestamp.includes('days ago')).length
	});

	function filterCount(key: FilterKey): number {
		if (key === 'all') return notifications.length;
		return notifications.filter((n) => n.type === key).length;
	}

	function markAllRead() {
		readIds = notifications.map((n) => n.id);
	}

	function toggleRead(id: number) {
		readIds = readIds.includes(id) ? readIds.filter((readId) => readId !== id) : [...readIds, id];
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="w-full max-w-full flex flex-col gap-6">
		<header
			class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-200 dark:border-gray-700/60"
		>
			<div class="min-w-0">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
					{notificationsPage.title}
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
					{notificationsPage.subtitle}
				</p>
			</div>
			{#if unreadCount > 0}
				<Button
					text={notificationsPage.markAllReadText}
					variant="default"
					rounded="full"
					size="sm"
					class="shrink-0 self-start sm:self-center"
					onClick={markAllRead}
					customIcon={Check}
					iconSize={15}
				/>
			{/if}
		</header>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<MetricCard
				label={notificationsPage.stats.unread}
				value={stats.unread}
				icon={Bell}
				iconBgColor="bg-blue-100 dark:bg-blue-900/30"
				iconColor="text-blue-600 dark:text-blue-400"
			/>
			<MetricCard
				label={notificationsPage.stats.today}
				value={stats.today}
				icon={Calendar}
				iconBgColor="bg-purple-100 dark:bg-purple-900/30"
				iconColor="text-purple-600 dark:text-purple-400"
			/>
			<MetricCard
				label={notificationsPage.stats.thisWeek}
				value={stats.thisWeek}
				icon={CircleCheck}
				iconBgColor="bg-green-100 dark:bg-green-900/30"
				iconColor="text-green-600 dark:text-green-400"
			/>
		</div>

		<section
			class="bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden transition-colors"
		>
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/40"
			>
				<div>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Inbox</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
						{filteredNotifications.length} notification{filteredNotifications.length === 1
							? ''
							: 's'}
					</p>
				</div>
				<div
					class="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
					role="tablist"
					aria-label="Filter notifications"
				>
					{#each filterOptions as option (option.key)}
						<button
							type="button"
							role="tab"
							aria-selected={activeFilter === option.key}
							onclick={() => (activeFilter = option.key)}
							class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors {activeFilter ===
							option.key
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}"
						>
							{option.label}
							<span
								class="inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full text-xs font-semibold {activeFilter ===
								option.key
									? 'bg-white/25 text-white'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}"
							>
								{filterCount(option.key)}
							</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="divide-y divide-gray-100 dark:divide-gray-700/50">
				{#each filteredNotifications as notification (notification.id)}
					{@const isRead = readIds.includes(notification.id)}
					<button
						type="button"
						onclick={() => toggleRead(notification.id)}
						class="w-full text-left px-4 sm:px-6 py-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 {isRead
							? 'opacity-70'
							: 'bg-blue-50/40 dark:bg-blue-900/10'}"
					>
						<div
							class="flex gap-4 items-stretch py-4 border-l-4 {isRead
								? 'border-transparent'
								: 'border-blue-500'}"
						>
							<div class="flex-1 min-w-0 pl-2">
								<NotificationItem
									compact
									type={notification.type}
									title={notification.title}
									message={notification.message}
									timestamp={notification.timestamp}
									icon={notification.icon}
								/>
							</div>
							{#if !isRead}
								<span
									class="shrink-0 self-center w-2 h-2 rounded-full bg-blue-500"
									aria-hidden="true"
								></span>
							{/if}
						</div>
					</button>
				{:else}
					<p class="text-center text-gray-500 dark:text-gray-400 py-16 px-6">
						{notificationsPage.emptyText}
					</p>
				{/each}
			</div>
		</section>
	</div>
</div>
