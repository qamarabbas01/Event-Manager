<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import { logout } from '$lib/stores/auth';

	type Status = 'signing_out' | 'signed_out';
	let status = $state<Status>('signing_out');

	function performLogout() {
		logout();
		status = 'signed_out';
	}

	function goToLogin() {
		goto(resolve('/login'));
	}

	function goHome() {
		goto(resolve('/'));
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (status !== 'signing_out') return;
		performLogout();
	});
</script>

<div
	class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 px-4 py-16 flex items-center justify-center"
>
	<div class="w-full max-w-lg">
		<div class="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
			<div
				class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-sm"
				aria-hidden="true"
			>
				EH
			</div>

			<h1 class="mt-5 text-2xl font-bold text-gray-900">
				{status === 'signing_out' ? 'Signing you out' : 'You’re signed out'}
			</h1>
			<p class="mt-2 text-sm text-gray-600">
				{status === 'signing_out'
					? 'Please wait a moment.'
					: 'You can safely close this tab or sign in again.'}
			</p>

			<div class="mt-6 flex flex-col sm:flex-row gap-3">
				<Button
					text={status === 'signing_out' ? 'Signing out…' : 'Continue to sign in'}
					variant="primary-blue"
					rounded="lg"
					size="lg"
					class="w-full sm:w-auto"
					disabled={status === 'signing_out'}
					onClick={goToLogin}
				/>
				<Button
					text="Back to home"
					variant="default"
					rounded="lg"
					size="lg"
					class="w-full sm:w-auto bg-white/80"
					onClick={goHome}
				/>
			</div>
		</div>
	</div>
</div>
