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
	height="11"
	viewBox="0 0 19 11"
	fill="none"
	class={className}
>
	<path
		d="M17.625 9.75L9.5 1.625L1.375 9.75"
		stroke="black"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
