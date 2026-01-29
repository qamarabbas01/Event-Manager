<script lang="ts">
	import MetricCard from '$lib/components/ui/MetricCard.svelte';
	import LineChart from '$lib/components/ui/LineChart.svelte';
	import BarChart from '$lib/components/ui/BarChart.svelte';
	import NotificationItem from '$lib/components/ui/NotificationItem.svelte';
	import CalendarIcon from '$lib/components/ui/icons/CalendarIcon.svelte';
	import Users from '$lib/components/ui/icons/Users.svelte';
	import Revenue from '$lib/components/ui/icons/Revenue.svelte';
	import Attendance from '$lib/components/ui/icons/Attendance.svelte';
	import CheckFilled from '$lib/components/ui/icons/CheckFilled.svelte';
	import InfoIcon from '$lib/components/ui/icons/InfoIcon.svelte';
	import WarningIcon from '$lib/components/ui/icons/WarningIcon.svelte';
	import {
		dashboardPage,
		metricsData,
		bookingTrendsData,
		revenueOverviewData,
		chartsConfig,
		notificationsData,
		notificationsSectionTitle
	} from '$lib/data/dashboard';
	import type { IconComponent } from '$lib/types/components';

	const iconMap: Record<string, IconComponent> = {
		CalendarIcon,
		Users,
		Revenue,
		Attendance,
		CheckFilled,
		InfoIcon,
		WarningIcon
	};

	const metrics = $derived(
		Object.fromEntries(
			Object.entries(metricsData).map(([key, m]) => [
				key,
				{
					...m,
					icon: iconMap[m.iconKey] ?? CalendarIcon
				}
			])
		)
	);

	const notifications = $derived(
		notificationsData.map((n) => ({
			...n,
			icon: iconMap[n.iconKey] ?? InfoIcon
		}))
	);
</script>

<div class="bg-gray-50 min-h-screen p-4 md:p-6 max-w-full mx-auto md:mx-0">
	<div class="max-w-full mx-auto space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">{dashboardPage.title}</h1>
			<p class="text-gray-600">{dashboardPage.subtitle}</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<MetricCard
				label={metrics.totalEvents.label}
				value={metrics.totalEvents.value}
				trend={metrics.totalEvents.trend}
				icon={metrics.totalEvents.icon}
				iconBgColor={metrics.totalEvents.iconBgColor}
				iconColor={metrics.totalEvents.iconColor}
			/>
			<MetricCard
				label={metrics.totalBookings.label}
				value={metrics.totalBookings.value}
				trend={metrics.totalBookings.trend}
				icon={metrics.totalBookings.icon}
				iconBgColor={metrics.totalBookings.iconBgColor}
				iconColor={metrics.totalBookings.iconColor}
			/>
			<MetricCard
				label={metrics.revenue.label}
				value={metrics.revenue.value}
				trend={metrics.revenue.trend}
				icon={metrics.revenue.icon}
				iconBgColor={metrics.revenue.iconBgColor}
				iconColor={metrics.revenue.iconColor}
			/>
			<MetricCard
				label={metrics.avgAttendance.label}
				value={metrics.avgAttendance.value}
				trend={metrics.avgAttendance.trend}
				icon={metrics.avgAttendance.icon}
				iconBgColor={metrics.avgAttendance.iconBgColor}
				iconColor={metrics.avgAttendance.iconColor}
			/>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<LineChart
				title={chartsConfig.bookingTrends.title}
				data={bookingTrendsData}
				color={chartsConfig.bookingTrends.color}
				height={chartsConfig.bookingTrends.height}
				baseYear={chartsConfig.bookingTrends.baseYear}
			/>
			<BarChart
				title={chartsConfig.revenueOverview.title}
				data={revenueOverviewData}
				color={chartsConfig.revenueOverview.color}
				height={chartsConfig.revenueOverview.height}
				baseYear={chartsConfig.revenueOverview.baseYear}
				valuePrefix="$"
			/>
		</div>

		<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">{notificationsSectionTitle}</h2>
			<div class="space-y-3">
				{#each notifications as notification}
					<NotificationItem
						type={notification.type}
						title={notification.title}
						message={notification.message}
						timestamp={notification.timestamp}
						icon={notification.icon}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>
