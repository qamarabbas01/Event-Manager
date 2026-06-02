<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { registerPage } from '$lib/data/register';
	import { themeToggleAriaLabel } from '$lib/data/dashboard';
	import { theme } from '$lib/stores/theme';
	import { login } from '$lib/stores/auth';
	import { userStore } from '$lib/stores/user';
	import { toastStore } from '$lib/stores/toast';

	function toggleTheme() {
		theme.set($theme === 'dark' ? 'light' : 'dark');
	}

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	const canSubmit = $derived(
		name.trim() !== '' &&
			email.trim() !== '' &&
			password.trim() !== '' &&
			confirmPassword.trim() !== '' &&
			password.trim().length >= 6
	);

	function normalizeEmail(value: string): string {
		return value.trim().toLowerCase();
	}

	function buildRegistrationInput() {
		const cleanName = name.trim();
		const cleanEmail = normalizeEmail(email);
		const cleanPassword = password.trim();
		const cleanConfirmPassword = confirmPassword.trim();

		return { cleanName, cleanEmail, cleanPassword, cleanConfirmPassword };
	}

	function validateRegistrationInput(input: ReturnType<typeof buildRegistrationInput>) {
		if (!input.cleanName) return registerPage.validation.nameRequired;
		if (!input.cleanEmail) return registerPage.validation.emailRequired;
		if (!input.cleanEmail.includes('@')) return registerPage.validation.emailInvalid;
		if (input.cleanPassword.length < 6) return registerPage.validation.passwordTooShort;
		if (input.cleanPassword !== input.cleanConfirmPassword)
			return registerPage.validation.passwordMismatch;
		return null;
	}

	function submit() {
		error = null;
		isSubmitting = true;

		const input = buildRegistrationInput();
		const validationError = validateRegistrationInput(input);
		if (validationError) {
			error = validationError;
			toastStore.error('Could not create account', validationError);
			isSubmitting = false;
			return;
		}

		const user = { name: input.cleanName, email: input.cleanEmail };
		login(user);
		userStore.syncFromAuth(user);
		toastStore.success('Account created', 'You are now signed in.');
		goto(resolve('/dashboard/overview'));
	}
</script>

<div
	class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-[#0f1419] dark:via-[#1D232A] dark:to-[#0f1419] px-4 py-16 flex items-center justify-center transition-colors relative"
>
	<button
		type="button"
		onclick={toggleTheme}
		class="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
		aria-label={themeToggleAriaLabel}
		title={$theme === 'dark' ? 'Light mode' : 'Dark mode'}
	>
		{#if $theme === 'dark'}
			<Sun size={22} />
		{:else}
			<Moon size={22} />
		{/if}
	</button>
	<section class="w-full max-w-md">
		<div
			class="bg-white/80 dark:bg-gray-800/90 backdrop-blur rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 transition-colors"
		>
			<a
				href={resolve('/')}
				class="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100"
			>
				<span
					class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-sm"
					aria-hidden="true"
				>
					{registerPage.brand.mark}
				</span>
				<span class="tracking-tight">{registerPage.brand.title}</span>
			</a>

			<div class="mt-6 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					{registerPage.header.title}
				</h1>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{registerPage.header.subtitle}</p>
			</div>

			{#if error}
				<p
					class="mb-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3"
					role="alert"
				>
					{error}
				</p>
			{/if}

			<form
				class="space-y-4"
				onsubmit={(e) => {
					e.preventDefault();
					if (isSubmitting) return;
					submit();
				}}
			>
				<label class="block" for="register-name">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>{registerPage.form.nameLabel}</span
					>
					<Input
						id="register-name"
						name="name"
						bind:value={name}
						autocomplete="name"
						placeholder={registerPage.form.namePlaceholder}
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<label class="block" for="register-email">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>{registerPage.form.emailLabel}</span
					>
					<Input
						id="register-email"
						name="email"
						bind:value={email}
						type="email"
						autocomplete="email"
						inputmode="email"
						placeholder={registerPage.form.emailPlaceholder}
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<label class="block" for="register-password">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>{registerPage.form.passwordLabel}</span
					>
					<Input
						id="register-password"
						name="password"
						bind:value={password}
						type={showPassword ? 'text' : 'password'}
						autocomplete="new-password"
						placeholder={registerPage.form.passwordPlaceholder}
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
					<span class="block text-xs text-gray-500 dark:text-gray-400 mt-1"
						>{registerPage.form.passwordHint}</span
					>
				</label>

				<label class="block" for="register-confirm-password">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						{registerPage.form.confirmPasswordLabel}
					</span>
					<Input
						id="register-confirm-password"
						name="confirmPassword"
						bind:value={confirmPassword}
						type={showPassword ? 'text' : 'password'}
						autocomplete="new-password"
						placeholder={registerPage.form.confirmPasswordPlaceholder}
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<div class="flex items-center justify-between gap-3">
					<label
						class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none"
					>
						<input
							type="checkbox"
							bind:checked={showPassword}
							class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
						/>
						{registerPage.form.showPasswordsLabel}
					</label>
					<a
						href={resolve('/login')}
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
					>
						{registerPage.form.alreadyHaveAccountLink}
					</a>
				</div>

				<Button
					text={isSubmitting ? registerPage.form.submitBusyText : registerPage.form.submitIdleText}
					type="submit"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					class="w-full"
					disabled={isSubmitting || !canSubmit}
				/>
			</form>

			<p class="mt-6 text-xs text-gray-500 dark:text-gray-400">
				{registerPage.footer.demoNotice}
			</p>

			<div class="mt-6 flex items-center justify-between text-sm">
				<a
					href={resolve('/')}
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
				>
					{registerPage.footer.backHomeLink}
				</a>
				<a
					href={resolve('/events')}
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
				>
					{registerPage.footer.browseEventsLink}
				</a>
			</div>
		</div>
	</section>
</div>
