import { writable } from 'svelte/store';
import type { UserRole } from '$lib/data/dashboard';
import { profilePlaceholder } from '$lib/data/dashboard';
import defaultProfilePic from '$lib/assets/avatar.avif';

export interface CurrentUser {
	role: UserRole;
	name: string;
	email: string;
	profilePic?: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<CurrentUser>({
		role: profilePlaceholder.role,
		name: profilePlaceholder.name,
		email: profilePlaceholder.email,
		profilePic: defaultProfilePic
	});

	return {
		subscribe,
		set,
		update,
		setRole(role: UserRole) {
			update((u) => ({ ...u, role }));
		}
	};
}

export const userStore = createUserStore();
