<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import AddUserModal from '$lib/components/dashboard/AddUserModal.svelte';
	import { userStore } from '$lib/stores/user';
	import { profilePage, profilePlaceholder, addUserModal } from '$lib/data/dashboard';
	import type { UserRole } from '$lib/data/dashboard';

	let name = $state(profilePlaceholder.name);
	let email = $state(profilePlaceholder.email);
	let phone = $state(profilePlaceholder.phone);
	let isEditing = $state(false);
	let addUserModalOpen = $state(false);
	let userToEdit = $state<{ id: string; name: string; email: string; role: UserRole } | null>(null);
	let addedUsers = $state<{ id: string; name: string; email: string; role: UserRole }[]>([]);

	const isAdmin = $derived($userStore.role === 'admin');

	function getInitials(fullName: string): string {
		return fullName
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}

	function handleAddUser(payload: { name: string; email: string; role: UserRole }) {
		addedUsers = [...addedUsers, { id: crypto.randomUUID(), ...payload }];
	}

	function handleEditUser(id: string, payload: { name: string; email: string; role: UserRole }) {
		addedUsers = addedUsers.map((u) => (u.id === id ? { ...u, ...payload } : u));
		userToEdit = null;
	}

	function handleDeleteUser(id: string) {
		addedUsers = addedUsers.filter((u) => u.id !== id);
		if (userToEdit?.id === id) userToEdit = null;
	}

	function openEditModal(user: { id: string; name: string; email: string; role: UserRole }) {
		userToEdit = user;
		addUserModalOpen = true;
	}

	function closeUserModal() {
		addUserModalOpen = false;
		userToEdit = null;
	}
</script>

<div class="min-h-screen bg-[#F8FAFC] dark:bg-[#1D232A] p-4 md:p-6 transition-colors">
	<div class="space-y-6">
		<header>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-white">{profilePage.title}</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-1">{profilePage.subtitle}</p>
		</header>

		<div
			class="bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden transition-colors"
		>
			<div
				class="h-24 bg-linear-to-r from-[#59452B]/10 to-[#59452B]/5 dark:from-amber-600/20 dark:to-transparent"
				aria-hidden="true"
			></div>
			<div class="px-6 pb-6 -mt-12">
				{#if $userStore.profilePic}
					<img
						src={$userStore.profilePic}
						alt={name}
						class="w-24 h-24 rounded-full border-2 bg-black border-white dark:border-[#212932] shadow-md shrink-0 object-cover"
					/>
				{:else}
					<div
						class="w-24 h-24 rounded-full bg-[#59452B] dark:bg-amber-500 text-white flex items-center justify-center text-2xl font-semibold border-4 border-white dark:border-[#212932] shadow-md shrink-0"
					>
						{getInitials(name)}
					</div>
				{/if}
				<div class="mt-4">
					<p class="text-xl font-semibold text-gray-800 dark:text-white">{name}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">{email}</p>
				</div>
			</div>
		</div>

		<section
			class="bg-white dark:bg-[#212932] rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors"
		>
			<h2 class="text-lg font-semibold text-[#59452B] dark:text-amber-400 mb-4">
				{profilePage.personalInfo.sectionTitle}
			</h2>
			<div class="space-y-4">
				<div>
					<label
						for="profile-name"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						{profilePage.personalInfo.nameLabel}
					</label>
					<Input
						id="profile-name"
						bind:value={name}
						placeholder={profilePage.personalInfo.namePlaceholder}
						disabled={!isEditing}
						class="w-full"
					/>
				</div>
				<div>
					<label
						for="profile-email"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						{profilePage.personalInfo.emailLabel}
					</label>
					<Input
						id="profile-email"
						bind:value={email}
						type="email"
						placeholder={profilePage.personalInfo.emailPlaceholder}
						disabled={!isEditing}
						class="w-full"
					/>
				</div>
				<div>
					<label
						for="profile-phone"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						{profilePage.personalInfo.phoneLabel}
					</label>
					<Input
						id="profile-phone"
						bind:value={phone}
						type="tel"
						placeholder={profilePage.personalInfo.phonePlaceholder}
						disabled={!isEditing}
						class="w-full"
					/>
				</div>
			</div>
			<div class="mt-6">
				{#if isEditing}
					<Button
						text={profilePage.account.saveButtonText}
						variant="default"
						size="default"
						rounded="lg"
						onClick={() => (isEditing = false)}
					/>
				{:else}
					<Button
						text={profilePage.account.editButtonText}
						variant="default"
						size="default"
						rounded="lg"
						class="border-[#59452B] text-[#59452B] hover:bg-[#59452B]/5 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
						onClick={() => (isEditing = true)}
					/>
				{/if}
			</div>
		</section>

		{#if isAdmin}
			<section
				class="bg-white dark:bg-[#212932] rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors"
			>
				<h2 class="text-lg font-semibold text-[#59452B] dark:text-amber-400 mb-1">
					{profilePage.admin.sectionTitle}
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					{profilePage.admin.sectionDescription}
				</p>
				<Button
					text={profilePage.admin.addUsersButtonText}
					variant="default"
					size="default"
					rounded="lg"
					onClick={() => (addUserModalOpen = true)}
				/>
				{#if addedUsers.length === 0}
					<p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
						{profilePage.admin.emptyUsersText}
					</p>
				{:else}
					<ul class="mt-4 space-y-3">
						{#each addedUsers as user (user.id)}
							<li
								class="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
							>
								<div class="min-w-0 flex-1">
									<p class="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
								</div>
								<div class="flex items-center gap-2 shrink-0">
									<span
										class="text-xs font-medium px-2.5 py-1 rounded-full {user.role === 'admin'
											? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
											: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}"
									>
										{user.role === 'admin' ? addUserModal.roleAdmin : addUserModal.roleUser}
									</span>
									<Button
										text={profilePage.admin.editUserButtonText}
										variant="light-gray"
										size="sm"
										rounded="lg"
										onClick={() => openEditModal(user)}
									/>
									<Button
										text={profilePage.admin.deleteUserButtonText}
										variant="light-gray"
										size="sm"
										rounded="lg"
										class="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
										onClick={() => handleDeleteUser(user.id)}
									/>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}
	</div>

	<AddUserModal
		bind:open={addUserModalOpen}
		userToEdit={userToEdit}
		onAdd={handleAddUser}
		onEdit={handleEditUser}
		onClose={closeUserModal}
	/>
</div>
