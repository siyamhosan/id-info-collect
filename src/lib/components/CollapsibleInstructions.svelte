<script>
	import { slide, fade } from 'svelte/transition';
	import { scrollIntoView } from '../actions/scrollIntoView.js';
	import { onMount } from 'svelte';

	export let hasAgreed = false;

	let isExpanded = true;

	onMount(() => {
		// Check localStorage for previous state
		const savedState = localStorage.getItem('instructionsExpanded');
		if (savedState !== null) {
			isExpanded = JSON.parse(savedState);
		}
	});

	function toggleExpanded() {
		isExpanded = !isExpanded;
		localStorage.setItem('instructionsExpanded', JSON.stringify(isExpanded));
	}
</script>

<div
	class="mb-8 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/80 shadow-lg shadow-amber-500/10 backdrop-blur-sm"
	use:scrollIntoView={isExpanded}
>
	<!-- Header -->
	<div class="flex items-center justify-between p-6">
		<div class="flex items-center">
			<div
				class="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
			>
				<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<div>
				<h2 class="text-lg font-bold text-amber-900">Important Instructions</h2>
				<p class="text-sm text-amber-700">Please read carefully before proceeding</p>
			</div>
		</div>
		<button
			aria-label="Toggle instructions"
			on:click={toggleExpanded}
			class="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-amber-600 transition-all duration-200 hover:bg-white/80 hover:text-amber-700 focus:ring-4 focus:ring-amber-500/20 focus:outline-none"
		>
			<svg
				class="h-5 w-5 transform transition-transform duration-300 {isExpanded ? 'rotate-180' : ''}"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</div>

	<!-- Content -->
	{#if isExpanded}
		<div transition:slide={{ duration: 400 }} class="border-t border-amber-200/60 bg-white/40 p-6">
			<div class="space-y-6">
				<!-- Instructions List -->
				<div class="space-y-4">
					<div class="grid gap-3">
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								1
							</div>
							<p class="text-sm text-gray-700">
								Ensure your Board Roll number is exactly 6 digits and matches your official records
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								2
							</div>
							<p class="text-sm text-gray-700">
								Your Class Roll number must be different from your Board Roll number
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								3
							</div>
							<p class="text-sm text-gray-700">
								The first 5 digits of your Board Roll and Class Roll cannot be the same
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								4
							</div>
							<p class="text-sm text-gray-700">
								Upload a clear, passport-size photograph in JPG or PNG format (max 5MB)
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								5
							</div>
							<p class="text-sm text-gray-700">
								Provide accurate contact information including a valid email address
							</p>
						</div>
						<div class="flex items-start space-x-3">
							<div
								class="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600"
							>
								6
							</div>
							<p class="text-sm text-gray-700">
								Double-check all information before submission as changes may not be possible later
							</p>
						</div>
					</div>
				</div>

				<!-- Warning Box -->
				<div class="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4">
					<div class="flex items-start space-x-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
							<svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div>
							<h4 class="font-semibold text-red-900">Critical Notice</h4>
							<p class="mt-1 text-sm text-red-800">
								Submitting false or incorrect information may result in delays or rejection of your
								ID card application. Keep a screenshot of your submission confirmation for your
								records.
							</p>
						</div>
					</div>
				</div>

				<!-- Agreement Checkbox -->
				<div class="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-4">
					<label for="agreement-checkbox" class="flex cursor-pointer items-start space-x-3">
						<div class="relative mt-1">
							<input
								id="agreement-checkbox"
								type="checkbox"
								bind:checked={hasAgreed}
								class="peer h-5 w-5 rounded border-2 border-blue-300 text-blue-600 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-0"
							/>
							<div
								class="pointer-events-none absolute inset-0 rounded border-2 border-transparent bg-blue-600 opacity-0 transition-all duration-200 peer-checked:opacity-100"
							>
								<svg
									class="h-full w-full text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<div class="flex-1">
							<p class="font-semibold text-blue-900">I acknowledge and agree</p>
							<p class="text-sm text-blue-700">
								I have read and understood all the instructions above and agree to provide accurate
								information
							</p>
						</div>
					</label>
				</div>
			</div>
		</div>
	{/if}
</div>
