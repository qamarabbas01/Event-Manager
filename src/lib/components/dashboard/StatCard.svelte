<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		value: string | number;
		icon: Component<{ size?: number; class?: string }>;
		valueColor?: string;
		iconBg?: string;
		iconColor?: string;
	}

	let { label, value, icon: Icon, valueColor = 'text-[#59452B]', iconBg = 'bg-[#59452B1A]', iconColor = 'text-[#59452B]' }: Props = $props();
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm text-[#ADA295] mb-1">{label}</p>
			<p class="text-3xl font-bold {valueColor}">{value}</p>
		</div>
		<div class="p-3 {iconBg} rounded-full">
			<Icon size={24} class={iconColor} />
		</div>
	</div>
</div>
