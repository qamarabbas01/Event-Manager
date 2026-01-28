<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import HomeIcon from './ui/icons/HomeIcon.svelte';
	import CalendarIcon from './ui/icons/CalendarIcon.svelte';
	import SettingIcon from './ui/icons/SettingIcon.svelte';
	import Profile from './ui/icons/Profile.svelte';
	import DoorIcon from './ui/icons/DoorIcon.svelte';
	import type { IconComponent } from '$lib/types/icons';

	interface NavItem {
		label: string;
		href: string;
		icon: IconComponent;
	}

	const navItems: NavItem[] = [
		{ label: 'Home', href: '/', icon: HomeIcon },
		{ label: 'Dashboard', href: '/dashboard', icon: CalendarIcon },
		{ label: 'Settings', href: '/settings', icon: SettingIcon },
		{ label: 'Profile', href: '/profile', icon: Profile }
	];

	let isCollapsed = $state(false);
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
		class="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
		aria-label="Toggle menu"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{#if isMobileMenuOpen}
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			{:else}
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<line x1="3" y1="18" x2="21" y2="18" />
			{/if}
		</svg>
	</button>

	<aside
		class="fixed md:static left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 md:translate-x-0 {isMobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full md:translate-x-0'} w-64 shrink-0"
	>
		<div class="flex flex-col h-full">
			<div class="p-6 border-b border-gray-200">
				<h1 class="text-xl font-semibold text-[#59452B]">Event Manager</h1>
			</div>

			<nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
				{#each navItems as item}
					{@const isActive = $page.url.pathname === item.href}
					<button
						onclick={() => handleNavClick(item.href)}
						class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 {isActive
							? 'bg-[#59452B1A] text-[#59452B] font-medium'
							: 'text-[#7B6242] hover:bg-gray-50 hover:text-[#59452B]'}"
					>
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component
							this={item.icon}
							size={20}
							class={isActive ? 'text-[#59452B]' : 'text-[#7B6242]'}
						/>
						<span class="flex-1">{item.label}</span>
						{#if isActive}
							<div class="w-1 h-6 bg-[#59452B] rounded-full"></div>
						{/if}
					</button>
				{/each}
			</nav>

			<div class="p-4 border-t border-gray-200">
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200"
				>
					<DoorIcon size={20} class="text-red-600" />
					<span class="flex-1">Logout</span>
				</button>
			</div>
		</div>
	</aside>

	{#if isMobileMenuOpen}
		<div
			onclick={toggleMobileMenu}
			class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
			aria-hidden="true"
		></div>
	{/if}
</div>
