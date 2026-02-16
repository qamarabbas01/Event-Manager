<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { login } from '$lib/stores/auth';

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
		goto(resolve('/dashboard'));
	}
</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-14">
	<div class="max-w-5xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
			<section class="hidden lg:block">
				<div class="max-w-lg">
					<a href={resolve('/')} class="inline-flex items-center gap-2 font-semibold text-gray-900">
						<span
							class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-sm"
							aria-hidden="true"
						>
							EH
						</span>
						<span class="tracking-tight">EventHub</span>
					</a>
					<h1 class="mt-6 text-4xl font-extrabold tracking-tight text-gray-900">
						Sign in and get back to your events
					</h1>
					<p class="mt-4 text-lg text-gray-600">
						Manage events, review bookings, and track revenue — all from one dashboard.
					</p>

					<div class="mt-8 grid grid-cols-1 gap-4">
						<div class="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5 shadow-sm">
							<p class="text-sm font-semibold text-gray-900">Fast demo login</p>
							<p class="mt-1 text-sm text-gray-600">
								This project uses a local demo session for now — no server required.
							</p>
						</div>
						<div class="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5 shadow-sm">
							<p class="text-sm font-semibold text-gray-900">Clean UI + dark mode</p>
							<p class="mt-1 text-sm text-gray-600">
								Your dashboard layout and theme toggle work across the app routes.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section class="w-full">
				<div class="max-w-md mx-auto">
					<div
						class="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8"
					>
						<div class="mb-6">
							<h2 class="text-2xl font-bold text-gray-900">Welcome back</h2>
							<p class="text-sm text-gray-600 mt-1">Sign in to access your dashboard.</p>
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
							<label class="block" for="login-email">
								<span class="block text-sm font-medium text-gray-700 mb-1">Email</span>
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
								<span class="block text-sm font-medium text-gray-700 mb-1">Password</span>
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
								<label class="inline-flex items-center gap-2 text-sm text-gray-600 select-none">
									<input
										type="checkbox"
										bind:checked={showPassword}
										class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									Show password
								</label>
								<a href={resolve('/register')} class="text-sm text-blue-600 hover:text-blue-700">
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

						<p class="mt-6 text-xs text-gray-500">
							By continuing, you’re using a demo session stored locally in your browser.
						</p>

						<div class="mt-6 flex items-center justify-between text-sm">
							<a href={resolve('/')} class="text-gray-600 hover:text-gray-900">Back to home</a>
							<a href={resolve('/events')} class="text-gray-600 hover:text-gray-900"
								>Browse events</a
							>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
