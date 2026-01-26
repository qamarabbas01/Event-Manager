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
	<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
	<circle cx="8" cy="9" r="1.5" fill="currentColor" />
	<circle cx="16" cy="9" r="1.5" fill="currentColor" />
	<path
		d="M8 14c1.5 2 4.5 2 6 0"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
	/>
</svg>

