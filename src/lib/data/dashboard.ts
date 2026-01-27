export type Category = 'Work' | 'Business' | 'Personal';

export type Status = 'Active' | 'Pending' | 'Completed';

export type TableAction = 'edit' | 'delete';

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

export const categories = ['All', 'Work', 'Business', 'Personal'] as const;

export const statuses = ['All', 'Active', 'Pending', 'Completed'] as const;

const ACTION_ATTRIBUTES = {
	ACTION: 'data-action',
	EVENT_ID: 'data-event-id'
} as const;

const ICON_SIZE = 18;

function createEditIcon(): string {
	return `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="${ICON_SIZE}"
		height="${ICON_SIZE}"
		viewBox="0 0 24 24"
		fill="none"
		stroke="black"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="text-black"
	>
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
	</svg>`;
}

function createDeleteIcon(): string {
	return `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="${ICON_SIZE}"
		height="${ICON_SIZE}"
		viewBox="0 0 24 24"
		fill="none"
		stroke="red"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="text-red-500"
	>
		<polyline points="3 6 5 6 21 6" />
		<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
		<path d="M10 11v6" />
		<path d="M14 11v6" />
		<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
	</svg>`;
}

function createActionButton(
	action: TableAction,
	eventId: number,
	icon: string
): string {
	return `<button
		class="text-white rounded text-xs cursor-pointer"
		${ACTION_ATTRIBUTES.ACTION}="${action}"
		${ACTION_ATTRIBUTES.EVENT_ID}="${eventId}"
		aria-label="${action} event ${eventId}"
	>
		${icon}
	</button>`;
}

function renderActionsColumn(row: DashboardTableRow): string {
	const eventId = Number(row.id);
	if (isNaN(eventId)) {
		return '';
	}

	const editButton = createActionButton('edit', eventId, createEditIcon());
	const deleteButton = createActionButton('delete', eventId, createDeleteIcon());

	return `<div class="flex gap-3 flex-col md:flex-row" ${ACTION_ATTRIBUTES.EVENT_ID}="${eventId}">
		${editButton}
		${deleteButton}
	</div>`;
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

export const tableColumns: DashboardTableColumn[] = [
	{ label: 'Title', key: 'title' },
	{ label: 'Date', key: 'date' },
	{ label: 'Category', key: 'category' },
	{ label: 'Status', key: 'status' },
	{
		label: 'Actions',
		key: 'actions',
		render: renderActionsColumn
	}
];
