<script lang="ts">
	import { validateBoardRoll } from '$lib/utils/validation';
	import { loggedInUser } from '$lib/stores/userSession';
	import { currentView } from '$lib/stores/currentView';
	import { addNotification } from '$lib/stores/notifications';
	import CollapsibleInstructions from './CollapsibleInstructions.svelte';
	import { fade, fly } from 'svelte/transition';
	import { Semesters } from '$lib/utils/data';
	import { checkIfSubmitted, getBorderClass } from '$lib/utils/helper';

	let boardRoll = '';
	let semester = '';
	let hasAgreed = false;
	let isAlreadySubmitted = false;
	let isCheckingSubmission = false;

	// Reactive validation
	$: isBoardRollValid = validateBoardRoll(boardRoll);
	$: isSemesterValid = semester !== '';
	$: isLoginEnabled = isBoardRollValid && isSemesterValid && hasAgreed && !isCheckingSubmission;

	// Check if already submitted when board roll changes
	$: if (boardRoll && isBoardRollValid) {
		checkSubmissionStatus(boardRoll);
	} else {
		isAlreadySubmitted = false;
	}

	async function checkSubmissionStatus(roll: string) {
		isCheckingSubmission = true;
		try {
			isAlreadySubmitted = await checkIfSubmitted(roll);
		} catch (error) {
			console.error('Error checking submission status:', error);
			isAlreadySubmitted = false;
		} finally {
			isCheckingSubmission = false;
		}
	}

	async function handleLogin() {
		if (!isLoginEnabled) return;

		// Double-check submission status before proceeding
		if (isBoardRollValid) {
			await checkSubmissionStatus(boardRoll);
		}

		if (isAlreadySubmitted) {
			addNotification(
				'This Board Roll has already been submitted. Please contact administration if you need to make changes.',
				'warning'
			);
			return;
		}

		// Store user session
		//@ts-ignore
		loggedInUser.set({
			boardRoll,
			semester,
			department: '' // Will be set in department selection
		});

		// Navigate to department selection
		currentView.set('departments');
		addNotification('Login successful! Please select your department.', 'success');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-40">
		<div
			class="h-full w-full bg-gradient-to-br from-transparent via-blue-50/30 to-indigo-100/30"
		></div>
	</div>

	<div class="relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
		<!-- Header -->
		<div class="sm:mx-auto sm:w-full sm:max-w-md" in:fade={{ duration: 600, delay: 100 }}>
			<div class="text-center">
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25"
				>
					<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m4-2v2"
						/>
					</svg>
				</div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">ID Card Portal</h1>
				<p class="mt-3 text-lg text-gray-600">Student Information Collection System</p>
			</div>
		</div>

		<!-- Main Form -->
		<div
			class="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl"
			in:fly={{ y: 30, duration: 600, delay: 200 }}
		>
			<div
				class="rounded-3xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-900/10 backdrop-blur-sm lg:p-10"
			>
				<CollapsibleInstructions bind:hasAgreed />

				<form on:submit|preventDefault={handleLogin} class="mt-8 space-y-8">
					<!-- Board Roll Input -->
					<div class="space-y-2">
						<label for="boardRoll" class="block text-sm font-semibold text-gray-900">
							Board Roll Number
						</label>
						<div class="relative">
							<input
								id="boardRoll"
								name="boardRoll"
								type="text"
								bind:value={boardRoll}
								placeholder="Enter 6-digit board roll"
								maxlength="6"
								class="block w-full rounded-xl border-2 {getBorderClass(
									isBoardRollValid,
									boardRoll
								)} bg-white/50 px-4 py-3.5 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
							/>
							{#if boardRoll}
								<div class="absolute inset-y-0 right-0 flex items-center pr-4">
									{#if isCheckingSubmission}
										<div class="rounded-full bg-blue-100 p-1" in:fade={{ duration: 200 }}>
											<svg
												class="h-4 w-4 animate-spin text-blue-600"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
										</div>
									{:else if isBoardRollValid}
										<div class="rounded-full bg-emerald-100 p-1" in:fade={{ duration: 200 }}>
											<svg class="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									{:else}
										<div class="rounded-full bg-red-100 p-1" in:fade={{ duration: 200 }}>
											<svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									{/if}
								</div>
							{/if}
						</div>
						{#if boardRoll && !isBoardRollValid}
							<p class="flex items-center text-sm text-red-600" in:fly={{ y: -10, duration: 200 }}>
								<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
								Board roll must be exactly 6 digits
							</p>
						{/if}
						{#if isAlreadySubmitted}
							<div
								class="rounded-lg border border-amber-200 bg-amber-50 p-3"
								in:fly={{ y: -10, duration: 200 }}
							>
								<p class="flex items-center text-sm font-medium text-amber-800">
									<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
									This board roll has already been submitted
								</p>
							</div>
						{/if}
					</div>

					<!-- Semester Selection -->
					<div class="space-y-2">
						<label for="semester" class="block text-sm font-semibold text-gray-900">
							Current Semester
						</label>
						<select
							id="semester"
							name="semester"
							bind:value={semester}
							class="block w-full rounded-xl border-2 {getBorderClass(
								isSemesterValid,
								semester
							)} bg-white/50 px-4 py-3.5 text-gray-900 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
						>
							<option value="">Select your semester</option>
							{#each Semesters as sem}
								<option value={sem.value} disabled={sem.disabled} class="py-2">
									{sem.label}
									{#if sem.disabled}(Not Available){/if}
								</option>
							{/each}
						</select>
						{#if semester && Semesters.find((s) => s.value === semester)?.disabled}
							<p class="text-sm text-gray-500">
								7th and 8th semester applications are currently not available
							</p>
						{/if}
					</div>

					<!-- Submit Button -->
					<div class="pt-4">
						<button
							type="submit"
							disabled={!isLoginEnabled}
							class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
						>
							<span class="relative z-10 flex items-center justify-center">
								{#if !hasAgreed}
									<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
										/>
									</svg>
									Please read and agree to instructions above
								{:else if !isBoardRollValid || !isSemesterValid}
									<svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Complete all fields to continue
								{:else}
									Continue to Department Selection
									<svg
										class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 7l5 5m0 0l-5 5m5-5H6"
										/>
									</svg>
								{/if}
							</span>

							<!-- Hover effect -->
							<div
								class="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-[100%]"
							></div>
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-10 text-center text-sm text-gray-500" in:fade={{ duration: 600, delay: 400 }}>
			<p>Secure • Fast • Reliable</p>
		</div>
	</div>
</div>
