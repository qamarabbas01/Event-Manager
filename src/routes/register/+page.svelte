<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { login } from '$lib/stores/auth';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state<string | null>(null);

	function normalizeEmail(value: string): string {
		return value.trim().toLowerCase();
	}

	function register() {
		error = null;

		const cleanName = name.trim();
		const cleanEmail = normalizeEmail(email);
		const cleanPassword = password.trim();

		if (!cleanName) {
			error = 'Name is required.';
			return;
		}

		if (!cleanEmail) {
			error = 'Email is required.';
			return;
		}

		if (cleanPassword.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}

		// Demo auth: persist the user locally and send them into the app.
		login({ name: cleanName, email: cleanEmail });
		goto(resolve('/dashboard'));
	}
</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-16">
	<div class="max-w-md mx-auto">
		<div class="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-6">
			<div class="mb-6">
				<h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
				<p class="text-sm text-gray-600 mt-1">Start managing events in minutes.</p>
			</div>

			{#if error}
				<p class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
					{error}
				</p>
			{/if}

			<div class="space-y-4">
				<label class="block">
					<span class="block text-sm font-medium text-gray-700 mb-1">Full name</span>
					<Input bind:value={name} placeholder="Your name" class="rounded-lg" />
				</label>

				<label class="block">
					<span class="block text-sm font-medium text-gray-700 mb-1">Email</span>
					<Input bind:value={email} type="email" placeholder="you@example.com" class="rounded-lg" />
				</label>

				<label class="block">
					<span class="block text-sm font-medium text-gray-700 mb-1">Password</span>
					<Input bind:value={password} type="password" placeholder="••••••••" class="rounded-lg" />
					<span class="block text-xs text-gray-500 mt-1">Use at least 6 characters.</span>
				</label>

				<Button
					text="Create account"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					class="w-full"
					onClick={register}
				/>
			</div>

			<p class="mt-6 text-sm text-gray-600">
				Already have an account?
				<a href={resolve('/login')} class="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
			</p>
		</div>
	</div>
</div>

