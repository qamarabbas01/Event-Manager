<script lang="ts">
	import type { DropdownItem } from '$lib/types/components';
	import ArrowDown from './icons/ArrowDown.svelte';

	interface Props {
		options: readonly string[];
		value?: string;
		placeholder?: string;
		class?: string;
	}

	let {
		options,
		value = $bindable(''),
		placeholder = 'Select...',
		class: className = ''
	}: Props = $props();

	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement | undefined = $state();
	let triggerRef: HTMLButtonElement | undefined = $state();

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleItemClick(option: string) {
		value = option;
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			dropdownRef &&
			triggerRef &&
			!dropdownRef.contains(event.target as Node) &&
			!triggerRef.contains(event.target as Node)
		) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});

	const dropdownItems: DropdownItem[] = $derived(
		options.map((option) => ({
			label: option,
			onclick: () => handleItemClick(option)
		}))
	);

	const displayValue = $derived(value && value !== 'All' ? value : placeholder);
	const isPlaceholder = $derived(!value || value === 'All');
</script>

<div class="relative">
	<button
		bind:this={triggerRef}
		type="button"
		onclick={toggleDropdown}
		class="flex items-center justify-between gap-2 border border-gray-300 dark:border-gray-500 px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-gray-100 min-w-[120px] w-full md:w-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-amber-500/50 focus:border-transparent hover:border-gray-400 dark:hover:border-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-200 disabled:cursor-not-allowed {className}"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
		aria-label={placeholder}
	>
		<span
			class="flex-1 text-left truncate {isPlaceholder ? 'text-gray-400 dark:text-gray-100' : ''}"
			>{displayValue}</span
		>
		<ArrowDown
			size={10}
			class="shrink-0 ml-1 transition-transform text-gray-600 dark:text-gray-400 {isOpen
				? 'rotate-180'
				: ''}"
		/>
	</button>

	{#if isOpen}
		<div bind:this={dropdownRef} class="absolute top-full left-0 mt-1 z-50 w-full min-w-[120px]">
			<div
				class="rounded border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-md py-1"
			>
				<ul class="flex flex-col gap-1 p-2" role="menu">
					{#each dropdownItems as item, index (index)}
						<li role="menuitem" class="list-none">
							<button
								type="button"
								disabled={item.disabled}
								onclick={(e) => {
									e.stopPropagation();
									item.onclick?.();
									isOpen = false;
								}}
								class="flex w-full items-center gap-3 text-sm font-normal text-gray-800 dark:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer py-2 px-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-amber-500/50 focus:ring-offset-1 rounded"
								aria-disabled={item.disabled}
							>
								{#if item.icon}
									{#key item.icon}
										<div class="shrink-0">
											<!-- svelte-ignore svelte_component_deprecated -->
											<svelte:component
												this={item.icon}
												size={20}
												class="text-gray-600 dark:text-gray-400"
											/>
										</div>
									{/key}
								{/if}
								<span class="flex-1 text-left text-gray-800 dark:text-gray-100">{item.label}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>
