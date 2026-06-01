import { eventImageMap, type EventImageKey } from '$lib/data/eventImages';

export interface TicketSalesTrendPoint {
	label: string;
	value: number;
}

export interface BrowseEventDetail {
	id: string;
	title: string;
	category: string;
	date: string;
	location: string;
	venue: string;
	description: string;
	attendees: number;
	capacity: number;
	revenue: string;
	availabilityPercent: number;
	ticketSalesTrend: TicketSalesTrendPoint[];
	imageKey: EventImageKey;
}

export interface BrowseEvent extends Omit<BrowseEventDetail, 'imageKey'> {
	image: string;
}

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function buildTicketSalesTrend(values: readonly number[]): TicketSalesTrendPoint[] {
	return weekLabels.map((label, i) => ({ label, value: values[i] ?? 0 }));
}

function calcAvailabilityPercent(attendees: number, capacity: number): number {
	return capacity > 0 ? Math.round((attendees / capacity) * 100) : 0;
}

type RawBrowseEventInput = Omit<BrowseEventDetail, 'availabilityPercent' | 'ticketSalesTrend'> & {
	ticketSalesTrendValues: readonly number[];
};

function buildBrowseEventDetail(input: RawBrowseEventInput): BrowseEventDetail {
	const { ticketSalesTrendValues, ...rest } = input;
	return {
		...rest,
		availabilityPercent: calcAvailabilityPercent(rest.attendees, rest.capacity),
		ticketSalesTrend: buildTicketSalesTrend(ticketSalesTrendValues)
	};
}

