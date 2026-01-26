<script lang="ts">
	type Category = 'Work' | 'Business' | 'Personal';
	type Status = 'Active' | 'Pending' | 'Completed';

	type Event = {
		id: number;
		title: string;
		date: string;
		category: Category;
		status: Status;
	};

	let events = $state<Event[]>([
		{ id: 1, title: 'Team Meeting', date: '2026-01-25', category: 'Work', status: 'Active' },
		{ id: 2, title: 'Project Review', date: '2026-01-26', category: 'Work', status: 'Pending' },
		{ id: 3, title: 'Client Call', date: '2026-01-27', category: 'Business', status: 'Active' }
	]);

	let searchQuery = $state('');
	let selectedCategory = $state('All');
	let selectedStatus = $state('All');

	const categories = ['All', 'Work', 'Business', 'Personal'];
	const statuses = ['All', 'Active', 'Pending', 'Completed'];

	let filteredEvents = $derived.by<Event[]>(() => {
		return events.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
			const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
			return matchesSearch && matchesCategory && matchesStatus;
		});
	});

	function handleAddEvent() {
		console.log('Add event clicked');
	}

	function handleEdit(id: number) {
		console.log('Edit event:', id);
	}

	function handleDelete(id: number) {
		events = events.filter((e) => e.id !== id);
	}
</script>

<div class="dashboard">
	<header class="header">
		<h1>Event Manager</h1>
		<div class="filters">
			<input type="text" placeholder="Search..." bind:value={searchQuery} class="search-input" />
			<select bind:value={selectedCategory} class="filter-select">
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
			<select bind:value={selectedStatus} class="filter-select">
				{#each statuses as status}
					<option value={status}>{status}</option>
				{/each}
			</select>
		</div>
	</header>

	<div class="actions">
		<button class="add-button" onclick={handleAddEvent}>+ Add Event</button>
	</div>

	<div class="table-container">
		<table class="events-table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Date</th>
					<th>Category</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredEvents as event (event.id)}
					<tr>
						<td>{event.title}</td>
						<td>{event.date}</td>
						<td>{event.category}</td>
						<td>{event.status}</td>
						<td class="actions-cell">
							<button class="action-button" onclick={() => handleEdit(event.id)}>Edit</button>
							<button class="action-button" onclick={() => handleDelete(event.id)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.dashboard {
		background: white;
		min-height: 100vh;
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.header {
		margin-bottom: 20px;
	}

	.header h1 {
		margin: 0 0 16px 0;
		font-size: 24px;
		font-weight: 600;
	}

	.filters {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.search-input,
	.filter-select {
		border: 1px solid #ccc;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 14px;
		background: white;
	}

	.search-input {
		flex: 1;
		min-width: 200px;
	}

	.filter-select {
		min-width: 120px;
	}

	.actions {
		margin-bottom: 20px;
	}

	.add-button {
		background: #333;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer;
	}

	.add-button:hover {
		background: #555;
	}

	.table-container {
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
		background: white;
	}

	.events-table {
		width: 100%;
		border-collapse: collapse;
	}

	.events-table thead {
		background: #f5f5f5;
	}

	.events-table th {
		padding: 12px;
		text-align: left;
		font-weight: 600;
		font-size: 14px;
		border-bottom: 1px solid #ddd;
	}

	.events-table td {
		padding: 12px;
		border-bottom: 1px solid #eee;
		font-size: 14px;
	}

	.events-table tbody tr:last-child td {
		border-bottom: none;
	}

	.actions-cell {
		display: flex;
		gap: 8px;
	}

	.action-button {
		background: #333;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		font-size: 12px;
		cursor: pointer;
	}

	.action-button:hover {
		background: #555;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.dashboard {
			padding: 12px;
		}

		.filters {
			flex-direction: column;
		}

		.search-input,
		.filter-select {
			width: 100%;
			min-width: unset;
		}

		.table-container {
			overflow-x: auto;
		}

		.events-table {
			min-width: 600px;
		}

		.actions-cell {
			flex-direction: column;
		}

		.action-button {
			width: 100%;
		}
	}
</style>
