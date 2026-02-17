import { authBrand } from './auth';

export const logoutPage = {
	brand: authBrand,
	status: {
		signingOutTitle: 'Signing you out',
		signedOutTitle: 'You’re signed out',
		signingOutMessage: 'Please wait a moment.',
		signedOutMessage: 'You can safely close this tab or sign in again.'
	},
	actions: {
		signingOutCta: 'Signing out…',
		signedOutCta: 'Continue to sign in',
		backHome: 'Back to home'
	}
} as const;

