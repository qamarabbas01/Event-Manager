<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 16, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	class={className}
>
	<path
		d="M14.674 7.52457L1.12484 7.52457"
		stroke="#59452B"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M6.77473 14.2991L1.41436 8.93867C0.633318 8.15762 0.633329 6.89129 1.41438 6.11025L6.77473 0.749989"
		stroke="#59452B"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
