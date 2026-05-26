<script lang="ts">
	import { TrendingUp, TrendingDown } from '@lucide/svelte';
	import type { IconComponent } from '$lib/types/icons';

	interface Props {
		label: string;
		value: string | number;
		trend?: {
			value: string;
			isPositive: boolean;
		};
		icon: IconComponent;
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

<div
	class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
>
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
			<p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
			{#if trend}
				<div class="flex items-center gap-1 mt-2">
					{#if trend.isPositive}
						<span class="text-green-600 text-sm font-medium">{trend.value}</span>
						<TrendingUp size={12} class="text-green-600" aria-hidden="true" />
					{:else}
						<span class="text-red-600 text-sm font-medium">{trend.value}</span>
						<TrendingDown size={12} class="text-red-600" aria-hidden="true" />
					{/if}
				</div>
			{/if}
		</div>
		<div class="p-3 {iconBgColor} rounded-full">
			<Icon size={24} class={iconColor} />
		</div>
	</div>
</div>
