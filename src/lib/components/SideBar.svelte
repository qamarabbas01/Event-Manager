<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import HomeIcon from './ui/icons/HomeIcon.svelte';
	import Profile from './ui/icons/Profile.svelte';
	import DoorIcon from './ui/icons/DoorIcon.svelte';
	import MenuToggleIcon from './ui/icons/MenuToggleIcon.svelte';
	import { navItemsData, appTitle, logoutLabel, toggleMenuAriaLabel } from '$lib/data/dashboard';
	import type { IconComponent } from '$lib/types/icons';
	import Dashboard from './ui/icons/Dashboard.svelte';
	import Users from './ui/icons/Users.svelte';

	const iconMap: Record<string, IconComponent> = {
		HomeIcon,
		Dashboard,
		Profile,
		Users
	};

	const navItems = $derived(
		navItemsData.map((item) => ({
			...item,
			icon: iconMap[item.iconKey] ?? HomeIcon
		}))
	);

	let isMobileMenuOpen = $state(false);

	function handleNavClick(href: string) {
		goto(href);
		isMobileMenuOpen = false;
	}

	function handleLogout() {
		console.log('Logout clicked');
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	$effect(() => {
		isMobileMenuOpen = false;
	});
</script>

<div class="relative">
	<button
		onclick={toggleMobileMenu}
		class="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
		aria-label={toggleMenuAriaLabel}
	>
		<MenuToggleIcon size={24} open={isMobileMenuOpen} />
	</button>

	<aside
		class="fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 {isMobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full md:translate-x-0'} w-64 shrink-0"
	>
		<div class="flex flex-col h-full min-h-screen overflow-y-auto">
			<div class="p-6 border-b border-gray-200">
				<h1 class="text-2xl font-semibold text-[#2C2C2C]">{appTitle}</h1>
			</div>

			<nav class="flex-1 px-4 py-6 space-y-2">
				{#each navItems as item}
					{@const isActive = $page.url.pathname === item.href}
					<button
						onclick={() => handleNavClick(item.href)}
						class="w-full flex items-center gap-3 px-4 cursor-pointer py-3 rounded-lg text-left transition-all duration-200 {isActive
							? 'bg-[#F5F5F5] text-[#2C2C2C] font-medium'
							: 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2C2C2C]'}"
					>
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component
							this={item.icon}
							size={18}
							class={isActive ? 'text-[#2C2C2C] shrink-0' : 'text-[#6B7280] shrink-0'}
						/>
						<span class="flex-1 text-base font-normal">{item.label}</span>
						{#if isActive}
							<div class="w-[3px] h-5 bg-[#bb9b9b] rounded-full shrink-0" aria-hidden="true"></div>
						{/if}
					</button>
				{/each}
			</nav>

			<div class="px-4 py-2 border-t border-gray-200">
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200"
				>
					<DoorIcon size={20} class="text-red-600 shrink-0" />
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
