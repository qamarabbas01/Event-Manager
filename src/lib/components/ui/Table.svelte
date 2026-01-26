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
			<tr>
				<td> title </td>
				<td> date </td>
				<td> category </td>
				<td> status </td>
				<td class="actions-cell">
					<button class="action-button">Edit</button>
					<button class="action-button">Delete</button>
				</td>
			</tr>
		</tbody>
	</table>
</div>


<style>
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
</style>