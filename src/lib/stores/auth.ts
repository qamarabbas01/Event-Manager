import { derived, writable } from 'svelte/store';

const STORAGE_KEY = 'eventhub-auth';

export type AuthUser = {
	name: string;
	email: string;
};

export type AuthState = {
	user: AuthUser | null;
};

function parseStoredAuth(raw: string | null): AuthState {
	if (!raw) return { user: null };
	try {
		const parsed = JSON.parse(raw) as Partial<AuthUser> | null;
		if (!parsed || typeof parsed.email !== 'string') return { user: null };
		return { user: { name: typeof parsed.name === 'string' ? parsed.name : '', email: parsed.email } };
	} catch {
		return { user: null };
	}
}

function loadAuth(): AuthState {
	if (typeof window === 'undefined') return { user: null };
	return parseStoredAuth(localStorage.getItem(STORAGE_KEY));
}

function saveAuth(state: AuthState) {
	if (typeof window === 'undefined') return;
	if (!state.user) {
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
}

export const auth = writable<AuthState>(loadAuth());

auth.subscribe((state) => {
	saveAuth(state);
});

export const isAuthenticated = derived(auth, ($auth) => Boolean($auth.user));

export function login(user: AuthUser) {
	auth.set({ user });
}

export function logout() {
	auth.set({ user: null });
}

