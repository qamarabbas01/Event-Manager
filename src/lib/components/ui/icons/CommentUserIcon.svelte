<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 26, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 26 26"
	fill="none"
	class={className}
>
	<circle cx="13" cy="9" r="4" stroke="currentColor" stroke-width="2" />
	<path
		d="M7 23v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
		stroke="currentColor"
		stroke-width="2"
	/>
</svg>

