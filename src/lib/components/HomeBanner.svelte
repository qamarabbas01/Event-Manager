<script lang="ts">
	import Button from './ui/Button.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { homePage } from '$lib/data/home';

	const { insights } = homePage;
</script>

<section id="insights" class="pb-20 pt-4">
	<div
		class="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900 p-8 sm:p-12 shadow-xl"
	>
		<div
			class="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl"
			aria-hidden="true"
		></div>
		<div class="relative text-center max-w-2xl mx-auto">
			<h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">{insights.title}</h2>
			<p class="mt-3 text-base sm:text-lg text-white/90">{insights.subtitle}</p>
			<div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<Button
					text={insights.cta}
					variant="white"
					rounded="lg"
					size="lg"
					onClick={() => goto(resolve('/register'))}
				/>
			</div>
		</div>
	</div>
</section>
