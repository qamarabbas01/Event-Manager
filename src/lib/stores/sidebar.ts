import { writable } from 'svelte/store';

const STORAGE_KEY = 'sidebar-collapsed';

function loadCollapsed(): boolean {
	return localStorage.getItem(STORAGE_KEY) === 'true';
}

function saveCollapsed(collapsed: boolean) {
	localStorage.setItem(STORAGE_KEY, String(collapsed));
}

/** Default false so SSR and the first client render match before onMount. */
export const sidebarCollapsed = writable(false);
export const sidebarMobileOpen = writable(false);

let initialized = false;

/**
 * Load persisted collapse state and sync writes to localStorage.
 * Call from onMount in the app shell (e.g. SideBar).
 */
export function initSidebar(): () => void {
	if (typeof window === 'undefined' || initialized) return () => {};

	initialized = true;
	sidebarCollapsed.set(loadCollapsed());

	const unsubscribe = sidebarCollapsed.subscribe(saveCollapsed);

	return () => {
		unsubscribe();
		initialized = false;
	};
}

export function toggleSidebarCollapsed() {
	sidebarCollapsed.update((v) => !v);
}

export function toggleSidebarMobile() {
	sidebarMobileOpen.update((v) => !v);
}

export function closeSidebarMobile() {
	sidebarMobileOpen.set(false);
}
