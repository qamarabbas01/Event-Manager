<script lang="ts">
	interface Props {
		title: string;
		description: string;
		icon: string;
	}

	let { title, description, icon }: Props = $props();
</script>

<div
	class="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors"
>
	<div
		class="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"
	>
		<span class="text-sm font-bold">{icon}</span>
	</div>
	<h3 class="mt-4 font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
	<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
		{description}
	</p>
</div>
