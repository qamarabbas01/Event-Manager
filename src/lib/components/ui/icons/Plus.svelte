<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 8, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 8 8"
	fill="currentColor"
	class={className}
>
	<path d="M4 0.5V7.5M0.5 4H7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
</svg>
