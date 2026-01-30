<script lang="ts">
	interface DataPoint {
		label: string;
		value: number;
	}

	interface Props {
		title: string;
		data: DataPoint[];
		colors?: readonly string[] | string[];
		size?: number;
		thickness?: number;
		labelPosition?: 'inside' | 'outside';
		showLegend?: boolean;
	}

	const DEFAULT_COLORS = ['#3b82f6', '#9333ea', '#ec4899', '#f97316', '#22c55e'];

	let {
		title,
		data,
		colors = DEFAULT_COLORS,
		size = 220,
		thickness = 40,
		labelPosition = 'inside',
		showLegend = true
	}: Props = $props();

	const total = $derived(data.reduce((sum, d) => sum + d.value, 0) || 1);

	const segments = $derived(
		data.map((d, i) => ({
			...d,
			percent: (d.value / total) * 100,
			color: colors[i % colors.length]
		}))
	);

	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const radius = $derived((size - thickness) / 2);

	function polarToCartesian(
		cx: number,
		cy: number,
		r: number,
		angleDeg: number
	): { x: number; y: number } {
		const rad = (angleDeg - 90) * (Math.PI / 180);
		return {
			x: cx + r * Math.cos(rad),
			y: cy + r * Math.sin(rad)
		};
	}

	function describeArc(startAngle: number, endAngle: number): string {
		const start = polarToCartesian(cx, cy, radius, startAngle);
		const end = polarToCartesian(cx, cy, radius, endAngle);
		const largeArc = endAngle - startAngle > 180 ? 1 : 0;

		return `M ${start.x} ${start.y}
				A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
	}

	const segmentAngles = $derived.by(() => {
		let current = 0;
		return segments.map((s) => {
			const startAngle = current;
			const angle = (s.value / total) * 360;
			current += angle;
			return { ...s, startAngle, endAngle: current };
		});
	});

	function getLabelPosition(startAngle: number, endAngle: number) {
		const midAngle = (startAngle + endAngle) / 2;
		const labelRadius =
			labelPosition === 'inside'
				? radius
				: radius + thickness + 12;
		const pos = polarToCartesian(cx, cy, labelRadius, midAngle);

		return {
			x: pos.x,
			y: pos.y,
			anchor: 'middle' as const
		};
	}
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

	<div class="flex flex-col items-center">
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} class="shrink-0 overflow-visible">
			{#each segmentAngles as seg}
				{@const path = describeArc(seg.startAngle, seg.endAngle)}
				{@const pos = getLabelPosition(seg.startAngle, seg.endAngle)}

				<path
					d={path}
					fill="none"
					stroke={seg.color}
					stroke-width={thickness}
					stroke-linecap="round"
				/>

				<text
					x={pos.x}
					y={pos.y}
					text-anchor={pos.anchor}
					dominant-baseline="middle"
					class="text-xs font-semibold fill-black"
				>
					{Math.round(seg.percent)}%
				</text>
			{/each}
		</svg>

		{#if showLegend}
			<div class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4">
				{#each segmentAngles as seg}
					<div class="flex items-center gap-2">
						<span
							class="shrink-0 w-2.5 h-2.5 rounded-full"
							style="background-color: {seg.color}"
						></span>
						<span class="text-xs text-gray-600">{seg.label}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
