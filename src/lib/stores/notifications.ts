import { writable, type Writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
	id: number;
	message: string;
	type: NotificationType;
	duration: number;
}

export const notifications: Writable<AppNotification[]> = writable([]);

export function addNotification(
	message: string,
	type: NotificationType = 'info',
	duration: number = 3000
): number {
	const id = Date.now();
	const notification: AppNotification = { id, message, type, duration };

	notifications.update((n) => [...n, notification]);

	if (duration > 0) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}

	return id;
}

export function removeNotification(id: number): void {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}
