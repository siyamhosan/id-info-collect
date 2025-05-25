<script>
	import { validateImageFile } from '../utils/validation.js';
	import { onDestroy } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';

	/** @type {File | null} */
	export let imageFile = null;
	export let imagePreviewUrl = '';
	export let error = '';

	/** @type {HTMLInputElement} */
	let fileInput;
	let dragOver = false;

	/**
	 * @param {Event} event
	 */
	function handleFileSelect(event) {
		const target = /** @type {HTMLInputElement} */ (event.target);
		const file = target.files?.[0];
		processFile(file);
	}

	/**
	 * @param {DragEvent} event
	 */
	function handleDrop(event) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer?.files[0];
		processFile(file);
	}

	/**
	 * @param {DragEvent} event
	 */
	function handleDragOver(event) {
		event.preventDefault();
		dragOver = true;
	}

	/**
	 * @param {DragEvent} event
	 */
	function handleDragLeave(event) {
		event.preventDefault();
		dragOver = false;
	}

	/**
	 * @param {File | undefined} file
	 */
	function processFile(file) {
		if (!file) return;

		const validation = validateImageFile(file);
		if (!validation.valid) {
			error = validation.error || 'Invalid file';
			return;
		}

		error = '';
		imageFile = file;

		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		imagePreviewUrl = URL.createObjectURL(file);
	}

	function removeImage() {
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}
		imageFile = null;
		imagePreviewUrl = '';
		error = '';
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function triggerFileSelect() {
		fileInput?.click();
	}

	onDestroy(() => {
		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}
	});
</script>

<div class="space-y-4">
	<label class="block text-sm font-semibold text-gray-900">
		Profile Photo
		<span class="text-red-500">*</span>
	</label>

	<input
		bind:this={fileInput}
		type="file"
		accept="image/jpeg,image/jpg,image/png"
		on:change={handleFileSelect}
		class="hidden"
	/>

	<div
		class="group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 {dragOver
			? 'scale-105 border-blue-400 bg-blue-50/80'
			: imageFile
				? 'border-emerald-400 bg-emerald-50/80'
				: error
					? 'border-red-400 bg-red-50/80'
					: 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50'}"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		role="button"
		tabindex="0"
		on:click={triggerFileSelect}
		on:keydown={(e) => e.key === 'Enter' && triggerFileSelect()}
	>
		{#if imagePreviewUrl}
			<div class="space-y-6" in:fade={{ duration: 300 }}>
				<div class="relative mx-auto w-fit">
					<img
						src={imagePreviewUrl}
						alt="Profile preview"
						class="h-40 w-40 rounded-2xl border-4 border-white object-cover shadow-xl shadow-gray-900/20"
						in:scale={{ duration: 400, delay: 100 }}
					/>
					<div class="absolute -top-2 -right-2 rounded-full bg-emerald-500 p-2 shadow-lg">
						<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>

				<div class="space-y-3">
					<p class="flex items-center justify-center text-sm font-semibold text-emerald-600">
						<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						Image uploaded successfully
					</p>
					<div class="flex justify-center space-x-4">
						<button
							type="button"
							on:click|stopPropagation={triggerFileSelect}
							class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
						>
							<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							Change Image
						</button>
						<button
							type="button"
							on:click|stopPropagation={removeImage}
							class="inline-flex items-center rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 focus:ring-4 focus:ring-red-500/20 focus:outline-none"
						>
							<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							Remove
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="space-y-6" in:fade={{ duration: 300 }}>
				<div
					class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110"
				>
					<svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>

				<div class="space-y-2">
					<p class="text-lg font-semibold text-gray-900">
						<span class="cursor-pointer text-blue-600 transition-colors hover:text-blue-700">
							Click to upload
						</span>
						<span class="text-gray-500"> or drag and drop</span>
					</p>
					<p class="text-sm text-gray-500">JPG or PNG, max 5MB</p>
				</div>

				<!-- Upload Animation -->
				{#if dragOver}
					<div
						class="absolute inset-0 flex items-center justify-center"
						in:scale={{ duration: 200 }}
					>
						<div class="rounded-2xl bg-blue-500 p-4 shadow-xl">
							<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
								/>
							</svg>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Hover Effect -->
		<div
			class="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 transition-transform duration-700 group-hover:translate-x-[100%]"
		></div>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4" in:fly={{ y: -10, duration: 200 }}>
			<p class="flex items-center text-sm font-semibold text-red-600">
				<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
				{error}
			</p>
		</div>
	{/if}

	<div class="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
		<h4 class="mb-2 text-sm font-semibold text-blue-900">Photo Requirements:</h4>
		<div class="grid grid-cols-1 gap-2 text-xs text-blue-700 md:grid-cols-2">
			<div class="flex items-center">
				<svg class="mr-2 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				Clear, passport-size photo
			</div>
			<div class="flex items-center">
				<svg class="mr-2 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				Good lighting & formal attire
			</div>
			<div class="flex items-center">
				<svg class="mr-2 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				Face clearly visible & centered
			</div>
			<div class="flex items-center">
				<svg class="mr-2 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				JPG/PNG format, max 5MB
			</div>
		</div>
	</div>
</div>
