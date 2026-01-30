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

const rawBrowseEvents: BrowseEventDetail[] = [
	{
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
		availabilityPercent: 90,
		imageKey: 'tech',
		ticketSalesTrend: [
			{ label: 'Mon', value: 20 },
			{ label: 'Tue', value: 35 },
			{ label: 'Wed', value: 55 },
			{ label: 'Thu', value: 85 },
			{ label: 'Fri', value: 120 },
			{ label: 'Sat', value: 40 },
			{ label: 'Sun', value: 25 }
		]
	},
	{
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
		availabilityPercent: 93,
		imageKey: 'music',
		ticketSalesTrend: [
			{ label: 'Mon', value: 100 },
			{ label: 'Tue', value: 150 },
			{ label: 'Wed', value: 200 },
			{ label: 'Thu', value: 280 },
			{ label: 'Fri', value: 350 },
			{ label: 'Sat', value: 120 },
			{ label: 'Sun', value: 80 }
		]
	},
	{
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
		availabilityPercent: 80,
		imageKey: 'startup',
		ticketSalesTrend: [
			{ label: 'Mon', value: 15 },
			{ label: 'Tue', value: 22 },
			{ label: 'Wed', value: 30 },
			{ label: 'Thu', value: 45 },
			{ label: 'Fri', value: 55 },
			{ label: 'Sat', value: 18 },
			{ label: 'Sun', value: 10 }
		]
	},
	{
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
		availabilityPercent: 85,
		imageKey: 'food',
		ticketSalesTrend: [
			{ label: 'Mon', value: 40 },
			{ label: 'Tue', value: 65 },
			{ label: 'Wed', value: 90 },
			{ label: 'Thu', value: 110 },
			{ label: 'Fri', value: 130 },
			{ label: 'Sat', value: 95 },
			{ label: 'Sun', value: 60 }
		]
	},
	{
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
		availabilityPercent: 80,
		imageKey: 'startup',
		ticketSalesTrend: [
			{ label: 'Mon', value: 18 },
			{ label: 'Tue', value: 28 },
			{ label: 'Wed', value: 42 },
			{ label: 'Thu', value: 58 },
			{ label: 'Fri', value: 75 },
			{ label: 'Sat', value: 22 },
			{ label: 'Sun', value: 12 }
		]
	},
	{
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
		availabilityPercent: 88,
		imageKey: 'art',
		ticketSalesTrend: [
			{ label: 'Mon', value: 25 },
			{ label: 'Tue', value: 40 },
			{ label: 'Wed', value: 60 },
			{ label: 'Thu', value: 85 },
			{ label: 'Fri', value: 105 },
			{ label: 'Sat', value: 70 },
			{ label: 'Sun', value: 45 }
		]
	},
	{
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
		availabilityPercent: 80,
		imageKey: 'food',
		ticketSalesTrend: [
			{ label: 'Mon', value: 35 },
			{ label: 'Tue', value: 50 },
			{ label: 'Wed', value: 85 },
			{ label: 'Thu', value: 140 },
			{ label: 'Fri', value: 250 },
			{ label: 'Sat', value: 320 },
			{ label: 'Sun', value: 320 }
		]
	},
	{
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
		availabilityPercent: 83,
		imageKey: 'party',
		ticketSalesTrend: [
			{ label: 'Mon', value: 20 },
			{ label: 'Tue', value: 25 },
			{ label: 'Wed', value: 50 },
			{ label: 'Thu', value: 100 },
			{ label: 'Fri', value: 175 },
			{ label: 'Sat', value: 100 },
			{ label: 'Sun', value: 30 }
		]
	}
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
