import { writable } from 'svelte/store';
import type { UserRole } from '$lib/data/dashboard';
import { profilePlaceholder } from '$lib/data/dashboard';
import type { AuthUser } from '$lib/stores/auth';

export interface CurrentUser {
	role: UserRole;
	name: string;
	email: string;
	phone: string;
	memberSince: string;
	profilePic?: string;
	coverPic?: string;
}

const STORAGE_KEY = 'eventhub-profile';

const defaultUser: CurrentUser = {
	role: profilePlaceholder.role,
	name: profilePlaceholder.name,
	email: profilePlaceholder.email,
	phone: profilePlaceholder.phone,
	memberSince: profilePlaceholder.memberSince,
	profilePic: undefined,
	coverPic: undefined
};

function loadUser(): CurrentUser {
	if (typeof window === 'undefined') return defaultUser;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return defaultUser;
		const parsed = JSON.parse(raw) as Partial<CurrentUser>;
		if (parsed.profilePic?.includes('Portrait_Placeholder')) parsed.profilePic = undefined;
		return { ...defaultUser, ...parsed };
	} catch {
		return defaultUser;
	}
}

function saveUser(user: CurrentUser) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function createUserStore() {
	const { subscribe, set, update } = writable<CurrentUser>(loadUser());

	subscribe((user) => {
		saveUser(user);
	});

	return {
		subscribe,
		set,
		update,
		setRole(role: UserRole) {
			update((u) => ({ ...u, role }));
		},
		syncFromAuth(authUser: AuthUser) {
			update((u) => ({
				...u,
				name: authUser.name || u.name,
				email: authUser.email
			}));
		},
		updateProfile(
			patch: Partial<Pick<CurrentUser, 'name' | 'email' | 'phone' | 'profilePic' | 'coverPic'>>
		) {
			update((u) => ({ ...u, ...patch }));
		}
	};
}

export const userStore = createUserStore();
