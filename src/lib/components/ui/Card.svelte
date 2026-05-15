<script lang="ts">
	interface Props {
		title: string;
		description: string;
		icon: string;
	}

	let { title, description, icon }: Props = $props();
</script>

<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
	<div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
		<span class="text-sm font-bold">{icon}</span>
	</div>
	<h3 class="mt-4 font-semibold text-gray-900">{title}</h3>
	<p class="mt-2 text-sm text-gray-600">
		{description}
	</p>
</div>
