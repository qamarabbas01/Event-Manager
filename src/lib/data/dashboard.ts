export type Category = 'Work' | 'Business' | 'Personal';

export const dashboardPage = {
	title: 'Dashboard Overview',
	subtitle: 'Welcome back! Here is your event summary.'
} as const;

export interface MetricData {
	label: string;
	value: string;
	trend: { value: string; isPositive: boolean };
	iconKey: string;
	iconBgColor: string;
	iconColor: string;
}

export const metricsData: Record<string, MetricData> = {
	totalEvents: {
		label: 'Total Events',
		value: '24',
		trend: { value: '+12%', isPositive: true },
		iconKey: 'CalendarIcon',
		iconBgColor: 'bg-purple-100',
		iconColor: 'text-purple-600'
	},
	totalBookings: {
		label: 'Total Bookings',
		value: '1,847',
		trend: { value: '+18%', isPositive: true },
		iconKey: 'Users',
		iconBgColor: 'bg-green-100',
		iconColor: 'text-green-600'
	},
	revenue: {
		label: 'Revenue',
		value: '$89,420',
		trend: { value: '+23%', isPositive: true },
		iconKey: 'Revenue',
		iconBgColor: 'bg-purple-100',
		iconColor: 'text-purple-600'
	},
	avgAttendance: {
		label: 'Avg Attendance',
		value: '77',
		trend: { value: '-5%', isPositive: false },
		iconKey: 'Attendance',
		iconBgColor: 'bg-orange-100',
		iconColor: 'text-orange-600'
	}
};

