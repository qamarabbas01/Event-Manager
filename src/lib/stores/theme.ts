import { writable } from 'svelte/store';

const STORAGE_KEY = 'app-theme';

export type Theme = 'light' | 'dark';

function loadTheme(): Theme {
	if (typeof window === 'undefined') return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'dark' || stored === 'light') return stored;
	return 'light';
}

function saveTheme(theme: Theme) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, theme);
}

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', theme === 'dark');
}

const stored = loadTheme();
export const theme = writable<Theme>(stored);

theme.subscribe((value) => {
	saveTheme(value);
	applyTheme(value);
});

applyTheme(stored);
