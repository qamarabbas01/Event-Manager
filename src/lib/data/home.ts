import { appTitle } from './app';

export const homePage = {
	header: {
		brandTitle: appTitle,
		nav: [
			{ label: 'Features', href: '#features' },
			{ label: 'About', href: '#about' },
			{ label: 'Events', href: '/events' },
			{ label: 'Insights', href: '#insights' }
		],
		signInLink: 'Sign In',
		getStartedButton: 'Get Started'
	},
	hero: {
		welcomePrefix: 'Welcome to',
		highlightTitle: appTitle,
		subtitle:
			'The all-in-one platform for managing events, tracking attendees, and growing your business with powerful analytics.',
		primaryCta: 'Go to Dashboard',
		secondaryCta: 'Browse Events'
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
		description: `${appTitle} helps you manage your own event data (add, edit, delete), monitor performance, and keep everything in one place. After you register, you’ll go straight to the dashboard to start managing your events.`
	},
	insights: {
		title: 'Ready to transform your events?',
		subtitle: `Join thousands of event organizers who trust ${appTitle}.`,
		cta: 'Get Started Now'
	}
} as const;
