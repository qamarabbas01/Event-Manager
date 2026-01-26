<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';

	interface Props {
		icons?: boolean;
		leftIcon?: IconComponent;
		rightIcon?: IconComponent;
		placeholder?: string;
		value?: string;
		type?: string;
		disabled?: boolean;
		class?: string;
		iconSize?: number;
	}

	let {
		icons = false,
		leftIcon,
		rightIcon,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		disabled = false,
		class: className = '',
		iconSize = 20
	}: Props = $props();
</script>

<div class="relative inline-flex items-center w-full">
	{#if icons && leftIcon}
		{#key leftIcon}
			<div class="absolute left-3 pointer-events-none">
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
		class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed {icons &&
		leftIcon
			? 'pl-10'
			: ''} {icons && rightIcon ? 'pr-10' : ''} {className}"
	/>
	{#if icons && rightIcon}
		{#key rightIcon}
			<div class="absolute right-3 pointer-events-none">
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={rightIcon} size={iconSize} class="text-gray-400" />
			</div>
		{/key}
	{/if}
</div>
