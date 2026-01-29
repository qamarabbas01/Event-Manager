<script lang="ts">
	import type { Component, ComponentProps } from 'svelte';

	interface Props {
		label: string;
		value: string | number;
		trend?: {
			value: string;
			isPositive: boolean;
		};
		icon: Component<ComponentProps<any>>;
		iconBgColor?: string;
		iconColor?: string;
	}

	let {
		label,
		value,
		trend,
		icon: Icon,
		iconBgColor = 'bg-purple-100',
		iconColor = 'text-purple-600'
	}: Props = $props();
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm text-gray-500 mb-1">{label}</p>
			<p class="text-3xl font-bold text-gray-900">{value}</p>
			{#if trend}
				<div class="flex items-center gap-1 mt-2">
					{#if trend.isPositive}
						<span class="text-green-600 text-sm font-medium">{trend.value}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 16 16"
							fill="none"
							class="text-green-600"
						>
							<path
								d="M13.5 4.5L8.5 9.5L6 7L2.5 10.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M10.5 4.5H13.5V7.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else}
						<span class="text-red-600 text-sm font-medium">{trend.value}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 16 16"
							fill="none"
							class="text-red-600"
						>
							<path
								d="M2.5 11.5L7.5 6.5L10 9L13.5 5.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M5.5 11.5H2.5V8.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</div>
			{/if}
		</div>
		<div class="p-3 {iconBgColor} rounded-full">
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component this={Icon} size={24} class={iconColor} />
		</div>
	</div>
</div>
