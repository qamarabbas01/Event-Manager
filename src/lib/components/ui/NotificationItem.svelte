<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';

	interface Props {
		type: 'success' | 'warning' | 'info';
		title: string;
		message: string;
		timestamp: string;
		icon: IconComponent;
		compact?: boolean;
	}

	let { type, title, message, timestamp, icon: Icon, compact = false }: Props = $props();

	const typeStyles = {
		success: {
			bg: 'bg-green-50 dark:bg-green-900/20',
			iconBg: 'bg-green-500',
			iconColor: 'text-white'
		},
		warning: {
			bg: 'bg-orange-50 dark:bg-orange-900/20',
			iconBg: 'bg-orange-500',
			iconColor: 'text-white'
		},
		info: {
			bg: 'bg-blue-50 dark:bg-blue-900/20',
			iconBg: 'bg-blue-500',
			iconColor: 'text-white'
		}
	};

	const styles = $derived(typeStyles[type]);
</script>

<div
	class="{compact
		? 'py-0'
		: `p-4 rounded-lg ${styles.bg} border border-transparent hover:border-gray-300 dark:hover:border-gray-600`} transition-colors"
>
	<div class="flex items-start gap-3">
		<div class="p-2 {styles.iconBg} rounded-full shrink-0">
			<Icon size={16} class={styles.iconColor} />
		</div>
		<div class="flex-1 min-w-0">
			<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
			<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{message}</p>
			<p class="text-xs text-gray-500 dark:text-gray-500">{timestamp}</p>
		</div>
	</div>
</div>
