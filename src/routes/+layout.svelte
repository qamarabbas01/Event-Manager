<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SideBar from '$lib/components/SideBar.svelte';
	import { auth } from '$lib/stores/auth';
	import ToastViewport from '$lib/components/ui/ToastViewport.svelte';
	import '$lib/stores/theme';
	import './app.css';

	let { children } = $props();

	const appRoutePrefixes = [
		'/dashboard',
		'/attendee-insights',
		'/notifications',
		'/profile'
	] as const;
	const authRoutes = ['/login', '/register'] as const;

	const pathname = $derived(page.url.pathname);

	const isAppRoute = $derived(
		appRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
	);

	const isAuthRoute = $derived(authRoutes.some((route) => pathname === route));
	const isLandingRoute = $derived(pathname === '/');

	$effect(() => {
		if (typeof window === 'undefined') return;

		if (isAppRoute && !$auth.user) {
			goto(resolve('/login'));
			return;
		}

		if ((isAuthRoute || isLandingRoute) && $auth.user) {
			goto(resolve('/dashboard/overview'));
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isAppRoute && $auth.user}
	<div
		class="flex min-h-screen bg-white dark:bg-[#1D232A] text-gray-900 dark:text-gray-100 transition-colors"
	>
		<SideBar />
		<main class="flex-1 min-w-0 md:ml-64">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}

<ToastViewport />
