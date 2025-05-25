<script lang="ts">
	import { currentView } from '$lib/stores/currentView';
	import { addNotification } from '$lib/stores/notifications';
	import { loggedInUser, submittedFormData } from '$lib/stores/userSession';
	import {
		validateClassRoll,
		validateEmail,
		validatePhone,
		validateRequired,
		validateRollConflict
	} from '$lib/utils/validation';
	import { fade, fly, scale } from 'svelte/transition';
	import ImageUpload from './ImageUpload.svelte';
	import { SessionOptions } from '$lib/utils/data';
	import { getBorderClass } from '$lib/utils/helper';
	import { SubmissionService, type ValidationError } from '$lib/utils/submission';

	// Form data
	let formData = {
		fullName: '',
		classRoll: '',
		email: '',
		phone: '',
		group: '',
		shift: '',
		session: '',
		customSession: '',
		profileImage: null,
		profileImageUrl: ''
	};

	let imageError = '';
	let validationErrors: ValidationError[] = [];
	let showValidationErrors = false;

	// Get user session data
	$: user = $loggedInUser as unknown as any;
	$: boardRoll = user?.boardRoll || '';
	$: semester = user?.semester || '';
	$: department = user?.department || '';

	// Session options

	// Validation
	$: isFullNameValid = validateRequired(formData.fullName);
	$: isClassRollValid = validateClassRoll(formData.classRoll);
	$: isEmailValid = validateEmail(formData.email);
	$: isPhoneValid = validatePhone(formData.phone);
	$: isGroupValid = validateRequired(formData.group);
	$: isShiftValid = validateRequired(formData.shift);
	$: isSessionValid = validateRequired(formData.session);
	$: isCustomSessionValid =
		formData.session !== 'Other / Custom Session' || validateRequired(formData.customSession);
	$: isImageValid = formData.profileImage !== null && !imageError;

	// Roll conflict validation
	$: rollConflictValid = validateRollConflict(boardRoll, formData.classRoll);

	// Overall form validation
	$: isFormValid =
		isFullNameValid &&
		isClassRollValid &&
		isEmailValid &&
		isPhoneValid &&
		isGroupValid &&
		isShiftValid &&
		isSessionValid &&
		isCustomSessionValid &&
		isImageValid &&
		rollConflictValid;

	// Derived session for ID card validity
	$: idCardValiditySession =
		formData.session === 'Other / Custom Session' ? formData.customSession : formData.session;

	// Progress calculation
	$: completedFields = [
		isFullNameValid,
		isClassRollValid && rollConflictValid,
		isEmailValid,
		isPhoneValid,
		isGroupValid,
		isShiftValid,
		isSessionValid && isCustomSessionValid,
		isImageValid
	].filter(Boolean).length;
	$: totalFields = 8;
	$: progressPercentage = Math.round((completedFields / totalFields) * 100);

	function getInputIcon(isValid: boolean, value: string) {
		if (!value) return null;
		return isValid ? 'valid' : 'invalid';
	}

	function handleNext() {
		// Reset validation errors
		validationErrors = [];
		showValidationErrors = false;

		// Prepare data for validation - only include the fields needed for SubmissionData
		const dataToValidate = {
			boardRoll: boardRoll || '',
			classRoll: formData.classRoll || '',
			fullName: formData.fullName || '',
			email: formData.email || '',
			phone: formData.phone || '',
			department: department || '',
			semester: semester || '',
			group: formData.group || '',
			shift: formData.shift || '',
			session: formData.session || '',
			customSession: formData.customSession || '',
			idCardValiditySession: idCardValiditySession || '',
			profileImageUrl: formData.profileImageUrl || ''
		};

		// Run comprehensive validation
		validationErrors = SubmissionService.validateSubmissionData(dataToValidate);

		if (validationErrors.length > 0) {
			showValidationErrors = true;
			addNotification('Please fix the validation errors below', 'error');
			return;
		}

		if (!isFormValid) {
			addNotification('Please complete all required fields correctly', 'error');
			return;
		}

		// Store form data
		submittedFormData.set(dataToValidate);

		// Navigate to review
		currentView.set('review');
		addNotification('Form completed! Please review your information.', 'success');
	}

	function goBack() {
		currentView.set('departments');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-30">
		<div
			class="h-full w-full bg-gradient-to-br from-transparent via-blue-50/30 to-indigo-100/30"
		></div>
	</div>

	<div class="relative px-6 py-12 lg:px-8">
		<div class="mx-auto max-w-4xl">
			<!-- Header -->
			<div class="mb-12 text-center" in:fade={{ duration: 600, delay: 100 }}>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25"
				>
					<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">Student Information</h1>
				<p class="mt-3 text-lg text-gray-600">Complete your profile for ID card application</p>
			</div>

			<!-- Progress Bar -->
			<div class="mb-8" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				<div
					class="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm"
				>
					<div class="mb-3 flex items-center justify-between">
						<span class="text-sm font-semibold text-gray-700">Form Progress</span>
						<span class="text-sm font-bold text-blue-600">{progressPercentage}%</span>
					</div>
					<div class="h-3 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-500 ease-out"
							style="width: {progressPercentage}%"
						></div>
					</div>
					<p class="mt-2 text-xs text-gray-500">
						{completedFields} of {totalFields} sections completed
					</p>
				</div>
			</div>

			<!-- Main Form Container -->
			<div
				class="overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl shadow-gray-900/10 backdrop-blur-sm"
				in:fly={{ y: 30, duration: 600, delay: 300 }}
			>
				<!-- Pre-filled Information Header -->
				<div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
					<h3 class="mb-4 flex items-center text-lg font-bold text-white">
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						Verified Information
					</h3>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
							<p class="text-sm font-medium text-blue-100">Board Roll</p>
							<p class="text-lg font-bold text-white">{boardRoll}</p>
						</div>
						<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
							<p class="text-sm font-medium text-blue-100">Semester</p>
							<p class="text-lg font-bold text-white">{semester}</p>
						</div>
						<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
							<p class="text-sm font-medium text-blue-100">Department</p>
							<p class="text-lg font-bold text-white">{department}</p>
						</div>
					</div>
				</div>

				<!-- Form Content -->
				<form on:submit|preventDefault={handleNext} class="space-y-8 p-8">
					<!-- Validation Errors Summary -->
					{#if showValidationErrors && validationErrors.length > 0}
						<div
							class="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6 shadow-lg"
							in:fly={{ y: -20, duration: 300 }}
						>
							<div class="flex items-start space-x-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 shadow-lg"
								>
									<svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class="flex-1">
									<h4 class="text-lg font-bold text-red-900">Please Fix These Issues</h4>
									<div class="mt-2 space-y-1">
										{#each validationErrors as error}
											<p class="text-sm text-red-800">• {error.message}</p>
										{/each}
									</div>
								</div>
								<button
									aria-label="Close validation errors"
									type="button"
									on:click={() => (showValidationErrors = false)}
									class="text-red-400 hover:text-red-600"
								>
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</div>
					{/if}
					<!-- Personal Information Section -->
					<div class="space-y-6">
						<div class="mb-6 flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
							>
								<svg
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">Personal Information</h3>
								<p class="text-sm text-gray-600">Enter your basic details</p>
							</div>
						</div>

						<!-- Full Name -->
						<div class="space-y-2">
							<label for="fullName" class="block text-sm font-semibold text-gray-900">
								Full Name <span class="text-red-500">*</span>
							</label>
							<div class="relative">
								<input
									id="fullName"
									type="text"
									bind:value={formData.fullName}
									placeholder="Enter your full name as per official documents"
									class="block w-full rounded-xl border-2 {getBorderClass(
										isFullNameValid,
										formData.fullName
									)} bg-white/50 px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
								/>
								{#if getInputIcon(isFullNameValid, formData.fullName)}
									<div class="absolute inset-y-0 right-0 flex items-center pr-4">
										{#if getInputIcon(isFullNameValid, formData.fullName) === 'valid'}
											<div class="rounded-full bg-emerald-100 p-1" in:scale={{ duration: 200 }}>
												<svg
													class="h-4 w-4 text-emerald-600"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
											</div>
										{:else}
											<div class="rounded-full bg-red-100 p-1" in:scale={{ duration: 200 }}>
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
							{#if formData.fullName && !isFullNameValid}
								<p
									class="flex items-center text-sm text-red-600"
									in:fly={{ y: -10, duration: 200 }}
								>
									<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
									Full name is required
								</p>
							{/if}
						</div>

						<!-- Class Roll -->
						<div class="space-y-2">
							<label for="classRoll" class="block text-sm font-semibold text-gray-900">
								Class Roll Number <span class="text-red-500">*</span>
							</label>
							<div class="relative">
								<input
									id="classRoll"
									type="text"
									bind:value={formData.classRoll}
									placeholder="Enter your class roll number"
									class="block w-full rounded-xl border-2 {getBorderClass(
										isClassRollValid && rollConflictValid,
										formData.classRoll
									)} bg-white/50 px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
								/>
								{#if getInputIcon(isClassRollValid && rollConflictValid, formData.classRoll)}
									<div class="absolute inset-y-0 right-0 flex items-center pr-4">
										{#if getInputIcon(isClassRollValid && rollConflictValid, formData.classRoll) === 'valid'}
											<div class="rounded-full bg-emerald-100 p-1" in:scale={{ duration: 200 }}>
												<svg
													class="h-4 w-4 text-emerald-600"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
											</div>
										{:else}
											<div class="rounded-full bg-red-100 p-1" in:scale={{ duration: 200 }}>
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
							{#if formData.classRoll && !isClassRollValid}
								<p
									class="flex items-center text-sm text-red-600"
									in:fly={{ y: -10, duration: 200 }}
								>
									<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
									Class roll must be numeric and 1-10 digits
								</p>
							{/if}
							{#if formData.classRoll && isClassRollValid && !rollConflictValid}
								<div
									class="rounded-xl border border-red-200 bg-red-50 p-4"
									in:fly={{ y: -10, duration: 200 }}
								>
									<p class="flex items-center text-sm font-semibold text-red-600">
										<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
										Roll Conflict Detected
									</p>
									<p class="mt-1 text-sm text-red-600">
										Class roll cannot be the same as board roll or have matching first 5 digits
									</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Contact Information Section -->
					<div class="space-y-6">
						<div class="mb-6 flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
							>
								<svg
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">Contact Information</h3>
								<p class="text-sm text-gray-600">How can we reach you?</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<!-- Email -->
							<div class="space-y-2">
								<label for="email" class="block text-sm font-semibold text-gray-900">
									Email Address <span class="text-red-500">*</span>
								</label>
								<div class="relative">
									<input
										id="email"
										type="email"
										bind:value={formData.email}
										placeholder="your.email@example.com"
										class="block w-full rounded-xl border-2 {getBorderClass(
											isEmailValid,
											formData.email
										)} bg-white/50 px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
									/>
									{#if getInputIcon(isEmailValid, formData.email)}
										<div class="absolute inset-y-0 right-0 flex items-center pr-4">
											{#if getInputIcon(isEmailValid, formData.email) === 'valid'}
												<div class="rounded-full bg-emerald-100 p-1" in:scale={{ duration: 200 }}>
													<svg
														class="h-4 w-4 text-emerald-600"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
											{:else}
												<div class="rounded-full bg-red-100 p-1" in:scale={{ duration: 200 }}>
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
								{#if formData.email && !isEmailValid}
									<p
										class="flex items-center text-sm text-red-600"
										in:fly={{ y: -10, duration: 200 }}
									>
										<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
										Please enter a valid email address
									</p>
								{/if}
							</div>

							<!-- Phone -->
							<div class="space-y-2">
								<label for="phone" class="block text-sm font-semibold text-gray-900">
									Phone Number <span class="text-red-500">*</span>
								</label>
								<div class="relative">
									<input
										id="phone"
										type="tel"
										bind:value={formData.phone}
										placeholder="+880 1XXX-XXXXXX"
										class="block w-full rounded-xl border-2 {getBorderClass(
											isPhoneValid,
											formData.phone
										)} bg-white/50 px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
									/>
									{#if getInputIcon(isPhoneValid, formData.phone)}
										<div class="absolute inset-y-0 right-0 flex items-center pr-4">
											{#if getInputIcon(isPhoneValid, formData.phone) === 'valid'}
												<div class="rounded-full bg-emerald-100 p-1" in:scale={{ duration: 200 }}>
													<svg
														class="h-4 w-4 text-emerald-600"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
											{:else}
												<div class="rounded-full bg-red-100 p-1" in:scale={{ duration: 200 }}>
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
								{#if formData.phone && !isPhoneValid}
									<p
										class="flex items-center text-sm text-red-600"
										in:fly={{ y: -10, duration: 200 }}
									>
										<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
										Please enter a valid phone number
									</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Academic Details Section -->
					<div class="space-y-6">
						<div class="mb-6 flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg"
							>
								<svg
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">Academic Details</h3>
								<p class="text-sm text-gray-600">Your class and session information</p>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<!-- Group -->
							<div class="space-y-2">
								<label for="group" class="block text-sm font-semibold text-gray-900">
									Group <span class="text-red-500">*</span>
								</label>
								<select
									id="group"
									bind:value={formData.group}
									class="block w-full rounded-xl border-2 {getBorderClass(
										isGroupValid,
										formData.group
									)} bg-white/50 px-4 py-3.5 text-gray-900 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
								>
									<option value="">Select your group</option>
									<option value="A">Group A</option>
									<option value="B">Group B</option>
									<option value="C">Group C</option>
								</select>
							</div>

							<!-- Shift -->
							<div class="space-y-2">
								<label for="shift" class="block text-sm font-semibold text-gray-900">
									Shift <span class="text-red-500">*</span>
								</label>
								<select
									id="shift"
									bind:value={formData.shift}
									class="block w-full rounded-xl border-2 {getBorderClass(
										isShiftValid,
										formData.shift
									)} bg-white/50 px-4 py-3.5 text-gray-900 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
								>
									<option value="">Select your shift</option>
									<option value="Morning">Morning</option>
									<option value="Day">Day</option>
									<option value="Evening">Evening</option>
								</select>
							</div>
						</div>

						<!-- Session -->
						<div class="space-y-2">
							<label for="session" class="block text-sm font-semibold text-gray-900">
								Session <span class="text-red-500">*</span>
							</label>
							<select
								id="session"
								bind:value={formData.session}
								class="block w-full rounded-xl border-2 {getBorderClass(
									isSessionValid,
									formData.session
								)} bg-white/50 px-4 py-3.5 text-gray-900 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
							>
								<option value="">Select your session</option>
								{#each SessionOptions as session}
									<option value={session}>{session}</option>
								{/each}
							</select>
						</div>

						<!-- Custom Session (conditional) -->
						{#if formData.session === 'Other / Custom Session'}
							<div class="space-y-2" in:fly={{ y: -20, duration: 300 }}>
								<label for="customSession" class="block text-sm font-semibold text-gray-900">
									Custom Session <span class="text-red-500">*</span>
								</label>
								<input
									id="customSession"
									type="text"
									bind:value={formData.customSession}
									placeholder="Enter custom session (e.g., 2025-26)"
									class="block w-full rounded-xl border-2 {getBorderClass(
										isCustomSessionValid,
										formData.customSession
									)} bg-white/50 px-4 py-3.5 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-4 focus:outline-none sm:text-sm"
								/>
								{#if formData.customSession && !isCustomSessionValid}
									<p
										class="flex items-center text-sm text-red-600"
										in:fly={{ y: -10, duration: 200 }}
									>
										<svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
										Custom session is required
									</p>
								{/if}
							</div>
						{/if}

						<!-- ID Card Validity Session (derived) -->
						{#if idCardValiditySession}
							<div
								class="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4"
								in:scale={{ duration: 300 }}
							>
								<div class="flex items-center">
									<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
										<svg class="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm font-semibold text-emerald-900">ID Card Validity Session</p>
										<p class="text-lg font-bold text-emerald-800">{idCardValiditySession}</p>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Profile Image Section -->
					<div class="space-y-6">
						<div class="mb-6 flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg"
							>
								<svg
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">Profile Photo</h3>
								<p class="text-sm text-gray-600">Upload your passport-size photograph</p>
							</div>
						</div>

						<ImageUpload
							bind:imageFile={formData.profileImage}
							bind:imagePreviewUrl={formData.profileImageUrl}
							bind:error={imageError}
						/>
					</div>

					<!-- Form Actions -->
					<div class="flex flex-col gap-4 pt-8 sm:flex-row sm:justify-between">
						<button
							type="button"
							on:click={goBack}
							class="group inline-flex items-center justify-center rounded-2xl border-2 border-gray-200 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-lg focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
						>
							<svg
								class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Departments
						</button>

						<button
							type="submit"
							disabled={!isFormValid}
							class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 focus:outline-none disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
						>
							<span class="relative z-10 flex items-center justify-center">
								Review Information
								<svg
									class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
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
	</div>
</div>
