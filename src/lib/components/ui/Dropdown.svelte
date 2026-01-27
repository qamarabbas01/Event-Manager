<script lang="ts">
	import type { IconComponent } from '$lib/types/components';

	export interface DropdownItem {
		label: string;
		href?: string;
		icon?: IconComponent;
		onclick?: () => void;
		disabled?: boolean;
		divider?: boolean;
	}

	interface Props {
		items: DropdownItem[];
		class?: string;
		onitemclick?: () => void;
		dropdownContentRef?: HTMLDivElement;
		iconSize?: number;
		role?: string;
	}

	let {
		items,
		class: className = '',
		onitemclick,
		dropdownContentRef = $bindable(),
		iconSize = 20,
		role = 'menu'
	}: Props = $props();

	function handleItemClick(item: DropdownItem, e: MouseEvent) {
		if (item.disabled || item.divider) {
			e.preventDefault();
			return;
		}

		e.stopPropagation();
		item.onclick?.();
		onitemclick?.();
	}

	function handleKeydown(item: DropdownItem, e: KeyboardEvent) {
		if (item.disabled || item.divider) {
			return;
		}

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			e.stopPropagation();
			item.onclick?.();
			onitemclick?.();
		}
	}
</script>

<div
	bind:this={dropdownContentRef}
	role={role}
	class="absolute top-full left-1/2 z-9999 mt-2 rounded-3xl border border-gray-400/10 bg-white shadow-lg min-w-[200px] {className}"
>
	<ul class="flex flex-col gap-1 p-2" role="menu">
		{#each items as item, index (index)}
			{#if item.divider}
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<li role="separator" class="h-px bg-gray-200 my-1" />
			{:else}
				<li role="menuitem" class="list-none">
					{#if item.onclick && !item.href}
						<button
							type="button"
							disabled={item.disabled}
							onclick={(e) => handleItemClick(item, e)}
							onkeydown={(e) => handleKeydown(item, e)}
							class="flex w-full items-center gap-3 text-base font-normal text-black hover:bg-gray-50 rounded-2xl py-2 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
							aria-disabled={item.disabled}
						>
							{#if item.icon}
								{#key item.icon}
									<div class="flex-shrink-0">
										<!-- svelte-ignore svelte_component_deprecated -->
										<svelte:component this={item.icon} size={iconSize} class="text-gray-600" />
									</div>
								{/key}
							{/if}
							<span class="flex-1 text-left">{item.label}</span>
						</button>
					{:else}
						<a
							href={item.disabled ? undefined : item.href || '#'}
							onclick={(e) => handleItemClick(item, e)}
							onkeydown={(e) => handleKeydown(item, e)}
							aria-disabled={item.disabled}
							tabindex={item.disabled ? -1 : 0}
							class="flex items-center gap-3 text-base font-normal text-black hover:bg-gray-50 rounded-2xl py-2 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 {item.disabled
								? 'pointer-events-none'
								: ''}"
						>
							{#if item.icon}
								{#key item.icon}
									<div class="flex-shrink-0">
										<!-- svelte-ignore svelte_component_deprecated -->
										<svelte:component this={item.icon} size={iconSize} class="text-gray-600" />
									</div>
								{/key}
							{/if}
							<span class="flex-1">{item.label}</span>
						</a>
					{/if}
				</li>
			{/if}
		{/each}
	</ul>
</div>
