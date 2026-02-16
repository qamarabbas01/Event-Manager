<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';

	function goToRegister() {
		goto(resolve('/register'));
	}

	function goToEvents() {
		goto(resolve('/events'));
	}

	function goToDashboard() {
		goto(resolve('/dashboard'));
	}
</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
	<header class="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200">
		<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
			<a href={resolve('/')} class="font-semibold text-gray-900 tracking-tight">EventHub</a>

			<nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
				<a href="#features" class="hover:text-gray-900 transition-colors">Features</a>
				<a href="#about" class="hover:text-gray-900 transition-colors">About</a>
				<a href={resolve('/events')} class="hover:text-gray-900 transition-colors">Events</a>
				<a href="#insights" class="hover:text-gray-900 transition-colors">Insights</a>
			</nav>

			<div class="flex items-center gap-3">
				<a
					href={resolve('/login')}
					class="text-sm text-gray-700 hover:text-gray-900 transition-colors"
				>
					Sign In
				</a>
				<Button text="Get Started" variant="primary-blue" rounded="lg" onClick={goToRegister} />
			</div>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4">
		<section class="pt-16 pb-10 text-center">
			<h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
				Welcome to
				<span
					class="inline-flex align-middle mx-2 px-4 py-2 rounded-2xl text-white bg-linear-to-r from-blue-600 to-purple-600 shadow-sm"
					>EventHub</span
				>
			</h1>
			<p class="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
				The all-in-one platform for managing events, tracking attendees, and growing your business
				with powerful analytics.
			</p>

			<div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
				<Button
					text="Go to Dashboard"
					variant="primary-blue"
					rounded="lg"
					size="lg"
					onClick={goToDashboard}
				/>
				<Button
					text="Browse Events"
					variant="default"
					rounded="lg"
					size="lg"
					class="bg-white/80"
					onClick={goToEvents}
				/>
			</div>
		</section>

		<section class="py-10">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
				<div>
					<div class="text-3xl font-extrabold text-gray-900">10K+</div>
					<div class="text-xs uppercase tracking-wide text-gray-500 mt-1">Events Managed</div>
				</div>
				<div>
					<div class="text-3xl font-extrabold text-gray-900">500K+</div>
					<div class="text-xs uppercase tracking-wide text-gray-500 mt-1">Happy Attendees</div>
				</div>
				<div>
					<div class="text-3xl font-extrabold text-gray-900">$5M+</div>
					<div class="text-xs uppercase tracking-wide text-gray-500 mt-1">Revenue Processed</div>
				</div>
				<div>
					<div class="text-3xl font-extrabold text-gray-900">99.9%</div>
					<div class="text-xs uppercase tracking-wide text-gray-500 mt-1">Uptime</div>
				</div>
			</div>
		</section>

		<section id="features" class="py-12">
			<h2 class="text-3xl font-bold text-gray-900 text-center">Everything you need to succeed</h2>
			<p class="text-gray-600 text-center mt-3 max-w-2xl mx-auto">
				Powerful features designed to help you create memorable events and grow your business.
			</p>

			<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"
					>
						<span class="text-sm font-bold">📅</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Event Management</h3>
					<p class="mt-2 text-sm text-gray-600">
						Create, organize, and manage all your events in one centralized platform with ease.
					</p>
				</div>

				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600"
					>
						<span class="text-sm font-bold">👥</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Attendee Insights</h3>
					<p class="mt-2 text-sm text-gray-600">
						Gain deep insights into your audience demographics and engagement patterns.
					</p>
				</div>

				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"
					>
						<span class="text-sm font-bold">📊</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Analytics Dashboard</h3>
					<p class="mt-2 text-sm text-gray-600">
						Track performance metrics, revenue, and booking trends with real-time analytics.
					</p>
				</div>

				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"
					>
						<span class="text-sm font-bold">🔔</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Smart Notifications</h3>
					<p class="mt-2 text-sm text-gray-600">
						Stay informed with intelligent alerts about registrations, capacity, and more.
					</p>
				</div>

				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600"
					>
						<span class="text-sm font-bold">📈</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Revenue Tracking</h3>
					<p class="mt-2 text-sm text-gray-600">
						Monitor ticket sales and revenue streams with comprehensive financial reports.
					</p>
				</div>

				<div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<div
						class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"
					>
						<span class="text-sm font-bold">✨</span>
					</div>
					<h3 class="mt-4 font-semibold text-gray-900">Seamless Experience</h3>
					<p class="mt-2 text-sm text-gray-600">
						Intuitive interface designed for event organizers to work efficiently.
					</p>
				</div>
			</div>
		</section>

		<section id="about" class="py-8">
			<div class="bg-white/70 rounded-2xl border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900">Built for real organizers</h2>
				<p class="mt-2 text-sm text-gray-600 max-w-3xl">
					EventHub helps you manage your own event data (add, edit, delete), monitor performance,
					and keep everything in one place. After you register, you’ll go straight to the dashboard
					to start managing your events.
				</p>
			</div>
		</section>

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
							onClick={goToRegister}
						/>
					</div>
				</div>
			</div>
		</section>
	</main>
</div>
