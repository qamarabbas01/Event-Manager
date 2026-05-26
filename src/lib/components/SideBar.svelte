<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Home, User, LogOut, Menu, X, Calendar, TrendingUp, Bell, Sun, Moon } from 'lucide-svelte';
	import {
		navItemsData,
		appTitle,
		logoutLabel,
		toggleMenuAriaLabel,
		themeLightLabel,
		themeDarkLabel,
		themeToggleAriaLabel
	} from '$lib/data/dashboard';
	import { theme } from '$lib/stores/theme';
	import { logout } from '$lib/stores/auth';
	import type { IconComponent } from '$lib/types/icons';

	const iconMap: Record<string, IconComponent> = {
		Home,
		Calendar,
		Chart: TrendingUp,
		Bell,
		Profile: User
	};

	const navItems = $derived(
		navItemsData.map((item) => ({
			...item,
			icon: iconMap[item.iconKey] ?? Home
		}))
	);

	let isMobileMenuOpen = $state(false);

	type NavHref = (typeof navItemsData)[number]['href'];

	function isNavActive(href: NavHref, pathname: string): boolean {
		if (href === '/dashboard') return pathname === '/dashboard';
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function handleNavClick(href: NavHref) {
		goto(resolve(href));
		isMobileMenuOpen = false;
	}

	function handleLogout() {
		logout();
		goto(resolve('/login'));
		isMobileMenuOpen = false;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function toggleTheme() {
		theme.set($theme === 'dark' ? 'light' : 'dark');
	}
</script>

<div class="relative">
	<button
		onclick={toggleMobileMenu}
		class="md:hidden fixed top-4 right-4 z-50 p-2 cursor-pointer rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
		aria-label={toggleMenuAriaLabel}
	>
		{#if isMobileMenuOpen}
			<X size={24} aria-hidden="true" />
		{:else}
			<Menu size={24} aria-hidden="true" />
		{/if}
	</button>

	<aside
		class="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 {isMobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full md:translate-x-0'} w-64 shrink-0"
	>
		<div class="flex flex-col h-full min-h-screen overflow-y-auto">
			<div class="p-6 border-b border-gray-200 dark:border-gray-800">
				<h1 class="text-2xl font-semibold text-[#2C2C2C] dark:text-gray-100">{appTitle}</h1>
			</div>

			<nav class="flex-1 px-4 py-6 space-y-2">
				{#each navItems as item (item.href)}
					{@const isActive = isNavActive(item.href, page.url.pathname)}
					{@const NavIcon = item.icon}
					<button
						onclick={() => handleNavClick(item.href)}
						class="w-full flex items-center gap-3 px-4 cursor-pointer py-3 rounded-lg text-left transition-all duration-200 {isActive
							? 'bg-[#F5F5F5] dark:bg-gray-800 text-[#2C2C2C] dark:text-gray-100 font-medium'
							: 'text-[#6B7280] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#2C2C2C] dark:hover:text-gray-100'}"
					>
						<NavIcon
							size={18}
							class="{isActive
								? 'text-[#2C2C2C] dark:text-gray-100'
								: 'text-[#6B7280] dark:text-gray-400'} shrink-0"
						/>
						<span class="flex-1 text-base font-normal">{item.label}</span>
						{#if isActive}
							<div
								class="w-[3px] h-5 bg-[#bb9b9b] dark:bg-gray-500 rounded-full shrink-0"
								aria-hidden="true"
							></div>
						{/if}
					</button>
				{/each}
			</nav>

			<div class="px-4 py-2 space-y-1 border-t border-gray-200 dark:border-gray-800">
				<button
					onclick={toggleTheme}
					class="w-full flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					aria-label={themeToggleAriaLabel}
					title={$theme === 'dark' ? themeLightLabel : themeDarkLabel}
				>
					{#if $theme === 'dark'}
						<Sun size={20} class="shrink-0" />
						<span class="flex-1">{themeLightLabel}</span>
					{:else}
						<Moon size={20} class="shrink-0" />
						<span class="flex-1">{themeDarkLabel}</span>
					{/if}
				</button>
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
				>
					<LogOut size={20} class="text-red-600 dark:text-red-400 shrink-0" />
					<span class="flex-1">{logoutLabel}</span>
				</button>
			</div>
		</div>
	</aside>

	{#if isMobileMenuOpen}
		<div
			onclick={toggleMobileMenu}
			class="fixed inset-0 bg-black/50 z-30 md:hidden"
			aria-hidden="true"
		></div>
	{/if}
</div>
