import { authBrand, authFooter } from './auth';

export const loginPage = {
	brand: authBrand,
	header: {
		title: 'Welcome back',
		subtitle: 'Sign in to access your dashboard.'
	},
	form: {
		emailLabel: 'Email',
		emailPlaceholder: 'you@example.com',
		passwordLabel: 'Password',
		passwordPlaceholder: '••••••••',
		showPasswordLabel: 'Show password',
		createAccountLink: 'Create an account',
		submitIdleText: 'Sign in',
		submitBusyText: 'Signing in…'
	},
	footer: authFooter,
	validation: {
		emailRequired: 'Email is required.',
		emailInvalid: 'Enter a valid email address.',
		passwordRequired: 'Password is required.'
	},
	demoUser: {
		defaultName: 'User'
	}
} as const;
