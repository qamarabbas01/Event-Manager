<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import HomeBanner from '$lib/components/HomeBanner.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { X, Sun, Menu, Moon, CircleCheck } from 'lucide-svelte';
	import { homePage } from '$lib/data/home';
	import { themeToggleAriaLabel } from '$lib/data/dashboard';
	import { theme } from '$lib/stores/theme';

	const { header, hero, stats, features, about, footer } = homePage;

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
</script>

<div
	class="relative min-h-screen overflow-x-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-[#0a0e14] dark:via-[#1D232A] dark:to-[#121820] transition-colors text-gray-900 dark:text-gray-100"
>
	<!-- Ambient background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div
			class="absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl"
		></div>
		<div
			class="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-purple-400/15 dark:bg-purple-600/10 blur-3xl"
		></div>
	</div>

	<header
		class="sticky top-0 z-30 border-b border-gray-200/80 dark:border-gray-700/60 bg-white/75 dark:bg-[#1D232A]/80 backdrop-blur-md transition-colors"
	>
		<div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
			<a
				href={resolve('/')}
				class="inline-flex items-center gap-2.5 font-semibold text-gray-900 dark:text-gray-100 shrink-0"
			>
				<span
					class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-md"
					aria-hidden="true"
				>
					{header.brandMark}
				</span>
				<span class="text-xl tracking-tight">{header.brandTitle}</span>
			</a>

			<nav
				class="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400"
			>
				{#each header.nav as item (item.label)}
					{#if 'path' in item}
						<a
							href={resolve('/events')}
							class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.label}</a
						>
					{:else}
						<button
							type="button"
							onclick={() => scrollToSection(item.hash)}
							class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							{item.label}
						</button>
					{/if}
				{/each}
			</nav>

			<div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
				<button
					type="button"
					onclick={toggleTheme}
					class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors"
					aria-label={themeToggleAriaLabel}
					title={$theme === 'dark' ? 'Light mode' : 'Dark mode'}
				>
					{#if $theme === 'dark'}
						<Sun size={22} />
					{:else}
						<Moon size={22} />
					{/if}
				</button>
				<div class="hidden md:flex items-center gap-3">
					<a
						href={resolve('/login')}
						class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
					>
						{header.signInLink}
					</a>
					<Button
						text={header.getStartedButton}
						variant="primary-blue"
						rounded="lg"
						onClick={goToRegister}
					/>
				</div>
				<button
					class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					aria-label={header.menuAriaLabel}
					onclick={toggleMobileNav}
					type="button"
				>
					{#if !mobileNavOpen}
						<Menu size={24} />
					{:else}
						<X size={24} />
					{/if}
				</button>
			</div>
		</div>

		{#if mobileNavOpen}
			<div
				class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1D232A]/95 backdrop-blur-sm"
			>
				<nav class="flex flex-col px-4 py-5 gap-1 text-gray-700 dark:text-gray-300 font-medium">
					{#each header.nav as item (item.label)}
						{#if 'path' in item}
							<a
								href={resolve('/events')}
								class="px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								onclick={closeMobileNav}>{item.label}</a
							>
						{:else}
							<button
								type="button"
								onclick={() => scrollToSection(item.hash)}
								class="text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
							>
								{item.label}
							</button>
						{/if}
					{/each}
					<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
						<Button
							text={header.signInLink}
							variant="default"
							rounded="lg"
							class="w-full"
							onClick={() => {
								closeMobileNav();
								goToLogin();
							}}
						/>
						<Button
							text={header.getStartedButton}
							variant="primary-blue"
							rounded="lg"
							class="w-full"
							onClick={() => {
								closeMobileNav();
								goToRegister();
							}}
						/>
					</div>
				</nav>
			</div>
		{/if}
	</header>

	<main class="relative max-w-6xl mx-auto px-4 sm:px-6">
		<!-- Hero -->
		<section class="pt-14 sm:pt-20 pb-16 sm:pb-20 text-center">
			<p
				class="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/60 bg-white/60 dark:bg-gray-800/50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-sm"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></span>
				{hero.badge}
			</p>

			<h1
				class="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1] max-w-4xl mx-auto"
			>
				{hero.welcomePrefix}
				<span
					class="block mt-2 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
				>
					{hero.highlightTitle}
				</span>
			</h1>

			<p
				class="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
			>
				{hero.subtitle}
			</p>

			<div class="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
				<Button
					text={hero.primaryCta}
					variant="primary-blue"
					rounded="lg"
					size="lg"
					onClick={goToDashboard}
				/>
				<Button
					text={hero.secondaryCta}
					variant="default"
					rounded="lg"
					size="lg"
					class="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm"
					onClick={goToEvents}
				/>
			</div>

			<p
				class="mt-10 text-xs sm:text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500"
			>
				{hero.trustLine}
			</p>
		</section>

		<!-- Stats -->
		<section class="pb-16 sm:pb-20">
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				{#each stats as stat (stat.label)}
					<div
						class="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm p-5 sm:p-6 text-center shadow-sm transition-colors"
					>
						<p class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
							{stat.value}
						</p>
						<p
							class="mt-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
						>
							{stat.label}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Features -->
		<section id="features" class="py-16 sm:py-20">
			<div class="text-center max-w-2xl mx-auto">
				<h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
					{features.title}
				</h2>
				<p class="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
					{features.subtitle}
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
				{#each features.cards as card (card.title)}
					<Card title={card.title} description={card.description} icon={card.icon} />
				{/each}
			</div>
		</section>

		<!-- About -->
		<section id="about" class="py-16 sm:py-20">
			<div
				class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-3xl border border-gray-200 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm p-8 sm:p-10 shadow-sm"
			>
				<div>
					<h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
						{about.title}
					</h2>
					<p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
						{about.description}
					</p>
					<div class="mt-8">
						<Button
							text={about.cta}
							variant="primary-blue"
							rounded="lg"
							size="lg"
							onClick={goToRegister}
						/>
					</div>
				</div>
				<ul class="space-y-4">
					{#each about.highlights as highlight (highlight)}
						<li class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
							<span
								class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40"
							>
								<CircleCheck size={14} class="text-green-600 dark:text-green-400" />
							</span>
							<span class="text-sm sm:text-base leading-relaxed">{highlight}</span>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<HomeBanner />
	</main>

	<footer
		class="relative border-t border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-[#151a22]/80 backdrop-blur-sm"
	>
		<div
			class="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
		>
			<div class="flex items-center gap-2">
				<span
					class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-xs font-bold text-white"
					aria-hidden="true"
				>
					{header.brandMark}
				</span>
				<p class="text-sm text-gray-500 dark:text-gray-400">{footer.tagline}</p>
			</div>
			<p class="text-xs text-gray-400 dark:text-gray-500">{footer.copyright}</p>
		</div>
	</footer>
</div>
