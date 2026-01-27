<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 20, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 20 21"
	fill="none"
	class={className}
>
	<circle cx="11.8311" cy="8" r="7.5" stroke="#030D26" />
	<line x1="6.74033" y1="13.5088" x2="0.353852" y2="19.8972" stroke="#030D26" />
</svg>
