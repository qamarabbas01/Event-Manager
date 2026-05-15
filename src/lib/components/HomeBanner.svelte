<script>
	import Button from './ui/Button.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<section id="insights" class="pb-16 pt-8">
	<div class="rounded-3xl bg-linear-to-r from-blue-600 to-purple-600 text-white p-10 shadow-xl">
		<div class="text-center">
			<h2 class="text-3xl font-bold">Ready to transform your events?</h2>
			<p class="mt-2 text-white/90">Join thousands of event organizers who trust EventHub.</p>
			<div class="mt-6 flex justify-center">
				<Button
					text="Get Started Now"
					variant="white"
					rounded="lg"
					size="lg"
					onClick={() => goto(resolve('/register'))}
				/>
			</div>
		</div>
	</div>
</section>
