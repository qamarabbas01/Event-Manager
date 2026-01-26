<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 19, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 19 18"
	fill="none"
	class={className}
>
	<path
		d="M0.75 8.75L16.75 8.75"
		stroke="#030D26"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M10.0781 16.75L16.6639 10.1641C17.445 9.38304 17.445 8.11671 16.6639 7.33567L10.0781 0.75"
		stroke="#030D26"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
