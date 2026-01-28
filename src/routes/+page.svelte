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

	const metrics = {
		totalEvents: {
			label: 'Total Events',
			value: '24',
			trend: { value: '+12%', isPositive: true },
			icon: CalendarIcon,
			iconBgColor: 'bg-purple-100',
			iconColor: 'text-purple-600'
		},
		totalBookings: {
			label: 'Total Bookings',
			value: '1,847',
			trend: { value: '+18%', isPositive: true },
			icon: Users,
			iconBgColor: 'bg-green-100',
			iconColor: 'text-green-600'
		},
		revenue: {
			label: 'Revenue',
			value: '$89,420',
			trend: { value: '+23%', isPositive: true },
			icon: Revenue,
			iconBgColor: 'bg-purple-100',
			iconColor: 'text-purple-600'
		},
		avgAttendance: {
			label: 'Avg Attendance',
			value: '77',
			trend: { value: '-5%', isPositive: false },
			icon: Attendance,
			iconBgColor: 'bg-orange-100',
			iconColor: 'text-orange-600'
		}
	};

	const bookingTrends = [
		{ label: 'Jan', value: 45 },
		{ label: 'Feb', value: 50 },
		{ label: 'Mar', value: 60 },
		{ label: 'Apr', value: 58 },
		{ label: 'May', value: 70 },
		{ label: 'Jun', value: 85 }
	];

	const revenueOverview = [
		{ label: 'Jan', value: 11000 },
		{ label: 'Feb', value: 14000 },
		{ label: 'Mar', value: 17000 },
		{ label: 'Apr', value: 15000 },
		{ label: 'May', value: 20000 },
		{ label: 'Jun', value: 24000 }
	];

	const notifications = [
		{
			type: 'success' as const,
			title: 'New Event Registration',
			message: 'Tech Conference 2024 has 150 new registrations',
			timestamp: '2 hours ago',
			icon: CheckFilled
		},
		{
			type: 'warning' as const,
			title: 'Low Ticket Availability',
			message: 'Summer Music Festival has only 20 tickets left',
			timestamp: '5 hours ago',
			icon: WarningIcon
		},
		{
			type: 'info' as const,
			title: 'Event Starting Soon',
			message: 'Marketing Workshop begins in 2 days',
			timestamp: '1 day ago',
			icon: InfoIcon
		}
	];
</script>

<div class="bg-gray-50 min-h-screen p-4 md:p-6 max-w-full mx-auto md:mx-0">
	<div class="max-w-full mx-auto space-y-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
			<p class="text-gray-600">Welcome back! Here is your event summary.</p>
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
			<LineChart title="Booking Trends" data={bookingTrends} color="#3b82f6" />
			<BarChart title="Revenue Overview" data={revenueOverview} color="#9333ea" />
		</div>

		<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h2>
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
