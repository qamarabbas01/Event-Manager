import { appMark, appTitle } from './app';

export const authBrand = {
	mark: appMark,
	title: appTitle
} as const;

export const authFooter = {
	demoNotice: 'By continuing, you’re using a demo session stored locally in your browser.',
	backHomeLink: 'Back to home',
	browseEventsLink: 'Browse events'
} as const;
