<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 40, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 40 40"
	fill="none"
	class={className}
>
	<path
		d="M8.75 35H31.25C31.5815 35 31.8995 34.8683 32.1339 34.6339C32.3683 34.3995 32.5 34.0815 32.5 33.75V6.25C32.5 5.91848 32.3683 5.60054 32.1339 5.36612C31.8995 5.1317 31.5815 5 31.25 5H16.25L7.5 13.75V33.75C7.5 34.0815 7.6317 34.3995 7.86612 34.6339C8.10054 34.8683 8.41848 35 8.75 35Z"
		stroke="#999999"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path d="M16.25 5V13.75H7.5" stroke="#999999" stroke-linecap="round" stroke-linejoin="round" />
	<path
		d="M23.75 22.5L20 18.75L16.25 22.5"
		stroke="#999999"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path d="M20 28.75V18.75" stroke="#999999" stroke-linecap="round" stroke-linejoin="round" />
</svg>
