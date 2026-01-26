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
		d="M0.75 7.52457L14.2991 7.52457"
		stroke="#59452B"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M8.64923 14.2991L14.0096 8.93867C14.7906 8.15762 14.7906 6.89129 14.0096 6.11025L8.64923 0.749989"
		stroke="#59452B"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
