<script lang="ts">
	interface DataPoint {
		label: string;
		value: number;
	}

	interface Props {
		title: string;
		data: DataPoint[];
		height?: number;
		color?: string;
	}

	let { title, data, height = 200, color = '#3b82f6' }: Props = $props();
				
	const padding = { top: 20, right: 20, bottom: 40, left: 40 };
	const chartHeight = $derived(height);

	const maxValue = $derived(Math.max(...data.map((d) => d.value), 0));
	const minValue = $derived(Math.min(...data.map((d) => d.value), 0));
	const valueRange = $derived(maxValue - minValue || 1);

	const xScale = (index: number, width: number) => {
		return padding.left + (index / (data.length - 1 || 1)) * (width - padding.left - padding.right);
	};

	const yScale = (value: number) => {
		return (
			padding.top +
			(chartHeight - padding.top - padding.bottom) * (1 - (value - minValue) / valueRange)
		);
	};

	const getLinePath = (width: number) => {
		if (data.length === 0) return '';
		const points = data.map((d, i) => `${xScale(i, width)},${yScale(d.value)}`);
		return `M ${points.join(' L ')}`;
	};

	const getAreaPath = (width: number) => {
		if (data.length === 0) return '';
		const points = data.map((d, i) => `${xScale(i, width)},${yScale(d.value)}`);
		const firstX = xScale(0, width);
		const lastX = xScale(data.length - 1, width);
		const bottomY = chartHeight - padding.bottom;
		return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
	};
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
	<div class="w-full overflow-x-auto">
		<svg width="100%" height={chartHeight} viewBox="0 0 400 {chartHeight}" preserveAspectRatio="xMidYMid meet" class="min-w-[400px]">
			<path d={getAreaPath(400)} fill={color} opacity="0.1" />

			{#each Array(5) as _, i}
				{@const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom)}
				<line
					x1={padding.left}
					y1={y}
					x2={400 - padding.right}
					y2={y}
					stroke="#e5e7eb"
					stroke-width="1"
				/>
				{@const value = maxValue - (i / 4) * valueRange}
				<text
					x={padding.left - 10}
					y={y + 4}
					text-anchor="end"
					class="text-xs fill-gray-500"
				>
					{Math.round(value)}
				</text>
			{/each}

			<path
				d={getLinePath(400)}
				fill="none"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>

			{#each data as point, i}
				{@const x = xScale(i, 400)}
				{@const y = yScale(point.value)}
				<circle cx={x} cy={y} r="4" fill={color} />
			{/each}

			{#each data as point, i}
				{@const x = xScale(i, 400)}
				<text
					x={x}
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