const rawBrowseEvents: BrowseEventDetail[] = [
	buildBrowseEventDetail({
		id: '1',
		title: 'Tech Conference 2024',
		category: 'Technology',
		date: '2024-03-15',
		location: 'San Francisco, CA',
		venue: 'Moscone Center, San Francisco, CA',
		description:
			'Join us for the biggest tech conference of the year featuring industry leaders and innovative startups.',
		attendees: 450,
		capacity: 500,
		revenue: '$45,000',
		imageKey: 'tech',
		ticketSalesTrendValues: [20, 35, 55, 85, 120, 40, 25]
	}),
	buildBrowseEventDetail({
		id: '2',
		title: 'Summer Music Festival',
		category: 'Music',
		date: '2024-06-20',
		location: 'Austin, TX',
		venue: 'Zilker Park, Austin, TX',
		description:
			'Three days of live music, food trucks, and good vibes. Featuring top artists across multiple stages.',
		attendees: 2800,
		capacity: 3000,
		revenue: '$280,000',
		imageKey: 'music',
		ticketSalesTrendValues: [100, 150, 200, 280, 350, 120, 80]
	}),
	buildBrowseEventDetail({
		id: '3',
		title: 'Marketing Workshop',
		category: 'Business',
		date: '2024-02-10',
		location: 'New York, NY',
		venue: 'Convention Center, New York, NY',
		description:
			'Hands-on marketing strategies and growth tactics from leading experts. Network with peers and boost your skills.',
		attendees: 120,
		capacity: 150,
		revenue: '$12,000',
		imageKey: 'startup',
		ticketSalesTrendValues: [15, 22, 30, 45, 55, 18, 10]
	}),
	buildBrowseEventDetail({
		id: '4',
		title: 'Food & Wine Expo',
		category: 'Food',
		date: '2024-04-05',
		location: 'Chicago, IL',
		venue: 'Navy Pier, Chicago, IL',
		description:
			'Discover the finest culinary offerings and wines from around the world. Tastings, demos, and chef meet-and-greets.',
		attendees: 680,
		capacity: 800,
		revenue: '$68,000',
		imageKey: 'food',
		ticketSalesTrendValues: [40, 65, 90, 110, 130, 95, 60]
	}),
	buildBrowseEventDetail({
		id: '5',
		title: 'Startup Pitch Night',
		category: 'Business',
		date: '2024-03-28',
		location: 'Seattle, WA',
		venue: 'WeWork Downtown, Seattle, WA',
		description:
			'Watch early-stage startups pitch to investors. Connect with founders and venture capitalists in a casual setting.',
		attendees: 200,
		capacity: 250,
		revenue: '$20,000',
		imageKey: 'startup',
		ticketSalesTrendValues: [18, 28, 42, 58, 75, 22, 12]
	}),
	buildBrowseEventDetail({
		id: '6',
		title: 'Art Gallery Opening',
		category: 'Art',
		date: '2024-05-12',
		location: 'Los Angeles, CA',
		venue: 'Downtown Gallery District, Los Angeles, CA',
		description:
			'An evening of contemporary art, live performances, and refreshments. Meet the artists behind the works.',
		attendees: 350,
		capacity: 400,
		revenue: '$35,000',
		imageKey: 'art',
		ticketSalesTrendValues: [25, 40, 60, 85, 105, 70, 45]
	}),
	buildBrowseEventDetail({
		id: '7',
		title: 'Green Living Expo',
		category: 'Food',
		date: '2024-07-15',
		location: 'Portland, OR',
		venue: 'Oregon Convention Center, Portland, OR',
		description:
			'Explore sustainable living solutions, eco-products, and green initiatives at this vibrant community expo.',
		attendees: 1200,
		capacity: 1500,
		revenue: '$60,000',
		imageKey: 'food',
		ticketSalesTrendValues: [35, 50, 85, 140, 250, 320, 320]
	}),
	buildBrowseEventDetail({
		id: '8',
		title: 'City Rooftop Party',
		category: 'Party',
		date: '2024-08-23',
		location: 'New York, NY',
		venue: 'Manhattan Rooftop, New York, NY',
		description:
			'Celebrate summer with music, cocktails, and stunning city views at our exclusive rooftop party.',
		attendees: 500,
		capacity: 600,
		revenue: '$45,000',
		imageKey: 'party',
		ticketSalesTrendValues: [20, 25, 50, 100, 175, 100, 30]
	}),

	buildBrowseEventDetail({
		id: '9',
		title: 'AI Summit 2026',
		category: 'Technology',
		date: '2026-03-18',
		location: 'Boston, MA',
		venue: 'Seaport World Trade Center, Boston, MA',
		description:
			'A practical AI summit focused on real-world deployments, model governance, and hands-on workshops.',
		attendees: 980,
		capacity: 1200,
		revenue: '$196,000',
		imageKey: 'tech',
		ticketSalesTrendValues: [55, 70, 92, 110, 160, 95, 60]
	}),
	buildBrowseEventDetail({
		id: '10',
		title: 'Indie Music Showcase',
		category: 'Music',
		date: '2026-04-11',
		location: 'Nashville, TN',
		venue: 'Eastside Theater, Nashville, TN',
		description:
			'An evening spotlighting independent artists, acoustic sets, and emerging local bands.',
		attendees: 620,
		capacity: 750,
		revenue: '$31,000',
		imageKey: 'music',
		ticketSalesTrendValues: [35, 44, 58, 70, 95, 62, 40]
	}),
	buildBrowseEventDetail({
		id: '11',
		title: 'Founder Fundraising Bootcamp',
		category: 'Business',
		date: '2026-02-27',
		location: 'Miami, FL',
		venue: 'Brickell Hub, Miami, FL',
		description:
			'Learn how to craft a pitch, build investor pipelines, and negotiate term sheets with confidence.',
		attendees: 180,
		capacity: 220,
		revenue: '$18,000',
		imageKey: 'startup',
		ticketSalesTrendValues: [12, 18, 24, 35, 45, 20, 11]
	}),
	buildBrowseEventDetail({
		id: '12',
		title: 'Street Food Night Market',
		category: 'Food',
		date: '2026-05-09',
		location: 'San Diego, CA',
		venue: 'Waterfront Park, San Diego, CA',
		description:
			'Sample global street food, meet local vendors, and enjoy live cooking demos under the lights.',
		attendees: 2100,
		capacity: 2600,
		revenue: '$84,000',
		imageKey: 'food',
		ticketSalesTrendValues: [90, 120, 160, 220, 310, 260, 150]
	}),
	buildBrowseEventDetail({
		id: '13',
		title: 'Modern Art & Design Fair',
		category: 'Art',
		date: '2026-06-21',
		location: 'Denver, CO',
		venue: 'River North Art District, Denver, CO',
		description:
			'A weekend fair featuring contemporary art, design studios, and live talks with creators.',
		attendees: 1300,
		capacity: 1600,
		revenue: '$78,000',
		imageKey: 'art',
		ticketSalesTrendValues: [55, 80, 110, 150, 190, 160, 95]
	}),
	buildBrowseEventDetail({
		id: '14',
		title: 'New Year Kickoff Party',
		category: 'Party',
		date: '2026-01-10',
		location: 'Las Vegas, NV',
		venue: 'The Neon Ballroom, Las Vegas, NV',
		description:
			'Kick off the year with DJs, themed photo ops, and a midnight countdown replay for the night owls.',
		attendees: 850,
		capacity: 1000,
		revenue: '$102,000',
		imageKey: 'party',
		ticketSalesTrendValues: [40, 55, 80, 120, 220, 260, 75]
	}),
	buildBrowseEventDetail({
		id: '15',
		title: 'Product Strategy Roundtable',
		category: 'Business',
		date: '2026-03-06',
		location: 'Toronto, ON',
		venue: 'Harbourfront Conference Hall, Toronto, ON',
		description:
			'A small-group roundtable for product leaders: discovery, prioritization, and measurable outcomes.',
		attendees: 90,
		capacity: 120,
		revenue: '$9,000',
		imageKey: 'startup',
		ticketSalesTrendValues: [8, 10, 14, 20, 28, 12, 6]
	}),
	buildBrowseEventDetail({
		id: '16',
		title: 'Cloud Security Workshop',
		category: 'Technology',
		date: '2026-04-29',
		location: 'Seattle, WA',
		venue: 'Lake Union Tech Center, Seattle, WA',
		description:
			'Hands-on security workshop covering threat modeling, IAM hygiene, and incident response playbooks.',
		attendees: 240,
		capacity: 300,
		revenue: '$24,000',
		imageKey: 'tech',
		ticketSalesTrendValues: [18, 22, 30, 44, 58, 26, 14]
	}),
	buildBrowseEventDetail({
		id: '17',
		title: 'Rooftop Jazz & Cocktails',
		category: 'Music',
		date: '2026-07-18',
		location: 'Chicago, IL',
		venue: 'West Loop Rooftop, Chicago, IL',
		description:
			'Live jazz sets paired with curated cocktails and skyline views — an easy, elegant summer night.',
		attendees: 420,
		capacity: 520,
		revenue: '$42,000',
		imageKey: 'music',
		ticketSalesTrendValues: [22, 28, 36, 55, 90, 62, 34]
	}),
	buildBrowseEventDetail({
		id: '18',
		title: 'Chef’s Table: Seasonal Tasting',
		category: 'Food',
		date: '2026-02-15',
		location: 'New York, NY',
		venue: 'SoHo Culinary Studio, New York, NY',
		description:
			'An intimate seasonal tasting menu with a behind-the-scenes talk from the chef and team.',
		attendees: 70,
		capacity: 80,
		revenue: '$14,000',
		imageKey: 'food',
		ticketSalesTrendValues: [6, 8, 10, 14, 20, 9, 3]
	}),
	buildBrowseEventDetail({
		id: '19',
		title: 'Contemporary Illustration Workshop',
		category: 'Art',
		date: '2026-05-30',
		location: 'San Francisco, CA',
		venue: 'Mission Studio Loft, San Francisco, CA',
		description:
			'A skill-building workshop focused on composition, color, and digital illustration workflows.',
		attendees: 140,
		capacity: 180,
		revenue: '$21,000',
		imageKey: 'art',
		ticketSalesTrendValues: [10, 14, 18, 26, 34, 16, 8]
	}),
	buildBrowseEventDetail({
		id: '20',
		title: 'After Hours Startup Social',
		category: 'Party',
		date: '2026-06-06',
		location: 'Austin, TX',
		venue: 'Congress Ave Lounge, Austin, TX',
		description:
			'Meet founders and builders in a low-pressure social with short intros, music, and casual networking.',
		attendees: 560,
		capacity: 700,
		revenue: '$28,000',
		imageKey: 'party',
		ticketSalesTrendValues: [24, 30, 45, 68, 110, 90, 35]
	})
];

