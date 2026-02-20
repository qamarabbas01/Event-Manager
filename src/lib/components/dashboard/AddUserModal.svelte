<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import SelectDropdown from '$lib/components/ui/SelectDropdown.svelte';
	import { addUserModal, type UserRole } from '$lib/data/dashboard';

	const roleDisplayOptions = [
		addUserModal.roleAdmin,
		addUserModal.roleUser,
		addUserModal.roleTester
	] as const;
	const roleValueMap: Record<(typeof roleDisplayOptions)[number], UserRole> = {
		Admin: 'admin',
		User: 'user',
		Tester: 'tester'
	};

	export interface AddUserPayload {
		name: string;
		email: string;
		role: UserRole;
	}

	export interface UserToEdit {
		id: string;
		name: string;
		email: string;
		role: UserRole;
	}

	interface Props {
		open?: boolean;
		userToEdit?: UserToEdit | null;
		onClose?: () => void;
		onAdd?: (user: AddUserPayload) => void;
		onEdit?: (id: string, user: AddUserPayload) => void;
	}

	let { open = $bindable(false), userToEdit = null, onClose, onAdd, onEdit }: Props = $props();

	let name = $state('');
	let email = $state('');
	let roleDisplay = $state<(typeof roleDisplayOptions)[number]>(addUserModal.roleUser);

	const isEditMode = $derived(open && userToEdit != null);
	const modalTitle = $derived(isEditMode ? addUserModal.editUserTitle : addUserModal.title);
	const submitButtonText = $derived(
		isEditMode ? addUserModal.saveButtonText : addUserModal.addButtonText
	);

	function resetForm() {
		name = '';
		email = '';
		roleDisplay = addUserModal.roleUser;
	}

	function handleClose() {
		resetForm();
		onClose?.();
	}

	$effect(() => {
		if (!open) return;
		if (userToEdit) {
			name = userToEdit.name;
			email = userToEdit.email;
			roleDisplay = userToEdit.role === 'admin' ? addUserModal.roleAdmin : addUserModal.roleUser;
		} else {
			resetForm();
		}
	});

	function handleSubmit() {
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		if (!trimmedName || !trimmedEmail) return;
		const role = roleValueMap[roleDisplay] ?? 'user';
		const payload: AddUserPayload = { name: trimmedName, email: trimmedEmail, role };
		if (isEditMode && userToEdit) {
			onEdit?.(userToEdit.id, payload);
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
			<label
				for="add-user-name"
				class="block text-sm font-medium text-[#59452B] dark:text-amber-200 mb-1"
			>
				{addUserModal.nameLabel}
			</label>
			<Input
				id="add-user-name"
				bind:value={name}
				placeholder={addUserModal.namePlaceholder}
				class="w-full"
			/>
		</div>
		<div>
			<label
				for="add-user-email"
				class="block text-sm font-medium text-[#59452B] dark:text-amber-200 mb-1"
			>
				{addUserModal.emailLabel}
			</label>
			<Input
				id="add-user-email"
				bind:value={email}
				type="email"
				placeholder={addUserModal.emailPlaceholder}
				class="w-full"
			/>
		</div>
		<div role="group" aria-labelledby="add-user-role-label" class="w-full">
			<span
				id="add-user-role-label"
				class="block text-sm font-medium text-[#59452B] dark:text-amber-200 mb-1"
			>
				{addUserModal.roleLabel}
			</span>
			<SelectDropdown
				options={[...roleDisplayOptions]}
				bind:value={roleDisplay}
				placeholder={addUserModal.selectRolePlaceholder}
				class="w-full md:w-full!"
			/>
		</div>
		<div class="flex gap-3 justify-end pt-2">
			<Button
				text={addUserModal.cancelButtonText}
				variant="light-gray"
				size="default"
				onClick={handleClose}
				type="button"
			/>
			<Button text={submitButtonText} variant="default" size="default" type="submit" />
		</div>
	</form>
</Modal>
