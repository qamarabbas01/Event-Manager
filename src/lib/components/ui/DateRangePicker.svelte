<script lang="ts">
	import { dateRangeUi } from '$lib/data/dashboard';

	interface Props {
		startDate?: string;
		endDate?: string;
		class?: string;
	}

	let {
		startDate = $bindable(''),
		endDate = $bindable(''),
		class: className = ''
	}: Props = $props();

	function toISO(date: Date): string {
		return date.toISOString().slice(0, 10);
	}

	$effect(() => {
		if (startDate === '' && endDate === '') {
			startDate = '2024-01-01';
			endDate = toISO(new Date());
		}
	});

	const inputClass =
		'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
</script>

<div class="flex flex-wrap items-center gap-2 {className}">
	<div class="flex items-center gap-2 flex-wrap">
		<input
			type="date"
			bind:value={startDate}
			class={inputClass}
			aria-label={dateRangeUi.startDateAriaLabel}
		/>
		<span class="text-gray-400 text-sm">–</span>
		<input
			type="date"
			bind:value={endDate}
			class={inputClass}
			aria-label={dateRangeUi.endDateAriaLabel}
		/>
	</div>
</div>
