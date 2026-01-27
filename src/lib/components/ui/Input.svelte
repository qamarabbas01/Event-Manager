<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';

	interface Props {
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
			<div class="absolute left-3 pointer-events-none z-10 flex items-center mt-[-18px]">
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={leftIcon} size={iconSize} class="text-gray-400" />
			</div>
		{/key}
	{/if}
	<input
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
