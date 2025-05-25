<script lang="ts">
	import { submittedFormData } from '$lib/stores/userSession';
	import { currentView } from '$lib/stores/currentView';
	import { fade, fly } from 'svelte/transition';
	import { Departments } from '$lib/utils/data';

	$: formData = $submittedFormData as unknown as any;

	// Generate unique confirmation number
	$: confirmationNumber = formData
		? `IDC-${formData.boardRoll}-${Date.now().toString().slice(-6)}`
		: '';

	function startNew() {
		// Clear form data
		submittedFormData.set(null);
		// Clear localStorage submission tracking
		try {
			const submittedRolls = JSON.parse(localStorage.getItem('submittedRolls') || '{}');
			if (formData?.boardRoll) {
				delete submittedRolls[formData.boardRoll];
				localStorage.setItem('submittedRolls', JSON.stringify(submittedRolls));
			}
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
		// Navigate back to login
		currentView.set('login');
	}

	function printPage() {
		window.print();
	}

	// Get department full name for display
	/**
	 * @param {string} code
	 */
	function getDepartmentFullName(code: string) {
		return Departments.find((department) => department.code === code)?.name || code;
	}

	// Format date for display
	/**
	 * @param {Date} date
	 */
	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<div class="print-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Background Pattern (hidden in print) -->
	<div class="no-print absolute inset-0 opacity-30">
		<div
			class="h-full w-full bg-gradient-to-br from-transparent via-blue-50/30 to-indigo-100/30"
		></div>
	</div>

	<div class="relative px-6 py-8 lg:px-8">
		<div class="mx-auto max-w-4xl">
			{#if formData}
				<!-- Header Section -->
				<div class="print-section mb-6 text-center" in:fade={{ duration: 600, delay: 100 }}>
					<!-- Success Icon (hidden in print) -->
					<div
						class="no-print confirmation-badge mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25"
					>
						<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<!-- Print Header -->
					<div
						class="print-header gradient-bg rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4"
					>
						<h1 class="print-title text-2xl font-bold tracking-tight text-gray-900">
							ID Card Application Confirmation
						</h1>
						<p class="mt-1 text-sm text-gray-600">Application Successfully Submitted</p>

						<!-- Confirmation Number -->
						<div class="mt-3 inline-flex items-center rounded-lg bg-emerald-100 px-4 py-2">
							<span class="text-xs font-medium text-emerald-900">Confirmation #:</span>
							<span class="print-value ml-2 text-sm font-bold text-emerald-800"
								>{confirmationNumber}</span
							>
						</div>
					</div>
				</div>

				<!-- Student Information Card -->
				<div class="print-section mb-4" in:fly={{ y: 30, duration: 600, delay: 200 }}>
					<div
						class="print-card overflow-hidden rounded-xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-sm"
					>
						<!-- Student Profile Header -->
						<div
							class="gradient-bg border-2 border-white/20 bg-gradient-to-r from-blue-600 to-indigo-700 p-4"
						>
							<div
								class="flex flex-col items-center space-y-3 md:flex-row md:space-y-0 md:space-x-4"
							>
								<!-- Profile Image -->
								{#if formData.profileImageUrl}
									<div class="relative">
										<img
											src={formData.profileImageUrl}
											alt="Profile"
											class="h-20 w-20 rounded-lg border-2 border-white object-cover shadow-lg"
										/>
									</div>
								{/if}

								<!-- Student Basic Info -->
								<div class="flex-1 text-center md:text-left">
									<h2 class="print-title text-xl font-bold text-white">{formData.fullName}</h2>
									<p class="mt-1 text-sm text-blue-100">
										{getDepartmentFullName(formData.department)}
									</p>

									<div class="mt-3 grid grid-cols-3 gap-2">
										<div class="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
											<p class="text-xs font-medium text-blue-100">Board Roll</p>
											<p class="print-value text-sm font-bold text-white">{formData.boardRoll}</p>
										</div>
										<div class="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
											<p class="text-xs font-medium text-blue-100">Class Roll</p>
											<p class="print-value text-sm font-bold text-white">{formData.classRoll}</p>
										</div>
										<div class="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
											<p class="text-xs font-medium text-blue-100">Semester</p>
											<p class="print-value text-sm font-bold text-white">{formData.semester}</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Detailed Information -->
						<div class="application-details space-y-4 p-4">
							<!-- Personal & Academic Information Combined -->
							<div class="print-spacing">
								<h3 class="details-header mb-4 flex items-center text-lg font-bold text-gray-900">
									<div class="mr-3 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
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
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									Application Details
								</h3>

								<div class="details-grid grid grid-cols-2 gap-4 text-sm">
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">Full Name</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.fullName}
										</p>
									</div>
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">Email Address</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.email}
										</p>
									</div>
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">Phone Number</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.phone}
										</p>
									</div>
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">Department</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.department}
										</p>
									</div>
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">Group & Shift</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.group} • {formData.shift}
										</p>
									</div>
									<div class="detail-card rounded-lg border border-gray-200 bg-gray-50 p-4">
										<p class="detail-label mb-1 text-xs font-medium text-gray-600">
											ID Card Validity
										</p>
										<p class="detail-value print-value font-semibold text-gray-900">
											{formData.idCardValiditySession}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Important Instructions -->
				<div class="print-section mb-4" in:fly={{ y: 20, duration: 600, delay: 400 }}>
					<div
						class="gradient-bg rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-lg"
					>
						<h4 class="mb-3 text-lg font-bold text-amber-900">Important Instructions</h4>
						<div class="space-y-2 text-sm">
							<div class="flex items-start space-x-2">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800"
									>1</span
								>
								<p class="text-amber-800">
									<strong>Processing:</strong> ID card will be ready within 5-7 business days.
								</p>
							</div>
							<div class="flex items-start space-x-2">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800"
									>2</span
								>
								<p class="text-amber-800">
									<strong>Notification:</strong> Email notification will be sent to
									<strong>{formData.email}</strong>.
								</p>
							</div>
							<div class="flex items-start space-x-2">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800"
									>3</span
								>
								<p class="text-amber-800">
									<strong>Collection:</strong> Bring this confirmation and valid ID for collection.
								</p>
							</div>
							<div class="flex items-start space-x-2">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800"
									>4</span
								>
								<p class="text-amber-800">
									<strong>Contact:</strong> admin@university.edu | +880-XXX-XXXXXX
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Office Use Section & Submission Info -->
				<div class="print-section mb-4">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Office Use -->
						<div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4">
							<h4 class="mb-3 text-sm font-bold text-gray-900">For Office Use Only</h4>
							<div class="space-y-2 text-xs">
								<div>
									<p class="font-medium text-gray-600">Processed By:</p>
									<div class="mt-1 h-4 border-b border-gray-300"></div>
								</div>
								<div>
									<p class="font-medium text-gray-600">Date Processed:</p>
									<div class="mt-1 h-4 border-b border-gray-300"></div>
								</div>
								<div>
									<p class="font-medium text-gray-600">Card Ready:</p>
									<div class="mt-1 h-4 border-b border-gray-300"></div>
								</div>
							</div>
						</div>

						<!-- Submission Info -->
						<div class="rounded-xl border border-gray-200 bg-blue-50 p-4">
							<h4 class="mb-3 text-sm font-bold text-blue-900">Submission Information</h4>
							<div class="space-y-2 text-xs">
								<div class="flex justify-between">
									<span class="font-medium text-blue-700">Submitted:</span>
									<span class="print-value font-semibold text-blue-900"
										>{formatDate(new Date())}</span
									>
								</div>
								<div class="flex justify-between">
									<span class="font-medium text-blue-700">Status:</span>
									<span class="print-value font-semibold text-green-700">Confirmed</span>
								</div>
								<div class="flex justify-between">
									<span class="font-medium text-blue-700">Reference:</span>
									<span class="print-value font-semibold text-blue-900">{confirmationNumber}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Action Buttons (hidden in print) -->
				<div
					class="no-print flex flex-col gap-3 sm:flex-row sm:justify-center"
					in:fly={{ y: 20, duration: 600, delay: 500 }}
				>
					<button
						type="button"
						on:click={printPage}
						class="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
							/>
						</svg>
						Print Confirmation
					</button>

					<button
						type="button"
						on:click={startNew}
						class="group inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-lg focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Submit Another Application
					</button>
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
					<h3 class="text-2xl font-bold text-gray-900">No Submission Found</h3>
					<p class="mt-2 text-gray-600">Please complete and submit an application first.</p>
					<button
						on:click={() => currentView.set('login')}
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
						Start New Application
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Print Styles -->
<style>
	@media print {
		/* A4 page optimization */
		@page {
			size: A4;
			margin: 15mm;
		}

		/* Hide non-essential elements when printing */
		.no-print {
			display: none !important;
		}

		/* Optimize page layout for printing */
		.print-container {
			max-width: none !important;
			margin: 0 !important;
			padding: 0 !important;
			background: white !important;
			box-shadow: none !important;
			font-size: 12px !important;
		}

		/* Ensure proper page breaks */
		.print-section {
			break-inside: avoid;
			page-break-inside: avoid;
			margin-bottom: 8px !important;
		}

		/* Optimize colors for print */
		.print-header {
			background: #f8f9fa !important;
			border: 2px solid #000 !important;
			color: #000 !important;
			padding: 8px !important;
		}

		.print-card {
			background: white !important;
			border: 1px solid #000 !important;
			box-shadow: none !important;
		}

		/* Ensure text is readable */
		* {
			color: #000 !important;
			background: transparent !important;
		}

		/* Specific overrides for important elements */
		.print-title {
			color: #000 !important;
			background: transparent !important;
			font-size: 18px !important;
		}

		.print-value {
			color: #000 !important;
			font-weight: bold !important;
		}

		/* Hide gradients and shadows */
		.gradient-bg {
			background: #f8f9fa !important;
		}

		/* Ensure proper spacing */
		.print-spacing {
			margin-bottom: 6px !important;
		}

		/* Compact text sizes for print */
		h1 {
			font-size: 18px !important;
		}
		h2 {
			font-size: 16px !important;
		}
		h3 {
			font-size: 14px !important;
		}
		h4 {
			font-size: 12px !important;
		}
		p,
		div {
			font-size: 11px !important;
		}

		/* Reduce image size for print */
		img {
			max-width: 60px !important;
			max-height: 60px !important;
		}

		/* Compact grid spacing */
		.grid {
			gap: 4px !important;
		}

		/* Application Details specific styling */
		.application-details {
			padding: 8px !important;
		}

		.details-header {
			margin-bottom: 6px !important;
			font-size: 14px !important;
		}

		.details-grid {
			gap: 6px !important;
		}

		.detail-card {
			padding: 8px !important;
			border: 1px solid #ccc !important;
			background: #f9f9f9 !important;
		}

		.detail-label {
			font-size: 10px !important;
			margin-bottom: 2px !important;
			color: #666 !important;
		}

		.detail-value {
			font-size: 12px !important;
			font-weight: bold !important;
			color: #000 !important;
		}

		/* Reduce padding for print */
		.p-4 {
			padding: 6px !important;
		}

		.p-2 {
			padding: 3px !important;
		}

		/* Compact margins */
		.mb-6 {
			margin-bottom: 8px !important;
		}
		.mb-4 {
			margin-bottom: 6px !important;
		}
		.mb-3 {
			margin-bottom: 4px !important;
		}
		.mb-1 {
			margin-bottom: 2px !important;
		}
		.mt-6 {
			margin-top: 8px !important;
		}

		.mt-3 {
			margin-top: 4px !important;
		}
	}

	/* Screen styles for better visual appeal */
	@media screen {
		.confirmation-badge {
			animation: pulse 2s infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.8;
			}
		}
	}
</style>
