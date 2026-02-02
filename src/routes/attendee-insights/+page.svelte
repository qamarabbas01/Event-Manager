<script lang="ts">
	import PieChart from '$lib/components/ui/PieChart.svelte';
	import BarChart from '$lib/components/ui/BarChart.svelte';
	import LineChart from '$lib/components/ui/LineChart.svelte';
	import {
		attendeeInsightsPage,
		ageDistributionData,
		topLocationsData,
		engagementTrendsData,
		interestCategoriesData,
		attendeeInsightsChartColors
	} from '$lib/data/dashboard';
</script>

<div class="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
	<div class="max-w-full flex flex-col gap-6">
		<header>
			<h1 class="text-3xl font-bold text-gray-800">{attendeeInsightsPage.title}</h1>
			<p class="text-gray-600 mt-1">{attendeeInsightsPage.subtitle}</p>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<PieChart
				title={attendeeInsightsPage.charts.ageDistribution}
				data={ageDistributionData}
				colors={[...attendeeInsightsChartColors.ageDistribution]}
				size={240}
			/>
			<BarChart
				title={attendeeInsightsPage.charts.topLocations}
				data={topLocationsData}
				height={280}
				color="#8B5CF6"
				showDatePicker={false}
			/>
			<LineChart
				title={attendeeInsightsPage.charts.engagementTrends}
				data={engagementTrendsData}
				height={280}
				color="#9333ea"
				showDatePicker={false}
			/>
			<PieChart
				title={attendeeInsightsPage.charts.interestCategories}
				data={interestCategoriesData}
				colors={[...attendeeInsightsChartColors.interestCategories]}
				size={240}
			/>
		</div>
	</div>
</div>
