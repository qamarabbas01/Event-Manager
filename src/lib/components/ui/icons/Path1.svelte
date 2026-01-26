<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="569"
	height="524"
	viewBox="0 0 569 524"
	fill="none"
	class={className}
>
	<path
		d="M2 110.373L65.1178 129.308C77.1608 132.921 90.1228 131.864 101.421 126.348L346.288 6.80041C369.691 -4.62497 397.944 3.82606 411.229 26.2252L475.701 134.927L563.093 327.918C569.872 342.889 568.862 360.235 560.39 374.318L503.909 468.209C498.223 477.661 489.571 484.967 479.301 488.991L395.898 521.664"
		stroke="white"
		stroke-width="4"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-dasharray="20 20"
	/>
</svg>
