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
	}

	let { title, data, height = 200, color = '#3b82f6', baseYear = 2024 }: Props = $props();

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

	const padding = { top: 20, right: 20, bottom: 40, left: 40 };
	const chartHeight = $derived(height);

	const maxValue = $derived(Math.max(...chartData.map((d) => d.value), 0));
	const minValue = $derived(Math.min(...chartData.map((d) => d.value), 0));
	const valueRange = $derived(maxValue - minValue || 1);

	const xScale = (index: number, width: number) => {
		return (
			padding.left +
			(index / (chartData.length - 1 || 1)) * (width - padding.left - padding.right)
		);
	};

	const yScale = (value: number) => {
		return (
			padding.top +
			(chartHeight - padding.top - padding.bottom) * (1 - (value - minValue) / valueRange)
		);
	};

	const getLinePath = (width: number) => {
		if (chartData.length === 0) return '';
		const points = chartData.map((d, i) => `${xScale(i, width)},${yScale(d.value)}`);
		return `M ${points.join(' L ')}`;
	};

	const getAreaPath = (width: number) => {
		if (chartData.length === 0) return '';
		const points = chartData.map((d, i) => `${xScale(i, width)},${yScale(d.value)}`);
		const firstX = xScale(0, width);
		const lastX = xScale(chartData.length - 1, width);
		const bottomY = chartHeight - padding.bottom;
		return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
	};
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
		<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
		<DateRangePicker bind:startDate bind:endDate />
	</div>
	<div class="w-full" bind:this={containerEl}>
		<svg
			width="100%"
			height={chartHeight}
			viewBox="0 0 {chartWidth} {chartHeight}"
			preserveAspectRatio="xMidYMid meet"
		>
			<path d={getAreaPath(chartWidth)} fill={color} opacity="0.1" />

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
				{@const value = maxValue - (i / 4) * valueRange}
				<text x={padding.left - 10} y={y + 4} text-anchor="end" class="text-xs fill-gray-500">
					{Math.round(value)}
				</text>
			{/each}

			<path
				d={getLinePath(chartWidth)}
				fill="none"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>

			{#each chartData as point, i}
				{@const x = xScale(i, chartWidth)}
				{@const y = yScale(point.value)}
				<circle cx={x} cy={y} r="4" fill={color} />
			{/each}

			{#each chartData as point, i}
				{@const x = xScale(i, chartWidth)}
				<text
					{x}
					y={chartHeight - padding.bottom + 20}
					text-anchor="middle"
					class="text-xs fill-gray-500"
				>
					{point.label}
				</text>
			{/each}
		</svg>
	</div>
</div>
