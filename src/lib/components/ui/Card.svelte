<script lang="ts">
	interface Props {
		title: string;
		description: string;
		icon: string;
	}

	let { title, description, icon }: Props = $props();
</script>

<div
	class="group bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50 hover:-translate-y-0.5"
>
	<div
		class="w-11 h-11 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center text-lg transition-transform group-hover:scale-105"
	>
		<span class="text-sm font-bold">{icon}</span>
	</div>
	<h3 class="mt-4 font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
	<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
		{description}
	</p>
</div>
