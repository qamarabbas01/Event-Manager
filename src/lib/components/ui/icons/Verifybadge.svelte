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
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
>
	<path
		d="M0 7.56279V0.667637C0 0.15479 0.554866 -0.166004 0.99931 0.0898887L5.51329 2.68885L5.56587 2.67603C7.18298 2.28164 8.87169 2.28604 10.4867 2.68885L15.0007 0.0898891C15.4451 -0.166004 16 0.15479 16 0.667637L16 7.56279C16 11.805 12.561 15.244 8.31881 15.244H7.6812C3.43899 15.244 0 11.805 0 7.56279Z"
		fill="currentColor"
	/>
</svg>
