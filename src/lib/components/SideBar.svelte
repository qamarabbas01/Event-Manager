<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Home,
		User,
		LogOut,
		Menu,
		X,
		Calendar,
		TrendingUp,
		Bell,
		Sun,
		Moon,
		PanelLeftClose,
		PanelLeftOpen
	} from 'lucide-svelte';
	import {
		navItemsData,
		appTitle,
		logoutLabel,
		toggleMenuAriaLabel,
		collapseSidebarLabel,
		expandSidebarLabel,
		sidebarCollapseAriaLabel,
		themeLightLabel,
		themeDarkLabel,
		themeToggleAriaLabel
	} from '$lib/data/dashboard';
	import { appMark as mark } from '$lib/data/app';
	import { theme } from '$lib/stores/theme';
	import {
		sidebarCollapsed,
		sidebarMobileOpen,
		toggleSidebarCollapsed,
		toggleSidebarMobile,
		closeSidebarMobile,
		initSidebar
	} from '$lib/stores/sidebar';
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

	const collapsed = $derived($sidebarCollapsed);
	const mobileOpen = $derived($sidebarMobileOpen);

	onMount(() => {
		return initSidebar();
	});

	type NavHref = (typeof navItemsData)[number]['href'];

	function isNavActive(href: NavHref, pathname: string): boolean {
		if (href === '/dashboard') return pathname === '/dashboard';
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function handleNavClick(href: NavHref) {
		goto(resolve(href));
		closeSidebarMobile();
	}

	function handleLogout() {
		logout();
		goto(resolve('/login'));
		closeSidebarMobile();
	}

	function toggleTheme() {
		theme.set($theme === 'dark' ? 'light' : 'dark');
	}

	function handleEscape(event: KeyboardEvent) {
		if (event.key === 'Escape' && $sidebarMobileOpen) closeSidebarMobile();
	}
</script>

<svelte:window onkeydown={handleEscape} />

<div class="relative">
	<button
		type="button"
		onclick={toggleSidebarMobile}
		class="md:hidden fixed top-4 left-4 z-50 p-2.5 cursor-pointer rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
		aria-label={toggleMenuAriaLabel}
		aria-expanded={mobileOpen}
	>
		{#if mobileOpen}
			<X size={22} aria-hidden="true" />
		{:else}
			<Menu size={22} aria-hidden="true" />
		{/if}
	</button>

	<aside
		class="fixed left-0 top-0 z-40 flex h-full flex-col border-r border-gray-200 bg-white shadow-sm transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 dark:shadow-none {mobileOpen
			? 'translate-x-0'
			: '-translate-x-full md:translate-x-0'} {collapsed ? 'w-18' : 'w-64'}"
		aria-label="Main navigation"
	>
		<div class="flex h-full min-h-screen flex-col overflow-y-auto overflow-x-hidden">
			<div
				class="flex shrink-0 items-center border-b border-gray-200 dark:border-gray-800 {collapsed
					? 'flex-col gap-2 px-2 py-4'
					: 'justify-between gap-2 px-4 py-5'}"
			>
				{#if collapsed}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm"
						title={appTitle}
					>
						{mark}
					</div>
				{:else}
					<h1 class="min-w-0 truncate text-xl font-semibold text-[#2C2C2C] dark:text-gray-100">
						{appTitle}
					</h1>
				{/if}
				<button
					type="button"
					onclick={toggleSidebarCollapsed}
					class="hidden shrink-0 cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 md:inline-flex"
					aria-label={sidebarCollapseAriaLabel}
					title={collapsed ? expandSidebarLabel : collapseSidebarLabel}
				>
					{#if collapsed}
						<PanelLeftOpen size={20} aria-hidden="true" />
					{:else}
						<PanelLeftClose size={20} aria-hidden="true" />
					{/if}
				</button>
			</div>

			<nav class="flex-1 space-y-1 px-2 py-4 {collapsed ? '' : 'px-3'}">
				{#each navItems as item (item.href)}
					{@const isActive = isNavActive(item.href, page.url.pathname)}
					{@const NavIcon = item.icon}
					<button
						type="button"
						onclick={() => handleNavClick(item.href)}
						title={collapsed ? item.label : undefined}
						class="group relative flex w-full cursor-pointer items-center rounded-xl text-left transition-all duration-200 {collapsed
							? 'justify-center px-0 py-3'
							: 'gap-3 px-3 py-2.5'} {isActive
							? 'bg-[#F5F5F5] font-medium text-[#2C2C2C] dark:bg-gray-800 dark:text-gray-100'
							: 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2C2C2C] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'}"
					>
						<NavIcon
							size={20}
							class="{isActive
								? 'text-[#2C2C2C] dark:text-gray-100'
								: 'text-[#6B7280] dark:text-gray-400'} shrink-0"
						/>
						{#if !collapsed}
							<span class="flex-1 truncate text-sm font-normal">{item.label}</span>
							{#if isActive}
								<div
									class="h-5 w-[3px] shrink-0 rounded-full bg-[#bb9b9b] dark:bg-gray-500"
									aria-hidden="true"
								></div>
							{/if}
						{:else if isActive}
							<span
								class="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#bb9b9b] dark:bg-gray-500"
								aria-hidden="true"
							></span>
						{/if}
					</button>
				{/each}
			</nav>

			<div
				class="shrink-0 space-y-1 border-t border-gray-200 px-2 py-3 dark:border-gray-800 {collapsed
					? ''
					: 'px-3'}"
			>
				<button
					type="button"
					onclick={toggleTheme}
					title={$theme === 'dark' ? themeLightLabel : themeDarkLabel}
					class="flex w-full cursor-pointer items-center rounded-xl text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 {collapsed
						? 'justify-center px-0 py-2.5'
						: 'gap-3 px-3 py-2'}"
					aria-label={themeToggleAriaLabel}
				>
					{#if $theme === 'dark'}
						<Sun size={20} class="shrink-0" />
					{:else}
						<Moon size={20} class="shrink-0" />
					{/if}
					{#if !collapsed}
						<span class="flex-1 text-sm">{$theme === 'dark' ? themeLightLabel : themeDarkLabel}</span>
					{/if}
				</button>
				<button
					type="button"
					onclick={handleLogout}
					title={logoutLabel}
					class="flex w-full cursor-pointer items-center rounded-xl text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 {collapsed
						? 'justify-center px-0 py-2.5'
						: 'gap-3 px-3 py-2'}"
				>
					<LogOut size={20} class="shrink-0 text-red-600 dark:text-red-400" />
					{#if !collapsed}
						<span class="flex-1 text-sm">{logoutLabel}</span>
					{/if}
				</button>
			</div>
		</div>
	</aside>

	{#if mobileOpen}
		<button
			type="button"
			tabindex="-1"
			onclick={closeSidebarMobile}
			class="fixed inset-0 z-30 cursor-default bg-black/50 md:hidden"
			aria-hidden="true"
		></button>
	{/if}
</div>
