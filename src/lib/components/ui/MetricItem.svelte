<script lang="ts">
	let { value = '10K+', label = 'Events Managed' }: { value?: string; label?: string } = $props();
</script>

<div class="text-center">
	<div class="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
		{value}
	</div>
	<div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
		{label}
	</div>
</div>
