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

const monthLabels = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

function buildMonthlyChartData(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
	opts: { startValue: number; endValue: number; variation: number }
): ChartDataPoint[] {
	const points: ChartDataPoint[] = [];
	for (let y = startYear; y <= endYear; y++) {
		const monthStart = y === startYear ? startMonth : 1;
		const monthEnd = y === endYear ? endMonth : 12;
		for (let m = monthStart; m <= monthEnd; m++) {
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

export const bookingTrendsData: ChartDataPoint[] = buildMonthlyChartData(2024, 1, 2026, 1, {
	startValue: 45,
	endValue: 95,
	variation: 8
});

export const revenueOverviewData: ChartDataPoint[] = buildMonthlyChartData(2024, 1, 2026, 1, {
	startValue: 11000,
	endValue: 35000,
	variation: 2000
});

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

export const appTitle = 'EventHub';
export const logoutLabel = 'Logout';
export const toggleMenuAriaLabel = 'Toggle menu';

export const themeLightLabel = 'Light';
export const themeDarkLabel = 'Dark';
export const themeToggleAriaLabel = 'Toggle light or dark theme';

export const navItemsData = [
	{ label: 'Overview', href: '/dashboard/overview', iconKey: 'Home' },
	{ label: 'Events', href: '/dashboard', iconKey: 'Calendar' },
	{ label: 'Attendee Insights', href: '/attendee-insights', iconKey: 'Chart' },
	{ label: 'Profile', href: '/profile', iconKey: 'Profile' }
] as const satisfies readonly NavItemData[];

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

export const browseEventsPage = {
	title: 'Browse Events',
	subtitle: 'Discover and manage all your events',
	searchPlaceholder: 'Search events...',
	filtersButtonText: 'Filters',
	noResultsText: 'No events match your search.'
} as const;

export const eventDetailPage = {
	backLink: 'Back to Events',
	notFoundMessage: 'Event not found.',
	returnToBrowse: 'Return to Browse Events',
	metrics: {
		attendees: 'Attendees',
		ticketsSold: 'Tickets Sold',
		revenue: 'Revenue',
		availability: 'Availability'
	},
	ticketSalesTrendTitle: 'Ticket Sales Trend'
} as const;

export const eventCardUi = {
	viewDetailsButtonText: 'View details',
	availabilityLabel: 'Availability',
	attendeesSuffix: 'attendees'
} as const;

export const addEventModal = {
	titleLabel: 'Title',
	dateLabel: 'Date',
	eventTitlePlaceholder: 'Event title',
	categoryLabel: 'Category',
	statusLabel: 'Status',
	selectCategoryPlaceholder: 'Select category',
	selectStatusPlaceholder: 'Select status',
	cancelButtonText: 'Cancel',
	addEventText: 'Add Event',
	editEventText: 'Edit Event',
	saveButtonText: 'Save'
} as const;

export const modalCloseAriaLabel = 'Close';

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

export const dateRangePresetOptions = [dateRangeUi.last3Months, dateRangeUi.last6Months] as const;

export type UserRole = 'admin' | 'user';

export const profilePage = {
	title: 'Profile',
	subtitle: 'Manage your account and preferences',
	personalInfo: {
		sectionTitle: 'Personal Information',
		nameLabel: 'Full name',
		namePlaceholder: 'Enter your name',
		emailLabel: 'Email',
		emailPlaceholder: 'you@example.com',
		phoneLabel: 'Phone',
		phonePlaceholder: '+49 123 456 7890'
	},
	account: {
		sectionTitle: 'Account',
		memberSinceLabel: 'Member since',
		editButtonText: 'Edit profile',
		saveButtonText: 'Save changes'
	},
	admin: {
		sectionTitle: 'Manage users',
		sectionDescription: 'Add new users to the platform. Only visible to admins.',
		addUsersButtonText: 'Add user',
		editUserButtonText: 'Edit',
		deleteUserButtonText: 'Delete',
		emptyUsersText: 'No users added yet. Use "Add user" to invite someone.'
	}
} as const;

export const addUserModal = {
	title: 'Add user',
	editUserTitle: 'Edit user',
	nameLabel: 'Full name',
	namePlaceholder: 'Enter full name',
	emailLabel: 'Email',
	emailPlaceholder: 'user@example.com',
	roleLabel: 'Role',
	selectRolePlaceholder: 'Select role',
	cancelButtonText: 'Cancel',
	addButtonText: 'Add user',
	saveButtonText: 'Save',
	roleAdmin: 'Admin',
	roleUser: 'User'
} as const;

export const profilePlaceholder = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	phone: '+49 123 456 7890',
	memberSince: 'January 2026',
	role: 'admin' as UserRole
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
}

export const categories = ['All', 'Work', 'Business', 'Personal'] as const;

export const statuses = ['All', 'Active', 'Pending', 'Completed'] as const;

export const initialEvents: Event[] = [
	{ id: 1, title: 'Team Meeting', date: '2026-01-25', category: 'Work', status: 'Active' },
	{ id: 2, title: 'Project Review', date: '2026-01-26', category: 'Work', status: 'Pending' },
	{ id: 3, title: 'Client Call', date: '2026-01-27', category: 'Business', status: 'Active' },
	{ id: 4, title: 'Design Sprint', date: '2026-02-01', category: 'Work', status: 'Completed' },
	{ id: 5, title: 'Birthday Party', date: '2026-02-03', category: 'Personal', status: 'Active' },
	{ id: 6, title: 'Sales Meeting', date: '2026-02-04', category: 'Business', status: 'Pending' },
	{
		id: 7,
		title: 'Doctor Appointment',
		date: '2026-02-08',
		category: 'Personal',
		status: 'Completed'
	},
	{ id: 8, title: 'Team Building', date: '2026-02-10', category: 'Work', status: 'Pending' },
	{
		id: 9,
		title: 'Quarterly Planning',
		date: '2026-02-14',
		category: 'Business',
		status: 'Active'
	},
	{
		id: 10,
		title: 'Performance Review',
		date: '2026-02-17',
		category: 'Work',
		status: 'Completed'
	},
	{ id: 11, title: 'Family Dinner', date: '2026-02-19', category: 'Personal', status: 'Pending' },
	{ id: 12, title: 'Strategy Call', date: '2026-02-20', category: 'Business', status: 'Active' },
	{
		id: 13,
		title: 'Networking Event',
		date: '2026-02-23',
		category: 'Business',
		status: 'Pending'
	},
	{ id: 14, title: 'Yoga Class', date: '2026-02-25', category: 'Personal', status: 'Active' },
	{
		id: 15,
		title: 'Product Launch',
		date: '2026-03-01',
		category: 'Business',
		status: 'Completed'
	},
	{ id: 16, title: 'All Hands', date: '2026-03-03', category: 'Work', status: 'Active' },
	{ id: 17, title: 'Lunch with CEO', date: '2026-03-07', category: 'Business', status: 'Pending' },
	{
		id: 18,
		title: 'Parent-Teacher Meeting',
		date: '2026-03-10',
		category: 'Personal',
		status: 'Completed'
	},
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
	{ label: 'Actions', key: 'actions' }
];
