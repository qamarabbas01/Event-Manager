<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import AddUserModal from '$lib/components/dashboard/AddUserModal.svelte';
	import { auth } from '$lib/stores/auth';
	import { userStore } from '$lib/stores/user';
	import { profilePage, addUserModal } from '$lib/data/dashboard';
	import { Upload, Calendar, UserPlus } from '@lucide/svelte';
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
		name.trim() ||
			$userStore.name.trim() ||
			email.split('@')[0] ||
			profilePage.hero.displayNameFallback
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

	function revokeBlobUrl(url: string | null | undefined) {
		if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
	}

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
			revokeBlobUrl(profilePicPreview);
			profilePicFile = input.files[0];
			profilePicPreview = URL.createObjectURL(profilePicFile);
		}
	}

	function handleCoverPicChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.[0]) {
			revokeBlobUrl(coverPicPreview);
			coverPicFile = input.files[0];
			coverPicPreview = URL.createObjectURL(coverPicFile);
		}
	}

	function startEditing() {
		snapshot = { name, email, phone };
		isEditing = true;
	}

	function cancelEditing() {
		revokeBlobUrl(profilePicPreview);
		revokeBlobUrl(coverPicPreview);
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

		revokeBlobUrl(profilePicPreview);
		revokeBlobUrl(coverPicPreview);
		profilePicFile = null;
		coverPicFile = null;
		isEditing = false;
	}

	$effect(() => {
		const profile = profilePicPreview;
		const cover = coverPicPreview;
		return () => {
			revokeBlobUrl(profile);
			revokeBlobUrl(cover);
		};
	});

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

		<div
			class="bg-white dark:bg-[#212932] rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden transition-colors"
		>
			<div class="relative h-36 sm:h-44 overflow-hidden">
				{#if coverPicPreview}
					<img
						src={coverPicPreview}
						alt={profilePage.hero.coverAlt}
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
						<Upload size={14} aria-hidden="true" />
						{profilePage.hero.editCoverText}
						<input type="file" accept="image/*" class="sr-only" onchange={handleCoverPicChange} />
					</label>
				{/if}
			</div>

			<div
				class="relative px-5 sm:px-8 pb-6 sm:pb-8 -mt-14 sm:-mt-16 pt-16 sm:pt-0 bg-linear-to-b from-[#1e2430] via-[#212932] to-[#212932] dark:from-[#151a22] dark:via-[#212932] dark:to-[#212932] sm:bg-transparent"
			>
				<div
					class="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left gap-4 sm:gap-5"
				>
					<div class="relative w-fit shrink-0">
						<div
							class="inline-flex rounded-full p-1 bg-linear-to-br from-blue-500 to-purple-600 shadow-lg ring-4 ring-white/90 dark:ring-[#212932]"
						>
							{#if hasCustomAvatar && profilePicPreview}
								<img
									src={profilePicPreview}
									alt={displayName}
									class="block w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
								/>
							{:else}
								<div
									class="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl sm:text-3xl font-bold"
								>
									{getInitials(displayName)}
								</div>
							{/if}
						</div>
						<span
							class="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#212932]"
							title={profilePage.hero.activeStatusTitle}
							aria-hidden="true"
						></span>
						{#if isEditing}
							<label
								class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer text-white text-xs font-medium"
							>
								{profilePage.hero.editPhotoText}
								<input
									type="file"
									accept="image/*"
									class="sr-only"
									onchange={handleProfilePicChange}
								/>
							</label>
						{/if}
					</div>

					<div
						class="min-w-0 w-full sm:flex-1 pt-0 sm:pt-1 sm:pb-1 text-gray-900 dark:text-white sm:text-white"
					>
						<h2
							class="text-xl sm:text-3xl font-bold truncate text-gray-900 dark:text-white sm:drop-shadow-sm"
						>
							{displayName}
						</h2>
						<p
							class="mt-1 text-sm sm:text-base truncate text-gray-600 dark:text-gray-300 sm:text-white/85"
						>
							{email}
						</p>
						{#if phone}
							<p class="mt-0.5 text-sm truncate text-gray-500 dark:text-gray-400 sm:text-white/70">
								{phone}
							</p>
						{/if}
						<div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
							<span
								class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200 border border-purple-200/60 dark:border-purple-700/50 sm:bg-white/20 sm:text-white sm:border-white/25 sm:backdrop-blur-sm"
							>
								{roleLabel}
							</span>
							<span
								class="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-3 py-1 rounded-full sm:text-white/90 sm:bg-black/20 sm:backdrop-blur-sm"
							>
								<Calendar size={12} class="shrink-0" aria-hidden="true" />
								{profilePage.account.memberSinceLabel}
								{$userStore.memberSince}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 {isAdmin ? 'lg:grid-cols-5' : ''} gap-6">
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
							{isEditing
								? profilePage.personalInfo.editingSubtitle
								: profilePage.personalInfo.viewSubtitle}
						</p>
					</div>
					{#if isEditing}
						<span
							class="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 self-start"
						>
							{profilePage.personalInfo.editingBadge}
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
							<Button
								text={profilePage.account.cancelButtonText}
								variant="default"
								rounded="lg"
								onClick={cancelEditing}
							/>
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
									class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100 wrap-break-word"
								>
									{name || profilePage.personalInfo.emptyValue}
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
									{email || profilePage.personalInfo.emptyValue}
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
									{phone || profilePage.personalInfo.emptyValue}
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
									<UserPlus size={24} strokeWidth={1.5} aria-hidden="true" />
								</div>
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
									{profilePage.admin.emptyTeamTitle}
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
