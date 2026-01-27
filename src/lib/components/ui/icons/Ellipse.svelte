<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 24, class: className = '' }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 43 43"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
>
	<circle cx="21.3652" cy="21.3652" r="21.3652" fill="white" />
</svg>
