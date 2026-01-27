<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 16, class: className = '' }: Props = $props();
</script>

<div class="h-[24px] w-[24px] rounded-full bg-brand-orange {className}"></div>
