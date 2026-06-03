import { writable } from 'svelte/store';

const STORAGE_KEY = 'sidebar-collapsed';

function loadCollapsed(): boolean {
	if (typeof window === 'undefined') return false;
	return localStorage.getItem(STORAGE_KEY) === 'true';
}

function saveCollapsed(collapsed: boolean) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, String(collapsed));
}

export const sidebarCollapsed = writable(loadCollapsed());
export const sidebarMobileOpen = writable(false);

sidebarCollapsed.subscribe(saveCollapsed);

export function toggleSidebarCollapsed() {
	sidebarCollapsed.update((v) => !v);
}

export function toggleSidebarMobile() {
	sidebarMobileOpen.update((v) => !v);
}

export function closeSidebarMobile() {
	sidebarMobileOpen.set(false);
}
