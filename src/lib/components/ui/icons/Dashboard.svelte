<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 24, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	class={className}
>
	<rect x="3" y="3" width="7" height="7" />
	<rect x="14" y="3" width="7" height="7" />
	<rect x="3" y="14" width="7" height="7" />
	<rect x="14" y="14" width="7" height="7" />
</svg>
