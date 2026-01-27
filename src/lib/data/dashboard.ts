export type Category = 'Work' | 'Business' | 'Personal';
export type Status = 'Active' | 'Pending' | 'Completed';

export interface Event {
	id: number;
	title: string;
	date: string;
	category: Category;
	status: Status;
}

export interface DashboardTableRow {
	id: string | number;
	[key: string]: string | number | boolean | null | undefined;
}

export interface DashboardTableColumn {
	label: string;
	key: string;
	class?: string;
	render?: (row: DashboardTableRow) => string;
}

export const initialEvents: Event[] = [
	{ id: 1, title: 'Team Meeting', date: '2026-01-25', category: 'Work', status: 'Active' },
	{ id: 2, title: 'Project Review', date: '2026-01-26', category: 'Work', status: 'Pending' },
	{ id: 3, title: 'Client Call', date: '2026-01-27', category: 'Business', status: 'Active' },
	{ id: 4, title: 'Design Sprint', date: '2026-02-01', category: 'Work', status: 'Completed' },
	{ id: 5, title: 'Birthday Party', date: '2026-02-03', category: 'Personal', status: 'Active' },
	{ id: 6, title: 'Sales Meeting', date: '2026-02-04', category: 'Business', status: 'Pending' },
	{ id: 7, title: 'Doctor Appointment', date: '2026-02-08', category: 'Personal', status: 'Completed' },
	{ id: 8, title: 'Team Building', date: '2026-02-10', category: 'Work', status: 'Pending' },
	{ id: 9, title: 'Quarterly Planning', date: '2026-02-14', category: 'Business', status: 'Active' },
	{ id: 10, title: 'Performance Review', date: '2026-02-17', category: 'Work', status: 'Completed' },
	{ id: 11, title: 'Family Dinner', date: '2026-02-19', category: 'Personal', status: 'Pending' },
	{ id: 12, title: 'Strategy Call', date: '2026-02-20', category: 'Business', status: 'Active' },
	{ id: 13, title: 'Networking Event', date: '2026-02-23', category: 'Business', status: 'Pending' },
	{ id: 14, title: 'Yoga Class', date: '2026-02-25', category: 'Personal', status: 'Active' },
	{ id: 15, title: 'Product Launch', date: '2026-03-01', category: 'Business', status: 'Completed' },
	{ id: 16, title: 'All Hands', date: '2026-03-03', category: 'Work', status: 'Active' },
	{ id: 17, title: 'Lunch with CEO', date: '2026-03-07', category: 'Business', status: 'Pending' },
	{ id: 18, title: 'Parent-Teacher Meeting', date: '2026-03-10', category: 'Personal', status: 'Completed' },
	{ id: 19, title: 'Sprint Demo', date: '2026-03-12', category: 'Work', status: 'Pending' },
	{ id: 20, title: 'Anniversary', date: '2026-03-15', category: 'Personal', status: 'Active' },
	{ id: 21, title: 'Board Meeting', date: '2026-03-17', category: 'Business', status: 'Active' },
	{ id: 22, title: 'Retrospective', date: '2026-03-20', category: 'Work', status: 'Completed' }
];

export const categories = ['All', 'Work', 'Business', 'Personal'];
export const statuses = ['All', 'Active', 'Pending', 'Completed'];


export const tableColumns: DashboardTableColumn[] = [
	{ label: 'Title', key: 'title' },
	{ label: 'Date', key: 'date' },
	{ label: 'Category', key: 'category' },
	{ label: 'Status', key: 'status' },
	{
		label: 'Actions',
		key: 'actions',
		render: (row) => {
			const eventId = row.id as number;
			return `
				<div class="flex gap-2 flex-col md:flex-row" data-event-id="${eventId}">
					<button
						class="bg-gray-800 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-gray-600 w-full md:w-auto action-edit"
						data-action="edit"
						data-event-id="${eventId}"
					>
						Edit
					</button>
					<button
						class="bg-gray-800 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-gray-600 w-full md:w-auto action-delete"
						data-action="delete"
						data-event-id="${eventId}"
					>
						Delete
					</button>
				</div>
			`;
		}
	}
];
