<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 10, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 6 10"
	fill="none"
	class={className}
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M5.52636 4.68422C5.70078 4.85864 5.70078 5.14138 5.52636 5.3158L0.972954 9.86919C0.798535 10.0436 0.515797 10.0436 0.341379 9.86919L0.130814 9.65865C-0.0436047 9.48424 -0.0436047 9.20146 0.130814 9.02704L4.15787 5.00001L0.130814 0.972954C-0.0436051 0.798535 -0.0436051 0.515798 0.130814 0.341378L0.341378 0.130814C0.515797 -0.0436049 0.798535 -0.0436049 0.972954 0.130814L5.52636 4.68422Z"
		fill="currentColor"
	/>
</svg>
