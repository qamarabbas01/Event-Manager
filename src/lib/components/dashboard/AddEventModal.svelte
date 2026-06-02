<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SelectDropdown from '$lib/components/ui/SelectDropdown.svelte';
	import { addEventModal, type Category, type Status } from '$lib/data/dashboard';
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
	let error = $state<string | null>(null);
	const canSubmit = $derived(title.trim() !== '');

	const isEditMode = $derived(open && eventToEdit != null);
	const modalTitle = $derived(
		isEditMode ? addEventModal.editEventText : addEventModal.addEventText
	);
	const submitButtonText = $derived(
		isEditMode ? addEventModal.saveButtonText : addEventModal.addEventText
	);

	function resetForm() {
		title = '';
		date = '';
		category = 'Work';
		status = 'Pending';
		error = null;
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
		error = null;
		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			error = 'Event title is required.';
			return;
		}
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
		{#if error}
			<p
				class="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2.5"
				role="alert"
			>
				{error}
			</p>
		{/if}
		<div>
			<label
				for="add-event-title"
				class="block text-sm font-medium text-[#59452B] dark:text-white mb-1"
			>
				{addEventModal.titleLabel}
			</label>
			<Input
				id="add-event-title"
				bind:value={title}
				placeholder={addEventModal.eventTitlePlaceholder}
				class="w-full dark:bg-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
			/>
		</div>
		<div>
			<label
				for="add-event-date"
				class="block text-sm font-medium text-[#59452B] dark:text-white mb-1"
			>
				{addEventModal.dateLabel}
			</label>
			<input
				id="add-event-date"
				type="date"
				bind:value={date}
				class="w-full border border-gray-300 dark:border-gray-500 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-amber-500/50 focus:border-transparent"
			/>
		</div>
		<div role="group" aria-labelledby="add-event-category-label" class="w-full">
			<span
				id="add-event-category-label"
				class="block text-sm font-medium text-[#59452B] dark:text-white mb-1"
				>{addEventModal.categoryLabel}</span
			>
			<SelectDropdown
				options={[...categoryOptions]}
				bind:value={category}
				placeholder={addEventModal.selectCategoryPlaceholder}
				class="w-full md:w-full!"
			/>
		</div>
		<div role="group" aria-labelledby="add-event-status-label" class="w-full">
			<span
				id="add-event-status-label"
				class="block text-sm font-medium text-[#59452B] dark:text-white mb-1"
				>{addEventModal.statusLabel}</span
			>
			<SelectDropdown
				options={[...statusOptions]}
				bind:value={status}
				placeholder={addEventModal.selectStatusPlaceholder}
				class="w-full md:w-full!"
			/>
		</div>
		<div class="flex gap-3 justify-end pt-2">
			<Button
				text={addEventModal.cancelButtonText}
				variant="light-gray"
				size="default"
				onClick={handleClose}
				type="button"
			/>
			<Button text={submitButtonText} variant="default" size="default" type="submit" disabled={!canSubmit} />
		</div>
	</form>
</Modal>
