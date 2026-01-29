<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SelectDropdown from '$lib/components/ui/SelectDropdown.svelte';
	import type { Category, Status } from '$lib/data/dashboard';
	import type { Event } from '$lib/data/dashboard';

	const categoryOptions = ['Work', 'Business', 'Personal'] as const;
	const statusOptions = ['Active', 'Pending', 'Completed'] as const;

	type EventPayload = {
		title: string;
		date: string;
		category: Category;
		status: Status;
	};

	interface Props {
		open?: boolean;
		eventToEdit?: Event | null;
		onClose?: () => void;
		onAdd?: (event: EventPayload) => void;
		onEdit?: (id: number, event: EventPayload) => void;
	}

	let { open = $bindable(false), eventToEdit = null, onClose, onAdd, onEdit }: Props = $props();

	let title = $state('');
	let date = $state('');
	let category = $state<Category>('Work');
	let status = $state<Status>('Pending');

	const isEditMode = $derived(open && eventToEdit != null);
	const modalTitle = $derived(isEditMode ? 'Edit Event' : 'Add Event');
	const submitButtonText = $derived(isEditMode ? 'Save' : 'Add Event');

	function resetForm() {
		title = '';
		date = '';
		category = 'Work';
		status = 'Pending';
	}

	function handleClose() {
		resetForm();
		onClose?.();
	}

	$effect(() => {
		if (!open) return;
		if (eventToEdit) {
			title = eventToEdit.title;
			date = eventToEdit.date;
			category = eventToEdit.category;
			status = eventToEdit.status;
		} else {
			resetForm();
		}
	});

	function handleSubmit() {
		const trimmedTitle = title.trim();
		if (!trimmedTitle) return;
		const dateStr = date || new Date().toISOString().slice(0, 10);
		const payload: EventPayload = {
			title: trimmedTitle,
			date: dateStr,
			category,
			status
		};
		if (isEditMode && eventToEdit) {
			onEdit?.(eventToEdit.id, payload);
		} else {
			onAdd?.(payload);
		}
		resetForm();
		open = false;
	}
</script>

<Modal bind:open title={modalTitle} onClose={handleClose} class="max-w-full">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-4"
	>
		<div>
			<label for="add-event-title" class="block text-sm font-medium text-[#59452B] mb-1">
				Title
			</label>
			<Input id="add-event-title" bind:value={title} placeholder="Event title" class="w-full" />
		</div>
		<div>
			<label for="add-event-date" class="block text-sm font-medium text-[#59452B] mb-1">
				Date
			</label>
			<input
				id="add-event-date"
				type="date"
				bind:value={date}
				class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
			/>
		</div>
		<div role="group" aria-labelledby="add-event-category-label" class="w-full">
			<span id="add-event-category-label" class="block text-sm font-medium text-[#59452B] mb-1"
				>Category</span
			>
			<SelectDropdown
				options={[...categoryOptions]}
				bind:value={category}
				placeholder="Select category"
				class="w-full md:w-full!"
			/>
		</div>
		<div role="group" aria-labelledby="add-event-status-label" class="w-full">
			<span id="add-event-status-label" class="block text-sm font-medium text-[#59452B] mb-1"
				>Status</span
			>
			<SelectDropdown
				options={[...statusOptions]}
				bind:value={status}
				placeholder="Select status"
				class="w-full md:w-full!"
			/>
		</div>
		<div class="flex gap-3 justify-end pt-2">
			<Button
				text="Cancel"
				variant="light-gray"
				size="default"
				onClick={handleClose}
				type="button"
			/>
			<Button text={submitButtonText} variant="default" size="default" type="submit" />
		</div>
	</form>
</Modal>
