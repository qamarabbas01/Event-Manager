import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	title: string;
	message?: string;
	type: ToastType;
	durationMs: number;
}

interface ToastInput {
	title: string;
	message?: string;
	type?: ToastType;
	durationMs?: number;
}

const DEFAULT_DURATION_MS = 3200;

const { subscribe, update } = writable<Toast[]>([]);

function addToast(input: ToastInput): string {
	const id =
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? crypto.randomUUID()
			: Math.random().toString(36).substring(2, 15);
	const toast: Toast = {
		id,
		title: input.title,
		message: input.message,
		type: input.type ?? 'info',
		durationMs: input.durationMs ?? DEFAULT_DURATION_MS
	};

	update((items) => [...items, toast]);

	if (typeof window !== 'undefined' && toast.durationMs > 0) {
		window.setTimeout(() => dismissToast(id), toast.durationMs);
	}

	return id;
}

function dismissToast(id: string) {
	update((items) => items.filter((item) => item.id !== id));
}

export const toastStore = {
	subscribe,
	add: addToast,
	dismiss: dismissToast,
	success: (title: string, message?: string, durationMs?: number) =>
		addToast({ title, message, durationMs, type: 'success' }),
	error: (title: string, message?: string, durationMs?: number) =>
		addToast({ title, message, durationMs, type: 'error' }),
	info: (title: string, message?: string, durationMs?: number) =>
		addToast({ title, message, durationMs, type: 'info' })
};
