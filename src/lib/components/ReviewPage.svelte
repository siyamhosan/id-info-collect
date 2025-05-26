<script lang="ts">
	import { submittedFormData } from '$lib/stores/userSession';
	import { currentView } from '$lib/stores/currentView';
	import { addNotification } from '$lib/stores/notifications';
	import { fade, fly, scale } from 'svelte/transition';
	import { Departments } from '$lib/utils/data';
	import { SubmissionService, type SubmissionData } from '$lib/utils/submission';

	$: formData = $submittedFormData as unknown as any;

	let isSubmitting = false;
	let submissionErrors: string[] = [];

	function goBack() {
		currentView.set('form');
	}

	async function handleSubmit() {
		if (isSubmitting || !formData) return;

		isSubmitting = true;
		submissionErrors = [];
		addNotification('Submitting your application...', 'info');

		try {
			// Prepare submission data
			const submissionData: SubmissionData = {
				boardRoll: formData.boardRoll,
				classRoll: formData.classRoll,
				fullName: formData.fullName,
				email: formData.email,
				phone: formData.phone,
				department: formData.department,
				semester: formData.semester,
				group: formData.group,
				shift: formData.shift,
				session: formData.session,
				customSession: formData.customSession,
				idCardValiditySession: formData.idCardValiditySession,
				profileImageUrl: formData.profileImageUrl
			};

			// Submit using the submission service
			const result = await SubmissionService.submitApplication(submissionData);

			if (result.success) {
				// Add the submissionId to the form data before storing
				const dataWithSubmissionId = {
					...submissionData,
					submissionId: result.submissionId
				};

				// Update the stored form data with submission ID
				submittedFormData.set(dataWithSubmissionId);

				// Navigate to success page
				currentView.set('success');
			} else {
				// Handle submission errors
				submissionErrors = [];

				// Handle validation errors from server
				if (result.errors) {
					if (Array.isArray(result.errors)) {
						// Handle array of error objects
						submissionErrors = result.errors.map((error: any) => error.message || error);
					} else if (typeof result.errors === 'object') {
						// Handle validation errors object (field-specific errors)
						for (const [field, fieldErrors] of Object.entries(result.errors)) {
							if (Array.isArray(fieldErrors)) {
								fieldErrors.forEach((error: string) => {
									submissionErrors.push(`${getFieldDisplayName(field)}: ${error}`);
								});
							} else {
								submissionErrors.push(`${getFieldDisplayName(field)}: ${fieldErrors}`);
							}
						}
					}
				}

				// If no specific errors found, use the general message
				if (submissionErrors.length === 0) {
					submissionErrors = [result.message || 'Submission failed'];
				}

				// Show error notification
				addNotification('Please fix the errors below and try again', 'error');
			}
		} catch (error) {
			console.error('Submission error:', error);
			submissionErrors = ['An unexpected error occurred. Please try again.'];
			addNotification('Submission failed. Please try again.', 'error');
		} finally {
			isSubmitting = false;
		}
	}

	// Get department full name for display
	/**
	 * @param {string} code
	 */
	function getDepartmentFullName(code: string) {
		return Departments.find((department) => department.code === code)?.name || code;
	}

	// Convert field names to user-friendly display names
	/**
	 * @param {string} fieldName
	 */
	function getFieldDisplayName(fieldName: string): string {
		const fieldMap: Record<string, string> = {
			boardRoll: 'Board Roll',
			classRoll: 'Class Roll',
			fullName: 'Full Name',
			email: 'Email Address',
			phone: 'Phone Number',
			department: 'Department',
			semester: 'Semester',
			group: 'Group',
			shift: 'Shift',
			session: 'Session',
			customSession: 'Custom Session',
			idCardValiditySession: 'ID Card Validity Session',
			profileImageUrl: 'Profile Image',
			profileImage: 'Profile Image'
		};

		return fieldMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
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
		<div class="mx-auto max-w-5xl">
			<!-- Header -->
			<div class="mb-12 text-center" in:fade={{ duration: 600, delay: 100 }}>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25"
				>
					<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">Review Your Information</h1>
				<p class="mt-3 text-lg text-gray-600">Please verify all details before final submission</p>
			</div>

			{#if formData}
				<!-- Main Review Container -->
				<div class="space-y-8" in:fly={{ y: 30, duration: 600, delay: 200 }}>
					<!-- Student Profile Card -->
					<div
						class="overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-xl shadow-gray-900/10 backdrop-blur-sm"
					>
						<!-- Header with Profile Image -->
						<div class="bg-gradient-to-r from-emerald-600 to-green-800 p-8">
							<div
								class="flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-8"
							>
								<!-- Profile Image -->
								{#if formData.profileImageUrl}
									<div class="relative" in:scale={{ duration: 400, delay: 300 }}>
										<img
											src={formData.profileImageUrl}
											alt="Profile"
											class="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-xl shadow-emerald-900/30"
										/>
										<div class="absolute -right-2 -bottom-2 rounded-full bg-white p-2 shadow-lg">
											<svg class="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									</div>
								{/if}

								<!-- Student Info -->
								<div class="flex-1 text-center md:text-left">
									<h2 class="text-3xl font-bold text-white">{formData.fullName}</h2>
									<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
										<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
											<p class="text-sm font-medium text-emerald-100">Board Roll</p>
											<p class="text-xl font-bold text-white">{formData.boardRoll}</p>
										</div>
										<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
											<p class="text-sm font-medium text-emerald-100">Class Roll</p>
											<p class="text-xl font-bold text-white">{formData.classRoll}</p>
										</div>
										<div class="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
											<p class="text-sm font-medium text-emerald-100">Department</p>
											<p class="text-xl font-bold text-white">{formData.department}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Information Sections -->
						<div class="space-y-8 p-8">
							<!-- Contact Information -->
							<div class="space-y-6">
								<div class="flex items-center space-x-3">
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
										<p class="text-sm text-gray-600">How we'll reach you</p>
									</div>
								</div>

								<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
									>
										<div class="flex items-center space-x-3">
											<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
												<svg
													class="h-4 w-4 text-blue-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
													/>
												</svg>
											</div>
											<div>
												<p class="text-sm font-medium text-blue-900">Email Address</p>
												<p class="text-lg font-semibold text-blue-800">{formData.email}</p>
											</div>
										</div>
									</div>

									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6"
									>
										<div class="flex items-center space-x-3">
											<div
												class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100"
											>
												<svg
													class="h-4 w-4 text-purple-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
													/>
												</svg>
											</div>
											<div>
												<p class="text-sm font-medium text-purple-900">Phone Number</p>
												<p class="text-lg font-semibold text-purple-800">{formData.phone}</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Academic Information -->
							<div class="space-y-6">
								<div class="flex items-center space-x-3">
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
										<p class="text-sm text-gray-600">Your academic information</p>
									</div>
								</div>

								<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6"
									>
										<div class="text-center">
											<div
												class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100"
											>
												<svg
													class="h-6 w-6 text-emerald-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
													/>
												</svg>
											</div>
											<p class="text-sm font-medium text-emerald-900">Department</p>
											<p class="mt-1 text-xs text-emerald-700">
												{getDepartmentFullName(formData.department)}
											</p>
										</div>
									</div>

									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6"
									>
										<div class="text-center">
											<div
												class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100"
											>
												<svg
													class="h-6 w-6 text-blue-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
													/>
												</svg>
											</div>
											<p class="text-sm font-medium text-blue-900">Semester</p>
											<p class="text-lg font-bold text-blue-800">{formData.semester}</p>
										</div>
									</div>

									<div
										class="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
									>
										<div class="text-center">
											<div
												class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100"
											>
												<svg
													class="h-6 w-6 text-amber-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
											</div>
											<p class="text-sm font-medium text-amber-900">Group & Shift</p>
											<p class="text-lg font-bold text-amber-800">
												{formData.group} • {formData.shift}
											</p>
										</div>
									</div>
								</div>

								<!-- Session Information -->
								<div
									class="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6"
								>
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100"
											>
												<svg
													class="h-5 w-5 text-indigo-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<div>
												<p class="text-sm font-medium text-indigo-900">ID Card Validity Session</p>
												<p class="text-2xl font-bold text-indigo-800">
													{formData.idCardValiditySession}
												</p>
											</div>
										</div>
										<div class="rounded-full bg-indigo-100 p-3">
											<svg class="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Important Notice -->
					<div
						class="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8 shadow-lg shadow-amber-500/10"
						in:fly={{ y: 20, duration: 600, delay: 400 }}
					>
						<div class="flex items-start space-x-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
							>
								<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<h4 class="text-xl font-bold text-amber-900">Final Review Notice</h4>
								<p class="mt-2 leading-relaxed text-amber-800">
									Please carefully review all information above. Once submitted, changes may not be
									possible without contacting the administration. Ensure all details are accurate,
									especially your contact information and academic details.
								</p>
								<div class="mt-4 grid grid-cols-1 gap-2 text-sm text-amber-700 md:grid-cols-2">
									<div class="flex items-center">
										<svg
											class="mr-2 h-4 w-4 text-amber-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										Verify contact information
									</div>
									<div class="flex items-center">
										<svg
											class="mr-2 h-4 w-4 text-amber-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										Check academic details
									</div>
									<div class="flex items-center">
										<svg
											class="mr-2 h-4 w-4 text-amber-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										Confirm profile photo
									</div>
									<div class="flex items-center">
										<svg
											class="mr-2 h-4 w-4 text-amber-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										Review roll numbers
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Submission Errors -->
					{#if submissionErrors.length > 0}
						<div
							class="rounded-3xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 p-8 shadow-xl shadow-red-500/20"
							in:fly={{ y: -20, duration: 300 }}
						>
							<div class="flex items-start space-x-4">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg"
								>
									<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class="flex-1">
									<h4 class="text-xl font-bold text-red-900">Please Fix These Issues</h4>
									<p class="mt-1 text-sm text-red-700">
										The following errors need to be corrected before submission:
									</p>
									<div class="mt-4 space-y-3">
										{#each submissionErrors as error}
											<div
												class="flex items-start space-x-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
											>
												<div
													class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100"
												>
													<svg class="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
														<path
															fill-rule="evenodd"
															d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
												<p class="text-sm font-medium text-red-800">{error}</p>
											</div>
										{/each}
									</div>
									<div class="mt-6 flex items-center space-x-3 rounded-xl bg-amber-50 p-4">
										<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
											<svg class="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<p class="text-sm font-medium text-amber-800">What to do next:</p>
											<p class="mt-1 text-xs text-amber-700">
												Click "Edit Information" below to go back and fix these issues, then return
												to review and submit again.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Action Buttons -->
					<div
						class="flex flex-col gap-4 sm:flex-row sm:justify-between"
						in:fly={{ y: 20, duration: 600, delay: 500 }}
					>
						<button
							type="button"
							on:click={goBack}
							disabled={isSubmitting}
							class="group inline-flex items-center justify-center rounded-2xl border-2 border-gray-200 bg-white/80 px-8 py-4 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-lg focus:ring-4 focus:ring-gray-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<svg
								class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 17l-5-5m0 0l5-5m-5 5h12"
								/>
							</svg>
							Edit Information
						</button>

						<button
							type="button"
							on:click={handleSubmit}
							disabled={isSubmitting}
							class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:shadow-emerald-500/30 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
						>
							<span class="relative z-10 flex items-center justify-center">
								{#if isSubmitting}
									<svg class="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
											d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Submitting Application...
								{:else}
									Confirm & Submit Application
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
											d="M5 13l4 4L19 7"
										/>
									</svg>
								{/if}
							</span>

							<!-- Hover effect -->
							{#if !isSubmitting}
								<div
									class="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-[100%]"
								></div>
							{/if}
						</button>
					</div>
				</div>
			{:else}
				<!-- No Data State -->
				<div class="py-16 text-center" in:fade={{ duration: 600, delay: 200 }}>
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"
					>
						<svg
							class="h-8 w-8 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-gray-900">No Information to Review</h3>
					<p class="mt-2 text-gray-600">Please complete the student information form first.</p>
					<button
						on:click={() => currentView.set('form')}
						class="mt-6 inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Go to Form
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
