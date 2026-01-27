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
	height={(size * 120) / 155}
	viewBox="0 0 155 120"
	fill="none"
	class={className}
>
	<path
		d="M68.6606 2.97991C73.8337 -0.993504 81.0316 -0.993497 86.2047 2.97992L149.209 51.3728C160.118 59.752 154.192 77.1941 140.437 77.1941H14.4284C0.672749 77.1941 -5.25271 59.7519 5.65639 51.3728L68.6606 2.97991Z"
		fill="white"
	/>
	<rect x="20" y="50" width="120" height="300" rx="12" fill="white" />
</svg>