export interface ChartDataPoint {
	label: string;
	value: number;
	date: string;
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthlyChartData(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
	opts: { startValue: number; endValue: number; variation: number }
): ChartDataPoint[] {
	const points: ChartDataPoint[] = [];
	let index = 0;
	for (let y = startYear; y <= endYear; y++) {
		const monthStart = y === startYear ? startMonth : 1;
		const monthEnd = y === endYear ? endMonth : 12;
		for (let m = monthStart; m <= monthEnd; m++) {
			index += 1;
			const shortYear = String(y).slice(-2);
			const label = m === 1 ? `${monthLabels[m - 1]} '${shortYear}` : monthLabels[m - 1];
			points.push({
				label,
				value: 0,
				date: `${y}-${String(m).padStart(2, '0')}-01`
			});
		}
	}
	const totalMonths = points.length;
	points.forEach((p, i) => {
		const t = i / Math.max(1, totalMonths - 1);
		const trend = opts.startValue + t * (opts.endValue - opts.startValue);
		const wave = Math.sin((i / 12) * Math.PI * 2) * opts.variation;
		p.value = Math.round(trend + wave);
	});
	return points;
}

export const bookingTrendsData: ChartDataPoint[] = buildMonthlyChartData(
	2024, 1, 2026, 1,
	{ startValue: 45, endValue: 95, variation: 8 }
);

export const revenueOverviewData: ChartDataPoint[] = buildMonthlyChartData(
	2024, 1, 2026, 1,
	{ startValue: 11000, endValue: 35000, variation: 2000 }
);

export const chartsConfig = {
	bookingTrends: {
		title: 'Booking Trends',
		color: '#3b82f6',
		height: 300,
		baseYear: 2024
	},
	revenueOverview: {
		title: 'Revenue Overview',
		color: '#9333ea',
		height: 300,
		baseYear: 2024
	}
} as const;

export type NotificationType = 'success' | 'warning' | 'info';

export interface NotificationData {
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	iconKey: string;
}

export const notificationsData: NotificationData[] = [
	{
		type: 'success',
		title: 'New Event Registration',
		message: 'Tech Conference 2024 has 150 new registrations',
		timestamp: '2 hours ago',
		iconKey: 'CheckFilled'
	},
	{
		type: 'warning',
		title: 'Low Ticket Availability',
		message: 'Summer Music Festival has only 20 tickets left',
		timestamp: '5 hours ago',
		iconKey: 'WarningIcon'
	},
	{
		type: 'info',
		title: 'Event Starting Soon',
		message: 'Marketing Workshop begins in 2 days',
		timestamp: '1 day ago',
		iconKey: 'InfoIcon'
	}
];

export const notificationsSectionTitle = 'Recent Notifications';
export interface NavItemData {
	label: string;
	href: string;
	iconKey: string;
}

export const appTitle = 'Event Manager';
export const logoutLabel = 'Logout';
export const toggleMenuAriaLabel = 'Toggle menu';

export const navItemsData: NavItemData[] = [
	{ label: 'Home', href: '/', iconKey: 'Home' },
	{ label: 'Dashboard', href: '/dashboard', iconKey: 'Dashboard' },
	{ label: 'Attendee Insights', href: '/attendee-insights', iconKey: 'Users' },
	{ label: 'Profile', href: '/profile', iconKey: 'Profile' }
];

export const eventsDashboardPage = {
	title: 'Dashboard',
	subtitle: 'Overview of your events and activities',
	addEventButtonText: 'Add Event',
	allEventsTitle: 'All Events',
	upcomingTitle: 'Upcoming Events',
	emptyStateText: 'No events found',
	noUpcomingText: 'No upcoming events',
	itemsCountText: 'events'
} as const;

export const eventsStatsLabels = {
	totalEvents: 'Total Events',
	active: 'Active',
	pending: 'Pending',
	completed: 'Completed'
} as const;

export const tableUi = {
	searchPlaceholder: 'Search...',
	filterCategoryLabel: 'Category',
	filterStatusLabel: 'Status',
	clearFiltersText: 'Clear filters'
} as const;

export const dateRangeUi = {
	periodPlaceholder: 'Period',
	startDateAriaLabel: 'Start date',
	endDateAriaLabel: 'End date',
	last3Months: 'Last 3 months',
	last6Months: 'Last 6 months'
} as const;

export const dateRangePresetOptions = [
	dateRangeUi.last3Months,
	dateRangeUi.last6Months
] as const;

export const profilePage = {
	title: 'Profile',
	comingSoonText: 'Profile page coming soon...'
} as const;

export const attendeeInsightsPage = {
	title: 'Attendee Insights',
	subtitle: 'Understand your audience demographics and engagement',
	charts: {
		ageDistribution: 'Age Distribution',
		topLocations: 'Top Locations',
		engagementTrends: 'Engagement Trends',
		interestCategories: 'Interest Categories'
	}
} as const;

export interface PieChartDataPoint {
	label: string;
	value: number;
}

export const ageDistributionData: PieChartDataPoint[] = [
	{ label: '18-24', value: 17 },
	{ label: '25-34', value: 30 },
	{ label: '35-44', value: 25 },
	{ label: '45-54', value: 19 },
	{ label: '55+', value: 10 }
];

export const topLocationsData: { label: string; value: number }[] = [
	{ label: 'San Francisco', value: 420 },
	{ label: 'New York', value: 380 },
	{ label: 'Austin', value: 310 },
	{ label: 'Chicago', value: 280 },
	{ label: 'Seattle', value: 250 }
];

export const engagementTrendsData: { label: string; value: number }[] = [
	{ label: 'Jan', value: 65 },
	{ label: 'Feb', value: 70 },
	{ label: 'Mar', value: 78 },
	{ label: 'Apr', value: 73 },
	{ label: 'May', value: 80 },
	{ label: 'Jun', value: 88 }
];

export const interestCategoriesData: PieChartDataPoint[] = [
	{ label: 'Technology', value: 35 },
	{ label: 'Business', value: 25 },
	{ label: 'Music', value: 20 },
	{ label: 'Food', value: 12 },
	{ label: 'Art', value: 8 }
];

export const attendeeInsightsChartColors = {
	ageDistribution: ['#3b82f6', '#9333ea', '#ec4899', '#f97316', '#22c55e'],
	interestCategories: ['#3b82f6', '#9333ea', '#ec4899', '#f97316', '#22c55e']
} as const;

export type Status = 'Active' | 'Pending' | 'Completed';

export type TableAction = 'edit' | 'delete';

export interface Event {
	id: number;
	title: string;
	date: string;
	category: Category;
	status: Status;
}

export interface DashboardTableRow {
	id: string | number;
	[key: string]: string | number | boolean | null | undefined;
}

export interface DashboardTableColumn {
	label: string;
	key: string;
	class?: string;
	render?: (row: DashboardTableRow) => string;
}

export const categories = ['All', 'Work', 'Business', 'Personal'] as const;

export const statuses = ['All', 'Active', 'Pending', 'Completed'] as const;

const ACTION_ATTRIBUTES = {
	ACTION: 'data-action',
	EVENT_ID: 'data-event-id'
} as const;

const ICON_SIZE = 18;

function createEditIcon(): string {
	return `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="${ICON_SIZE}"
		height="${ICON_SIZE}"
		viewBox="0 0 24 24"
		fill="none"
		stroke="black"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="text-black"
	>
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
	</svg>`;
}

function createDeleteIcon(): string {
	return `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="${ICON_SIZE}"
		height="${ICON_SIZE}"
		viewBox="0 0 24 24"
		fill="none"
		stroke="red"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="text-red-500"
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
		<path d="M10 11v6" />
		<path d="M14 11v6" />
		<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
	</svg>`;
}

function createActionButton(
	action: TableAction,
	eventId: number,
	icon: string
): string {
	return `<button
		class="text-white rounded text-xs cursor-pointer"
		${ACTION_ATTRIBUTES.ACTION}="${action}"
		${ACTION_ATTRIBUTES.EVENT_ID}="${eventId}"
		aria-label="${action} event ${eventId}"
	>
		${icon}
	</button>`;
}

function renderActionsColumn(row: DashboardTableRow): string {
	const eventId = Number(row.id);
	if (isNaN(eventId)) {
		return '';
	}

	const editButton = createActionButton('edit', eventId, createEditIcon());
	const deleteButton = createActionButton('delete', eventId, createDeleteIcon());

	return `<div class="flex gap-3 flex-col md:flex-row" ${ACTION_ATTRIBUTES.EVENT_ID}="${eventId}">
		${editButton}
		${deleteButton}
	</div>`;
}

export const initialEvents: Event[] = [
	{ id: 1, title: 'Team Meeting', date: '2026-01-25', category: 'Work', status: 'Active' },
	{ id: 2, title: 'Project Review', date: '2026-01-26', category: 'Work', status: 'Pending' },
	{ id: 3, title: 'Client Call', date: '2026-01-27', category: 'Business', status: 'Active' },
	{ id: 4, title: 'Design Sprint', date: '2026-02-01', category: 'Work', status: 'Completed' },
	{ id: 5, title: 'Birthday Party', date: '2026-02-03', category: 'Personal', status: 'Active' },
	{ id: 6, title: 'Sales Meeting', date: '2026-02-04', category: 'Business', status: 'Pending' },
	{ id: 7, title: 'Doctor Appointment', date: '2026-02-08', category: 'Personal', status: 'Completed' },
	{ id: 8, title: 'Team Building', date: '2026-02-10', category: 'Work', status: 'Pending' },
	{ id: 9, title: 'Quarterly Planning', date: '2026-02-14', category: 'Business', status: 'Active' },
	{ id: 10, title: 'Performance Review', date: '2026-02-17', category: 'Work', status: 'Completed' },
	{ id: 11, title: 'Family Dinner', date: '2026-02-19', category: 'Personal', status: 'Pending' },
	{ id: 12, title: 'Strategy Call', date: '2026-02-20', category: 'Business', status: 'Active' },
	{ id: 13, title: 'Networking Event', date: '2026-02-23', category: 'Business', status: 'Pending' },
	{ id: 14, title: 'Yoga Class', date: '2026-02-25', category: 'Personal', status: 'Active' },
	{ id: 15, title: 'Product Launch', date: '2026-03-01', category: 'Business', status: 'Completed' },
	{ id: 16, title: 'All Hands', date: '2026-03-03', category: 'Work', status: 'Active' },
	{ id: 17, title: 'Lunch with CEO', date: '2026-03-07', category: 'Business', status: 'Pending' },
	{ id: 18, title: 'Parent-Teacher Meeting', date: '2026-03-10', category: 'Personal', status: 'Completed' },
	{ id: 19, title: 'Sprint Demo', date: '2026-03-12', category: 'Work', status: 'Pending' },
	{ id: 20, title: 'Anniversary', date: '2026-03-15', category: 'Personal', status: 'Active' },
	{ id: 21, title: 'Board Meeting', date: '2026-03-17', category: 'Business', status: 'Active' },
	{ id: 22, title: 'Code Review', date: '2026-03-19', category: 'Work', status: 'Pending' },
	{ id: 23, title: 'Investor Call', date: '2026-03-21', category: 'Business', status: 'Active' },
	{ id: 24, title: 'Vacation', date: '2026-03-24', category: 'Personal', status: 'Completed' },
	{ id: 25, title: 'Release Planning', date: '2026-03-28', category: 'Work', status: 'Pending' },
	{ id: 26, title: 'Medical Checkup', date: '2026-03-31', category: 'Personal', status: 'Active' },
	{ id: 27, title: 'Sales Demo', date: '2026-04-02', category: 'Business', status: 'Completed' },
	{ id: 28, title: 'Town Hall', date: '2026-04-05', category: 'Work', status: 'Active' }
];

export const tableColumns: DashboardTableColumn[] = [
	{ label: 'Title', key: 'title' },
	{ label: 'Date', key: 'date' },
	{ label: 'Category', key: 'category' },
	{ label: 'Status', key: 'status' },
	{
		label: 'Actions',
		key: 'actions',
		render: renderActionsColumn
	}
];
