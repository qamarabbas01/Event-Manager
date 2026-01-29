<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';

	interface Props {
		id?: string;
		icons?: boolean;
		leftIcon?: IconComponent;
		placeholder?: string;
		value?: string;
		type?: string;
		disabled?: boolean;
		class?: string;
		iconSize?: number;
	}

	let {
		id,
		icons,
		leftIcon,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		disabled = false,
		class: className = '',
		iconSize = 20
	}: Props = $props();
	const showIcons = $derived(icons ?? !!leftIcon);
</script>

<div class="relative inline-flex items-center w-full">
	{#if showIcons && leftIcon}
		{#key leftIcon}
			<div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={leftIcon} size={iconSize} class="text-gray-400 shrink-0" />
			</div>
		{/key}
	{/if}
	<input
		{id}
		{type}
		bind:value
		{placeholder}
		{disabled}
		class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed {showIcons &&
		leftIcon
			? 'pl-10'
			: ''} {className}"
	/>
</div>
