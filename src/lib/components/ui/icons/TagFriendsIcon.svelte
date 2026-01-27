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
	<circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" />
	<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" />
	<circle cx="17" cy="11" r="4" stroke="currentColor" stroke-width="2" />
	<path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" />
</svg>

