<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import AddUserModal from '$lib/components/dashboard/AddUserModal.svelte';
	import { auth } from '$lib/stores/auth';
	import { userStore } from '$lib/stores/user';
	import { profilePage, addUserModal } from '$lib/data/dashboard';
	import type { UserRole } from '$lib/data/dashboard';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let isEditing = $state(false);
	let addUserModalOpen = $state(false);
	let userToEdit = $state<{ id: string; name: string; email: string; role: UserRole } | null>(null);
	let addedUsers = $state<{ id: string; name: string; email: string; role: UserRole }[]>([]);

	let profilePicFile: File | null = null;
	let coverPicFile: File | null = null;
	let profilePicPreview = $state<string | null>(null);
	let coverPicPreview = $state<string | null>(null);

	let snapshot = $state({ name: '', email: '', phone: '' });

	const isAdmin = $derived($userStore.role === 'admin');

	const roleLabel = $derived(
		$userStore.role === 'admin'
			? addUserModal.roleAdmin
			: $userStore.role === 'tester'
				? addUserModal.roleTester
				: addUserModal.roleUser
	);

	const displayName = $derived(
		name.trim() || $userStore.name.trim() || email.split('@')[0] || 'User'
	);

	const hasCustomAvatar = $derived(
		Boolean(profilePicPreview?.startsWith('blob:') || profilePicPreview?.startsWith('data:'))
	);

	function syncFormFromStore() {
		name = $userStore.name;
		email = $userStore.email;
		phone = $userStore.phone;
		profilePicPreview = $userStore.profilePic ?? null;
		coverPicPreview = $userStore.coverPic ?? null;
	}

	$effect(() => {
		if ($auth.user) userStore.syncFromAuth($auth.user);
	});

	$effect(() => {
		if (!isEditing) syncFormFromStore();
	});

	function getInitials(fullName: string): string {
		return (
			fullName
				.split(' ')
				.filter(Boolean)
				.map((n) => n[0])
				.slice(0, 2)
				.join('')
				.toUpperCase() || '?'
		);
	}

	function handleProfilePicChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.[0]) {
			profilePicFile = input.files[0];
			profilePicPreview = URL.createObjectURL(profilePicFile);
		}
	}

	function handleCoverPicChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.[0]) {
			coverPicFile = input.files[0];
			coverPicPreview = URL.createObjectURL(coverPicFile);
		}
	}

	function startEditing() {
		snapshot = { name, email, phone };
		isEditing = true;
	}

	function cancelEditing() {
		name = snapshot.name;
		email = snapshot.email;
		phone = snapshot.phone;
		profilePicPreview = $userStore.profilePic ?? null;
		coverPicPreview = $userStore.coverPic ?? null;
		profilePicFile = null;
		coverPicFile = null;
		isEditing = false;
	}

	function saveProfile() {
		userStore.updateProfile({
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
			...(profilePicFile ? { profilePic: profilePicPreview ?? undefined } : {}),
			...(coverPicFile ? { coverPic: coverPicPreview ?? undefined } : {})
		});

		if ($auth.user) {
			auth.set({
				user: {
					name: name.trim(),
					email: email.trim()
				}
			});
		}

		profilePicFile = null;
		coverPicFile = null;
		isEditing = false;
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
	<div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
		<header
			class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-200 dark:border-gray-700/60"
		>
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{profilePage.title}</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">{profilePage.subtitle}</p>
			</div>
			{#if !isEditing}
				<Button
					text={profilePage.account.editButtonText}
					variant="primary-blue"
					rounded="lg"
					size="sm"
					class="shrink-0 self-start sm:self-center"
					onClick={startEditing}
				/>
			{/if}
		</header>

		<!-- Profile card -->
		<div
			class="bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden transition-colors"
		>
			<!-- Cover -->
			<div class="relative h-36 sm:h-44 overflow-hidden">
				{#if coverPicPreview}
					<img
						src={coverPicPreview}
						alt="Cover"
						class="absolute inset-0 w-full h-full object-cover"
					/>
				{:else}
					<div
						class="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-950"
					></div>
					<div
						class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.35)_0%,transparent_40%)]"
						aria-hidden="true"
					></div>
					<div
						class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
						aria-hidden="true"
					></div>
					<div
						class="absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl"
						aria-hidden="true"
					></div>
				{/if}
				<div
					class="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"
					aria-hidden="true"
				></div>
				{#if isEditing}
					<label
						class="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/50 hover:bg-black/65 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white cursor-pointer transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
						</svg>
						Edit cover
						<input type="file" accept="image/*" class="sr-only" onchange={handleCoverPicChange} />
					</label>
				{/if}
			</div>

			<!-- Identity on cover -->
			<div class="relative px-5 sm:px-8 pb-6 sm:pb-8">
				<div class="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16">
					<div class="relative shrink-0">
						<div
							class="rounded-full p-1 bg-linear-to-br from-blue-500 to-purple-600 shadow-lg ring-4 ring-white/90"
						>
							{#if hasCustomAvatar && profilePicPreview}
								<img
									src={profilePicPreview}
									alt={displayName}
									class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
								/>
							{:else}
								<div
									class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold"
								>
									{getInitials(displayName)}
								</div>
							{/if}
						</div>
						<span
							class="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"
							title="Active"
							aria-hidden="true"
						></span>
						{#if isEditing}
							<label
								class="absolute inset-1 flex items-center justify-center rounded-full bg-black/50 cursor-pointer text-white text-xs font-medium opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity"
							>
								Edit photo
								<input
									type="file"
									accept="image/*"
									class="sr-only"
									onchange={handleProfilePicChange}
								/>
							</label>
						{/if}
					</div>

					<div class="min-w-0 flex-1 text-white pt-1 sm:pb-1">
						<h2 class="text-2xl sm:text-3xl font-bold truncate drop-shadow-sm">{displayName}</h2>
						<p class="mt-1 text-sm sm:text-base text-white/85 truncate">{email}</p>
						{#if phone}
							<p class="mt-0.5 text-sm text-white/70 truncate">{phone}</p>
						{/if}
						<div class="mt-3 flex flex-wrap items-center gap-2">
							<span
								class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/25"
							>
								{roleLabel}
							</span>
							<span
								class="inline-flex items-center gap-1.5 text-xs text-white/90 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="shrink-0"
									aria-hidden="true"
								>
									<rect x="3" y="4" width="18" height="18" rx="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								{profilePage.account.memberSinceLabel}
								{$userStore.memberSince}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 {isAdmin ? 'lg:grid-cols-5' : ''} gap-6">
			<!-- Personal info -->
			<section
				class="{isAdmin
					? 'lg:col-span-3'
					: ''} bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors overflow-hidden"
			>
				<div
					class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/30"
				>
					<div>
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{profilePage.personalInfo.sectionTitle}
						</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
							{isEditing ? 'Update your details below' : 'Your account contact information'}
						</p>
					</div>
					{#if isEditing}
						<span
							class="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 self-start"
						>
							Editing
						</span>
					{/if}
				</div>

				<div class="p-6">
					{#if isEditing}
						<div class="space-y-5">
							<div>
								<label
									for="profile-name"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
									>{profilePage.personalInfo.nameLabel}</label
								>
								<Input
									id="profile-name"
									bind:value={name}
									placeholder={profilePage.personalInfo.namePlaceholder}
									class="w-full"
								/>
							</div>
							<div>
								<label
									for="profile-email"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
									>{profilePage.personalInfo.emailLabel}</label
								>
								<Input
									id="profile-email"
									bind:value={email}
									type="email"
									placeholder={profilePage.personalInfo.emailPlaceholder}
									class="w-full"
								/>
							</div>
							<div>
								<label
									for="profile-phone"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
									>{profilePage.personalInfo.phoneLabel}</label
								>
								<Input
									id="profile-phone"
									bind:value={phone}
									type="tel"
									placeholder={profilePage.personalInfo.phonePlaceholder}
									class="w-full"
								/>
							</div>
						</div>
						<div
							class="mt-6 flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-gray-700/60"
						>
							<Button
								text={profilePage.account.saveButtonText}
								variant="primary-blue"
								rounded="lg"
								onClick={saveProfile}
							/>
							<Button text="Cancel" variant="default" rounded="lg" onClick={cancelEditing} />
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div
								class="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/40 p-4"
							>
								<p
									class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
								>
									{profilePage.personalInfo.nameLabel}
								</p>
								<p
									class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100 break-words"
								>
									{name || '—'}
								</p>
							</div>
							<div
								class="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/40 p-4"
							>
								<p
									class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
								>
									{profilePage.personalInfo.emailLabel}
								</p>
								<p class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100 break-all">
									{email || '—'}
								</p>
							</div>
							<div
								class="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/40 p-4 sm:col-span-2"
							>
								<p
									class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
								>
									{profilePage.personalInfo.phoneLabel}
								</p>
								<p class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
									{phone || '—'}
								</p>
							</div>
						</div>
					{/if}
				</div>
			</section>

			{#if isAdmin}
				<section
					class="lg:col-span-2 bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors overflow-hidden flex flex-col"
				>
					<div
						class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/30"
					>
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{profilePage.admin.sectionTitle}
						</h2>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
							{profilePage.admin.sectionDescription}
						</p>
					</div>

					<div class="p-6 flex-1 flex flex-col">
						<Button
							text={profilePage.admin.addUsersButtonText}
							variant="primary-blue"
							rounded="lg"
							class="w-full"
							onClick={() => (addUserModalOpen = true)}
						/>

						{#if addedUsers.length === 0}
							<div
								class="mt-6 flex-1 flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-10 px-4"
							>
								<div
									class="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-3"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										aria-hidden="true"
									>
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<line x1="19" y1="8" x2="19" y2="14" />
										<line x1="22" y1="11" x2="16" y2="11" />
									</svg>
								</div>
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
									No team members yet
								</p>
								<p class="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-[220px]">
									{profilePage.admin.emptyUsersText}
								</p>
							</div>
						{:else}
							<ul class="mt-5 space-y-3 flex-1">
								{#each addedUsers as user (user.id)}
									<li
										class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60"
									>
										<div class="min-w-0 flex-1 flex items-center gap-3">
											<div
												class="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center"
											>
												{getInitials(user.name)}
											</div>
											<div class="min-w-0">
												<p class="font-medium text-gray-900 dark:text-gray-100 truncate">
													{user.name}
												</p>
												<p class="text-sm text-gray-500 dark:text-gray-400 truncate">
													{user.email}
												</p>
											</div>
										</div>
										<div class="flex flex-wrap items-center gap-2 shrink-0">
											<span
												class="text-xs font-medium px-2.5 py-1 rounded-full {user.role === 'admin'
													? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
													: user.role === 'tester'
														? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
														: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}"
											>
												{user.role === 'admin'
													? addUserModal.roleAdmin
													: user.role === 'tester'
														? addUserModal.roleTester
														: addUserModal.roleUser}
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
					</div>
				</section>
			{/if}
		</div>
	</div>

	<AddUserModal
		bind:open={addUserModalOpen}
		{userToEdit}
		onAdd={handleAddUser}
		onEdit={handleEditUser}
		onClose={closeUserModal}
	/>
</div>
