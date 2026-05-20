<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import HomeBanner from '$lib/components/HomeBanner.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CloseIcon from '$lib/components/ui/icons/CloseIcon.svelte';
	import LightIcon from '$lib/components/ui/icons/Light.svelte';
	import Menu from '$lib/components/ui/icons/Menu.svelte';
	import MoonIcon from '$lib/components/ui/icons/MoonIcon.svelte';
	import MetricItem from '$lib/components/ui/MetricItem.svelte';
	import { navbarItemsData, themeToggleAriaLabel } from '$lib/data/dashboard';
	import { theme } from '$lib/stores/theme';

	let mobileNavOpen = false;

	function toggleTheme() {
		theme.set($theme === 'dark' ? 'light' : 'dark');
	}

	function goToRegister() {
		goto(resolve('/register'));
	}

	function goToLogin() {
		goto(resolve('/login'));
	}

	function goToEvents() {
		goto(resolve('/events'));
	}

	function goToDashboard() {
		goto(resolve('/dashboard'));
	}

	function toggleMobileNav() {
		mobileNavOpen = !mobileNavOpen;
	}

	function closeMobileNav() {
		mobileNavOpen = false;
	}

	function scrollToSection(hash: string) {
		const id = hash.slice(1);
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
		closeMobileNav();
	}

	const navbarItems = navbarItemsData;
</script>

<div
	class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-[#0f1419] dark:via-[#1D232A] dark:to-[#0f1419] transition-colors text-gray-900 dark:text-gray-100"
>
	<header
		class="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-[#1D232A]/85 border-b border-gray-200 dark:border-gray-700 transition-colors"
	>
		<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
			<a
				href={resolve('/')}
				class="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer text-2xl tracking-tight shrink-0"
				>EventHub</a
			>

			<nav
				class="hidden md:flex flex-1 justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400"
			>
				{#each navbarItems as item (item.label)}
					{#if 'path' in item}
						<a
							href={resolve(item.path)}
							class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{item.label}</a
						>
					{:else}
						<button
							type="button"
							onclick={() => scrollToSection(item.hash)}
							class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
						>
							{item.label}
						</button>
					{/if}
				{/each}
			</nav>

			<div class="flex items-center gap-1 sm:gap-2 shrink-0">
				<button
					type="button"
					onclick={toggleTheme}
					class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					aria-label={themeToggleAriaLabel}
					title={$theme === 'dark' ? 'Light mode' : 'Dark mode'}
				>
					{#if $theme === 'dark'}
						<LightIcon size={22} />
					{:else}
						<MoonIcon size={22} />
					{/if}
				</button>
				<div class="hidden md:flex items-center gap-3">
					<a
						href={resolve('/login')}
						class="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
					>
						Sign In
					</a>
					<Button text="Get Started" variant="primary-blue" rounded="lg" onClick={goToRegister} />
				</div>
				<button
					class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-label="Open menu"
					onclick={toggleMobileNav}
					type="button"
				>
					{#if !mobileNavOpen}
						<Menu size={24} />
					{:else}
						<CloseIcon size={24} />
					{/if}
				</button>
			</div>
		</div>

		{#if mobileNavOpen}
			<div
				class="md:hidden bg-white/90 dark:bg-[#1D232A]/95 border-b border-gray-200 dark:border-gray-700 shadow z-30 transition-colors"
			>
				<nav class="flex flex-col px-4 py-4 gap-4 text-gray-700 dark:text-gray-300 font-medium">
					{#each navbarItems as item (item.label)}
						{#if 'path' in item}
							<a
								href={resolve(item.path)}
								class="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
								onclick={closeMobileNav}>{item.label}</a
							>
						{:else}
							<button
								type="button"
								onclick={() => scrollToSection(item.hash)}
								class="text-left hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
							>
								{item.label}
							</button>
						{/if}
					{/each}
					<Button
						text="Sign In"
						variant="default"
						rounded="lg"
						class="w-full"
						onClick={() => {
							closeMobileNav();
							goToLogin();
						}}
					/>
					<Button
						text="Get Started"
						variant="primary-blue"
						rounded="lg"
						class="w-full"
						onClick={() => {
							closeMobileNav();
							goToRegister();
						}}
					/>
				</nav>
			</div>
		{/if}
	</header>

	<main class="max-w-6xl mx-auto px-4">
		<section class="pt-16 pb-10 text-center">
			<h1
				class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight"
			>
				Welcome to
				<span
					class="inline-flex align-middle mx-2 px-4 py-1 rounded-lg text-white bg-linear-to-r from-blue-600 to-purple-600 shadow-sm"
					>EventHub</span
				>
			</h1>
			<p class="mt-5 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
				The all-in-one platform for managing events, tracking attendees, and growing your business
				with powerful analytics.
			</p>

			<div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<Button
					text="Go to Dashboard"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					onClick={goToDashboard}
				/>
				<Button
					text="Browse Events"
					variant="default"
					rounded="lg"
					size="lg"
					class="bg-white/80 dark:bg-gray-800/80 dark:text-gray-100"
					onClick={goToEvents}
				/>
			</div>
		</section>

		<section class="py-10">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
				<MetricItem value="10K+" label="Events Managed" />
				<MetricItem value="500K+" label="Happy Attendees" />
				<MetricItem value="$5M+" label="Revenue Processed" />
				<MetricItem value="99.9%" label="Uptime" />
			</div>
		</section>

		<section id="features" class="py-12">
			<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
				Everything you need to succeed
			</h2>
			<p class="text-gray-600 dark:text-gray-400 text-center mt-3 max-w-2xl mx-auto">
				Powerful features designed to help you create memorable events and grow your business.
			</p>

			<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card
					title="Event Management"
					description="Create, organize, and manage all your events in one centralized platform with ease."
					icon="📅"
				/>

				<Card
					title="Attendee Insights"
					description="Gain deep insights into your audience demographics and engagement patterns."
					icon="👥"
				/>

				<Card
					title="Analytics Dashboard"
					description="Track performance metrics, revenue, and booking trends with real-time analytics."
					icon="📊"
				/>

				<Card
					title="Smart Notifications"
					description="Stay informed with intelligent alerts about registrations, capacity, and more."
					icon="🔔"
				/>

				<Card
					title="Revenue Tracking"
					description="Monitor ticket sales and revenue streams with comprehensive financial reports."
					icon="📈"
				/>

				<Card
					title="Seamless Experience"
					description="Intuitive interface designed for event organizers to work efficiently."
					icon="✨"
				/>
			</div>
		</section>

		<section id="about" class="py-8">
			<div
				class="bg-white/70 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 transition-colors"
			>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					Built for real organizers
				</h2>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
					EventHub helps you manage your own event data (add, edit, delete), monitor performance,
					and keep everything in one place. After you register, you’ll go straight to the dashboard
					to start managing your events.
				</p>
			</div>
		</section>

		<HomeBanner />
	</main>
</div>
