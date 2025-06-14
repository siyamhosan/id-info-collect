<script lang="ts">
	import {
		notifications,
		removeNotification,
		type AppNotification,
		type NotificationType
	} from '$lib/stores/notifications';
	import { fade, fly, scale } from 'svelte/transition';

	function dismiss(id: number): void {
		removeNotification(id);
	}

	function getTypeClasses(type: NotificationType): string {
		switch (type) {
			case 'success':
				return 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 shadow-emerald-500/20';
			case 'error':
				return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800 shadow-red-500/20';
			case 'warning':
				return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 shadow-amber-500/20';
			case 'info':
			default:
				return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-blue-500/20';
		}
	}

	function getIconClasses(type: NotificationType): string {
		switch (type) {
			case 'success':
				return 'text-emerald-500 bg-emerald-100';
			case 'error':
				return 'text-red-500 bg-red-100';
			case 'warning':
				return 'text-amber-500 bg-amber-100';
			case 'info':
			default:
				return 'text-blue-500 bg-blue-100';
		}
	}
</script>

<div class="fixed top-6 right-6 z-50 w-full max-w-sm space-y-3">
	{#each $notifications as notification (notification.id)}
		<div
			class="relative overflow-hidden rounded-2xl border-2 {getTypeClasses(
				notification.type
			)} p-4 shadow-xl backdrop-blur-sm"
			in:fly={{ x: 400, duration: 400, delay: 100 }}
			out:fly={{ x: 400, duration: 300 }}
		>
			<!-- Background Pattern -->
			<div class="absolute inset-0 opacity-30">
				<div class="h-full w-full bg-gradient-to-br from-white/20 to-transparent"></div>
			</div>

			<div class="relative flex items-start space-x-3">
				<!-- Icon -->
				<div class="flex-shrink-0">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-xl {getIconClasses(
							notification.type
						)} shadow-lg"
					>
						{#if notification.type === 'success'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else if notification.type === 'error'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else if notification.type === 'warning'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>
				</div>

				<!-- Content -->
				<div class="min-w-0 flex-1">
					<p class="text-sm leading-5 font-semibold">
						{notification.message}
					</p>
				</div>

				<!-- Close Button -->
				<div class="flex-shrink-0">
					<button
						aria-label="Close notification"
						class="group inline-flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/50 hover:text-gray-600 focus:ring-2 focus:ring-gray-500/20 focus:outline-none"
						on:click={() => dismiss(notification.id)}
					>
						<svg
							class="h-3 w-3 transition-transform group-hover:scale-110"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Progress Bar (for auto-dismiss) -->
			{#if notification.duration > 0}
				<div class="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl bg-black/10">
					<div
						class="h-full bg-current opacity-30 transition-all ease-linear"
						style="animation: shrink {notification.duration}ms linear forwards;"
					></div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@keyframes shrink {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>
