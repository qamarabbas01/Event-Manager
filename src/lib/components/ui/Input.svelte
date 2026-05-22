<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		icons?: boolean;
		leftIcon?: IconComponent;
		placeholder?: string;
		value?: string;
		type?: HTMLInputAttributes['type'];
		autocomplete?: HTMLInputAttributes['autocomplete'];
		inputmode?: HTMLInputAttributes['inputmode'];
		required?: boolean;
		ariaDescribedby?: string;
		ariaInvalid?: boolean;
		disabled?: boolean;
		class?: string;
		iconSize?: number;
	}

	let {
		id,
		name,
		icons,
		leftIcon,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		autocomplete,
		inputmode,
		required = false,
		ariaDescribedby,
		ariaInvalid,
		disabled = false,
		class: className = '',
		iconSize = 20
	}: Props = $props();
	const showIcons = $derived(icons ?? !!leftIcon);
</script>

<div class="relative inline-flex items-center w-full">
	{#if showIcons && leftIcon}
		{@const LeftIcon = leftIcon}
		{#key leftIcon}
			<div
				class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
			>
				<LeftIcon size={iconSize} class="text-gray-400 shrink-0" />
			</div>
		{/key}
	{/if}
	<input
		{id}
		{name}
		{type}
		bind:value
		{placeholder}
		{autocomplete}
		{inputmode}
		{required}
		aria-describedby={ariaDescribedby}
		aria-invalid={ariaInvalid}
		{disabled}
		class="w-full border border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-amber-500/50 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed {showIcons &&
		leftIcon
			? 'pl-10'
			: ''} {className}"
	/>
</div>
