<script lang="ts">
	import DateRangePicker from '$lib/components/ui/DateRangePicker.svelte';

	interface DataPoint {
		label: string;
		value: number;
		date?: string;
	}

	interface Props {
		title: string;
		data: DataPoint[];
		height?: number;
		color?: string;
		baseYear?: number;
		valuePrefix?: string;
	}

	let { title, data, height = 200, color = '#9333ea', baseYear = 2024, valuePrefix = '' }: Props = $props();

	let startDate = $state('');
	let endDate = $state('');

	const filteredData = $derived.by(() => {
		if (!startDate || !endDate) return data;
		return data.filter((point, i) => {
			const pointDate = point.date ?? `${baseYear}-${String(i + 1).padStart(2, '0')}-01`;
			return pointDate >= startDate && pointDate <= endDate;
		});
	});

	const chartData = $derived.by(() => {
		if (filteredData.length === 0) return [];
		const hasDates = filteredData.every((p) => p.date);
		if (!hasDates) return filteredData;
		const byYear = new Map<string, number>();
		for (const p of filteredData) {
			const year = p.date!.slice(0, 4);
			byYear.set(year, (byYear.get(year) ?? 0) + p.value);
		}
		return [...byYear.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([label, value]) => ({ label, value }));
	});

	let containerEl: HTMLDivElement | undefined;
	let chartWidth = $state(400);

	$effect(() => {
		if (!containerEl) return;
		const ro = new ResizeObserver((entries) => {
			const w = entries[0].contentRect.width;
			chartWidth = w > 0 ? w : 400;
		});
		ro.observe(containerEl);
		return () => ro.disconnect();
	});

	const padding = { top: 20, right: 20, bottom: 44, left: 58 };
	const chartHeight = $derived(height);

	const maxValue = $derived(Math.max(...chartData.map((d) => d.value), 0));
	const slotCount = $derived(Math.max(chartData.length, 3));
	const plotWidth = (w: number) => w - padding.left - padding.right;
	const barGap = 8;
	const getBarWidth = (width: number) => {
		const pw = plotWidth(width);
		return Math.max(0, (pw - (slotCount - 1) * barGap) / slotCount);
	};

	const xScale = (index: number, width: number) => {
		const pw = plotWidth(width);
		const slotWidth = pw / slotCount;
		return padding.left + index * slotWidth + (slotWidth - getBarWidth(width)) / 2;
	};

	const yScale = (value: number) => {
		return padding.top + (chartHeight - padding.top - padding.bottom) * (1 - value / maxValue);
	};

	const barHeight = (value: number) => {
		return ((chartHeight - padding.top - padding.bottom) * value) / maxValue;
	};

	function formatAxisValue(value: number): string {
		const s = value >= 1000 ? value.toLocaleString() : String(value);
		return valuePrefix ? valuePrefix + s : s;
	}

</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
		<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
		<DateRangePicker bind:startDate bind:endDate />
	</div>
	<div class="w-full min-w-0 overflow-visible" bind:this={containerEl}>
		<svg
			class="overflow-visible"
			width="100%"
			height={chartHeight}
			viewBox="0 0 {chartWidth} {chartHeight}"
			preserveAspectRatio="xMidYMid meet"
		>
			{#each Array(5) as _, i}
				{@const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom)}
				<line
					x1={padding.left}
					y1={y}
					x2={chartWidth - padding.right}
					y2={y}
					stroke="#e5e7eb"
					stroke-width="1"
				/>
				{@const value = maxValue - (i / 4) * maxValue}
				<text x={padding.left - 6} y={y + 4} text-anchor="end" class="text-xs fill-gray-500">
					{formatAxisValue(Math.round(value))}
				</text>
			{/each}

			{#each chartData as point, i}
				{@const x = xScale(i, chartWidth)}
				{@const y = yScale(point.value)}
				{@const barH = barHeight(point.value)}
				{@const barW = getBarWidth(chartWidth)}
				<rect {x} {y} width={barW} height={barH} fill={color} rx="4" />
			{/each}

			{#each chartData as point, i}
				{@const barW = getBarWidth(chartWidth)}
				{@const x = xScale(i, chartWidth) + barW / 2}
				<text
					{x}
					y={chartHeight - padding.bottom + 18}
					text-anchor="middle"
					class="text-xs fill-gray-500"
				>
					{point.label}
				</text>
			{/each}
		</svg>
	</div>
</div>
