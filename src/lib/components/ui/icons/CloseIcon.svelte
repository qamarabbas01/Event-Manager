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
	class={className}
>
	<path
		d="M5.25 5.25L18.75 18.75"
		stroke="#999999"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M5.25 18.75L18.75 5.25"
		stroke="#999999"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
