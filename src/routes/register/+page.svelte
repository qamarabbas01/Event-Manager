<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { login } from '$lib/stores/auth';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	function normalizeEmail(value: string): string {
		return value.trim().toLowerCase();
	}

	function validateRegistration(cleanName: string, cleanEmail: string, cleanPassword: string) {
		if (!cleanName) return 'Name is required.';
		if (!cleanEmail) return 'Email is required.';
		if (!cleanEmail.includes('@')) return 'Enter a valid email address.';
		if (cleanPassword.length < 6) return 'Password must be at least 6 characters.';
		if (cleanPassword !== confirmPassword.trim()) return 'Passwords do not match.';
		return null;
	}

	function submit() {
		error = null;
		isSubmitting = true;

		const cleanName = name.trim();
		const cleanEmail = normalizeEmail(email);
		const cleanPassword = password.trim();

		const validationError = validateRegistration(cleanName, cleanEmail, cleanPassword);
		if (validationError) {
			error = validationError;
			isSubmitting = false;
			return;
		}

		// Demo auth: persist the user locally and send them into the app.
		login({ name: cleanName, email: cleanEmail });
		goto(resolve('/dashboard'));
	}
</script>

<div
	class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-16 flex items-center justify-center"
>
	<section class="w-full max-w-md">
		<div class="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
			<a href={resolve('/')} class="inline-flex items-center gap-2 font-semibold text-gray-900">
				<span
					class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-sm"
					aria-hidden="true"
				>
					EH
				</span>
				<span class="tracking-tight">EventHub</span>
			</a>

			<div class="mt-6 mb-6">
				<h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
				<p class="text-sm text-gray-600 mt-1">Start managing events in minutes.</p>
			</div>

			{#if error}
				<p
					class="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3"
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
					<span class="block text-sm font-medium text-gray-700 mb-1">Full name</span>
					<Input
						id="register-name"
						name="name"
						bind:value={name}
						autocomplete="name"
						placeholder="Your name"
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<label class="block" for="register-email">
					<span class="block text-sm font-medium text-gray-700 mb-1">Email</span>
					<Input
						id="register-email"
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

				<label class="block" for="register-password">
					<span class="block text-sm font-medium text-gray-700 mb-1">Password</span>
					<Input
						id="register-password"
						name="password"
						bind:value={password}
						type={showPassword ? 'text' : 'password'}
						autocomplete="new-password"
						placeholder="••••••••"
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
					<span class="block text-xs text-gray-500 mt-1">Use at least 6 characters.</span>
				</label>

				<label class="block" for="register-confirm-password">
					<span class="block text-sm font-medium text-gray-700 mb-1">Confirm password</span>
					<Input
						id="register-confirm-password"
						name="confirmPassword"
						bind:value={confirmPassword}
						type={showPassword ? 'text' : 'password'}
						autocomplete="new-password"
						placeholder="••••••••"
						class="rounded-xl"
						required
						ariaInvalid={Boolean(error)}
					/>
				</label>

				<div class="flex items-center justify-between gap-3">
					<label class="inline-flex items-center gap-2 text-sm text-gray-600 select-none">
						<input
							type="checkbox"
							bind:checked={showPassword}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Show passwords
					</label>
					<a href={resolve('/login')} class="text-sm text-blue-600 hover:text-blue-700">
						Already have an account?
					</a>
				</div>

				<Button
					text={isSubmitting ? 'Creating…' : 'Create account'}
					type="submit"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					class="w-full"
					disabled={isSubmitting}
				/>
			</form>

			<p class="mt-6 text-xs text-gray-500">
				By continuing, you’re using a demo session stored locally in your browser.
			</p>

			<div class="mt-6 flex items-center justify-between text-sm">
				<a href={resolve('/')} class="text-gray-600 hover:text-gray-900">Back to home</a>
				<a href={resolve('/events')} class="text-gray-600 hover:text-gray-900">Browse events</a>
			</div>
		</div>
	</section>
</div>
