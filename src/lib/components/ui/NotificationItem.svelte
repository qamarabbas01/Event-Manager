<script lang="ts">
	import type { Component, ComponentProps } from 'svelte';

	interface Props {
		type: 'success' | 'warning' | 'info';
		title: string;
		message: string;
		timestamp: string;
		icon: Component<ComponentProps<any>>;
	}

	let { type, title, message, timestamp, icon: Icon }: Props = $props();

	const typeStyles = {
		success: {
			bg: 'bg-green-50',
			iconBg: 'bg-green-500',
			iconColor: 'text-white'
		},
		warning: {
			bg: 'bg-orange-50',
			iconBg: 'bg-orange-500',
			iconColor: 'text-white'
		},
		info: {
			bg: 'bg-blue-50',
			iconBg: 'bg-blue-500',
			iconColor: 'text-white'
		}
	};

	const styles = typeStyles[type];
</script>

<div class="p-4 rounded-lg {styles.bg} border border-transparent hover:border-gray-300 transition-colors">
	<div class="flex items-start gap-3">
		<div class="p-2 {styles.iconBg} rounded-full shrink-0">
			<svelte:component this={Icon} size={16} class={styles.iconColor} />
		</div>
		<div class="flex-1 min-w-0">
			<h4 class="font-semibold text-gray-900 mb-1">{title}</h4>
			<p class="text-sm text-gray-600 mb-2">{message}</p>
			<p class="text-xs text-gray-500">{timestamp}</p>
		</div>
	</div>
</div>
