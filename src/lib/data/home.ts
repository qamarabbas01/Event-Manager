import { appMark, appTitle } from './app';

export type HomeNavItem = { label: string; hash: string } | { label: string; path: '/events' };

export const homePage = {
	header: {
		brandTitle: appTitle,
		brandMark: appMark,
		nav: [
			{ label: 'Features', hash: '#features' },
			{ label: 'About', hash: '#about' },
			{ label: 'Events', path: '/events' },
			{ label: 'Insights', hash: '#insights' }
		] satisfies HomeNavItem[],
		signInLink: 'Sign In',
		getStartedButton: 'Get Started',
		menuAriaLabel: 'Open menu'
	},
	hero: {
		badge: 'All-in-one event platform',
		welcomePrefix: 'Plan events that',
		highlightTitle: 'people remember',
		subtitle:
			'Create events, track attendees, monitor revenue, and get smart alerts — everything organizers need in one beautiful dashboard.',
		primaryCta: 'Go to Dashboard',
		secondaryCta: 'Browse Events',
		trustLine: 'Trusted by organizers worldwide'
	},
	stats: [
		{ value: '10K+', label: 'Events Managed' },
		{ value: '500K+', label: 'Happy Attendees' },
		{ value: '$5M+', label: 'Revenue Processed' },
		{ value: '99.9%', label: 'Uptime' }
	],
	features: {
		title: 'Everything you need to succeed',
		subtitle:
			'Powerful features designed to help you create memorable events and grow your business.',
		cards: [
			{
				icon: '📅',
				title: 'Event Management',
				description:
					'Create, organize, and manage all your events in one centralized platform with ease.'
			},
			{
				icon: '👥',
				title: 'Attendee Insights',
				description: 'Gain deep insights into your audience demographics and engagement patterns.'
			},
			{
				icon: '📊',
				title: 'Analytics Dashboard',
				description:
					'Track performance metrics, revenue, and booking trends with real-time analytics.'
			},
			{
				icon: '🔔',
				title: 'Smart Notifications',
				description:
					'Stay informed with intelligent alerts about registrations, capacity, and more.'
			},
			{
				icon: '📈',
				title: 'Revenue Tracking',
				description:
					'Monitor ticket sales and revenue streams with comprehensive financial reports.'
			},
			{
				icon: '✨',
				title: 'Seamless Experience',
				description: 'Intuitive interface designed for event organizers to work efficiently.'
			}
		]
	},
	about: {
		title: 'Built for real organizers',
		description: `${appTitle} helps you manage your own event data (add, edit, delete), monitor performance, and keep everything in one place.`,
		highlights: [
			'Add, edit, and delete events from one dashboard',
			'Real-time metrics for bookings and revenue',
			'Attendee insights and notification center',
			'Dark mode and mobile-friendly layout'
		],
		cta: 'Create your free account'
	},
	insights: {
		title: 'Ready to transform your events?',
		subtitle: `Join thousands of event organizers who trust ${appTitle}.`,
		cta: 'Get Started Now'
	},
	footer: {
		tagline: `${appTitle} — modern event management for teams of every size.`,
		copyright: `© ${new Date().getFullYear()} ${appTitle}. All rights reserved.`
	}
} as const;
