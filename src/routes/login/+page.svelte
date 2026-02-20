<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import LightIcon from '$lib/components/ui/icons/Light.svelte';
	import MoonIcon from '$lib/components/ui/icons/MoonIcon.svelte';
	import { themeToggleAriaLabel } from '$lib/data/dashboard';
	import { theme } from '$lib/stores/theme';
	import { login } from '$lib/stores/auth';

	function toggleTheme() {
		theme.set($theme === 'dark' ? 'light' : 'dark');
	}

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	function normalizeEmail(value: string): string {
		return value.trim().toLowerCase();
	}

	function validateCredentials(cleanEmail: string, cleanPassword: string): string | null {
		if (!cleanEmail) return 'Email is required.';
		if (!cleanEmail.includes('@')) return 'Enter a valid email address.';
		if (!cleanPassword) return 'Password is required.';
		return null;
	}

	function buildDemoUser(cleanEmail: string) {
		const inferredName = cleanEmail.split('@')[0] || 'User';
		return { name: inferredName, email: cleanEmail };
	}

	function submit() {
		error = null;
		isSubmitting = true;

		const cleanEmail = normalizeEmail(email);
		const cleanPassword = password.trim();
		const validationError = validateCredentials(cleanEmail, cleanPassword);
		if (validationError) {
			error = validationError;
			isSubmitting = false;
			return;
		}

		login(buildDemoUser(cleanEmail));
		goto(resolve('/dashboard/overview'));
	}
</script>

<div
	class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-[#0f1419] dark:via-[#1D232A] dark:to-[#0f1419] px-4 py-16 flex items-center justify-center transition-colors"
>
	<section class="w-full max-w-md relative">
		<button
			type="button"
			onclick={toggleTheme}
			class="absolute -top-2 right-0 p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
			aria-label={themeToggleAriaLabel}
			title={$theme === 'dark' ? 'Light' : 'Dark'}
		>
			{#if $theme === 'dark'}
				<LightIcon size={22} />
			{:else}
				<MoonIcon size={22} />
			{/if}
		</button>
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
					EH
				</span>
				<span class="tracking-tight">EventHub</span>
			</a>

			<div class="mt-6 mb-6">
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Sign in to access your dashboard.</p>
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
				<label class="block" for="login-email">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</span>
					<Input
						id="login-email"
						name="email"
						bind:value={email}
						type="email"
						autocomplete="email"
						inputmode="email"
						placeholder="you@example.com"
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<label class="block" for="login-password">
					<span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</span>
					<Input
						id="login-password"
						name="password"
						bind:value={password}
						type={showPassword ? 'text' : 'password'}
						autocomplete="current-password"
						placeholder="••••••••"
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<div class="flex items-center justify-between gap-3">
					<label class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none">
						<input
							type="checkbox"
							bind:checked={showPassword}
							class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
						/>
						Show password
					</label>
					<a
						href={resolve('/register')}
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
					>
						Create an account
					</a>
				</div>

				<Button
					text={isSubmitting ? 'Signing in…' : 'Sign in'}
					type="submit"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					class="w-full"
					disabled={isSubmitting}
				/>
			</form>

			<p class="mt-6 text-xs text-gray-500 dark:text-gray-400">
				By continuing, you’re using a demo session stored locally in your browser.
			</p>

			<div class="mt-6 flex items-center justify-between text-sm">
				<a
					href={resolve('/')}
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
					>Back to home</a
				>
				<a
					href={resolve('/events')}
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
					>Browse events</a
				>
			</div>
		</div>
	</section>
</div>