export const browseEvents: BrowseEvent[] = rawBrowseEvents.map((e) => ({
	...e,
	image: eventImageMap[e.imageKey]
}));

export function getEventById(id: string): BrowseEvent | undefined {
	const detail = rawBrowseEvents.find((e) => e.id === id);
	if (!detail) return undefined;
	return {
		...detail,
		image: eventImageMap[detail.imageKey]
	};
}

export type EventTimeStatus = 'upcoming' | 'past' | 'today';

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function getEventTimeStatus(dateStr: string, reference = new Date()): EventTimeStatus {
	const eventDay = startOfDay(new Date(`${dateStr}T12:00:00`));
	const today = startOfDay(reference);
	if (eventDay.getTime() === today.getTime()) return 'today';
	if (eventDay < today) return 'past';
	return 'upcoming';
}

export function isAlmostFull(attendees: number, capacity: number): boolean {
	return capacity > 0 && attendees / capacity >= 0.9;
}

export function formatBrowseDate(dateStr: string): string {
	return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatBrowseDateShort(dateStr: string): string {
	return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function spotsRemaining(attendees: number, capacity: number): number {
	return Math.max(0, capacity - attendees);
}

export function getRelatedEvents(eventId: string, limit = 3): BrowseEvent[] {
	const current = getEventById(eventId);
	if (!current) return [];
	return browseEvents
		.filter((e) => e.id !== eventId && e.category === current.category)
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(0, limit);
}

export function countUpcomingEvents(reference = new Date()): number {
	return browseEvents.filter((e) => getEventTimeStatus(e.date, reference) !== 'past').length;
}
