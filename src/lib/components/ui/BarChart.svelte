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

	let { title, data, height = 200, color = '#9333ea' }: Props = $props();

	const padding = { top: 20, right: 20, bottom: 40, left: 50 };
	const chartWidth = 400;
	const chartHeight = $derived(height);

	const maxValue = $derived(Math.max(...data.map((d) => d.value), 0));
	const getBarWidth = (width: number) => (width - padding.left - padding.right) / data.length - 4;

	const xScale = (index: number, width: number) => {
		return padding.left + index * ((width - padding.left - padding.right) / data.length);
	};

	const yScale = (value: number) => {
		return (
			padding.top +
			(chartHeight - padding.top - padding.bottom) * (1 - value / maxValue)
		);
	};

	const barHeight = (value: number) => {
		return ((chartHeight - padding.top - padding.bottom) * value) / maxValue;
	};
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
	<div class="w-full overflow-x-auto">
		<svg width="100%" height={chartHeight} viewBox="0 0 400 {chartHeight}" preserveAspectRatio="xMidYMid meet" class="min-w-[400px]">
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
				{@const value = maxValue - (i / 4) * maxValue}
				<text
					x={padding.left - 10}
					y={y + 4}
					text-anchor="end"
					class="text-xs fill-gray-500"
				>
					{Math.round(value)}
				</text>
			{/each}

			{#each data as point, i}
				{@const x = xScale(i, 400) + 2}
				{@const y = yScale(point.value)}
				{@const height = barHeight(point.value)}
				{@const width = getBarWidth(400)}
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					fill={color}
					rx="4"
				/>
			{/each}

			{#each data as point, i}
				{@const x = xScale(i, 400) + getBarWidth(400) / 2 + 2}
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
