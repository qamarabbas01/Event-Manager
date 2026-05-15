import { authBrand, authFooter } from './auth';

export const registerPage = {
	brand: authBrand,
	header: {
		title: 'Create your account',
		subtitle: 'Start managing events in minutes.'
	},
	form: {
		nameLabel: 'Full name',
		namePlaceholder: 'Your name',
		emailLabel: 'Email',
		emailPlaceholder: 'you@example.com',
		passwordLabel: 'Password',
		passwordPlaceholder: '••••••••',
		passwordHint: 'Use at least 6 characters.',
		confirmPasswordLabel: 'Confirm password',
		confirmPasswordPlaceholder: '••••••••',
		showPasswordsLabel: 'Show passwords',
		alreadyHaveAccountLink: 'Already have an account?',
		submitIdleText: 'Create account',
		submitBusyText: 'Creating…'
	},
	footer: authFooter,
	validation: {
		nameRequired: 'Name is required.',
		emailRequired: 'Email is required.',
		emailInvalid: 'Enter a valid email address.',
		passwordTooShort: 'Password must be at least 6 characters.',
		passwordMismatch: 'Passwords do not match.'
	}
} as const;
