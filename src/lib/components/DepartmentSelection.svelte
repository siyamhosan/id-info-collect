<script lang="ts">
	import { loggedInUser } from '$lib/stores/userSession';
	import { currentView } from '$lib/stores/currentView';
	import { addNotification } from '$lib/stores/notifications';
	import { fade, fly, scale } from 'svelte/transition';
	import { INSTITUTION_BRANDING, getDepartmentByCode } from '$lib/utils/branding';

	let searchTerm = '';

	$: filteredDepartments = INSTITUTION_BRANDING.departments.filter(
		(dept) =>
			dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
			dept.bangla.includes(searchTerm)
	);

	function selectDepartment(departmentCode: string) {
		const department = getDepartmentByCode(departmentCode);
		if (!department) return;

		// Update user session with department
		loggedInUser.update((user: any) => {
			if (!user) return null;
			return {
				...user,
				department: department.code
			};
		});

		// Navigate to form
		currentView.set('form');
		addNotification(`Department selected: ${department.name}`, 'success');
	}

	function goBack() {
		currentView.set('login');
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
		<div class="mx-auto max-w-6xl">
			<!-- Header -->
			<div class="mb-12 text-center" in:fade={{ duration: 600, delay: 100 }}>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25"
				>
					<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
				</div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">Select Your Department</h1>
				<p class="mt-3 text-lg text-gray-600">
					Choose your academic department to continue with the application
				</p>
			</div>

			<!-- Search Bar -->
			<div class="mx-auto mb-10 max-w-md" in:fly={{ y: 20, duration: 600, delay: 200 }}>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Search departments..."
						class="block w-full rounded-2xl border-2 border-gray-200 bg-white/80 py-4 pr-4 pl-12 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none sm:text-sm"
					/>
					{#if searchTerm}
						<button
							aria-label="Clear search"
							on:click={() => (searchTerm = '')}
							class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
						>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<!-- Department Grid -->
			<div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredDepartments as department, index (department.code)}
					<div
						in:fly={{ y: 30, duration: 400, delay: 300 + index * 50 }}
						out:scale={{ duration: 200 }}
						class="group"
					>
						<button
							aria-label={`Select ${department.name}`}
							on:click={() => selectDepartment(department.code)}
							class="relative w-full overflow-hidden rounded-2xl bg-white/80 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/10 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"
						>
							<!-- Background Gradient -->
							<div
								class="absolute inset-0 bg-gradient-to-br {department.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10"
							></div>

							<!-- Content -->
							<div class="relative">
								<div class="mb-4 flex items-center justify-between">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br {department.color} shadow-lg"
									>
										<span class="text-2xl">{department.icon}</span>
									</div>
									<div class="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<svg
											class="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>
								</div>
								<div>
									<h3 class="text-lg font-bold text-gray-900 group-hover:text-gray-800">
										{department.code}
									</h3>
									<p class="mt-1 text-sm text-gray-600 group-hover:text-gray-700">
										{department.name}
									</p>
								</div>
							</div>

							<!-- Hover Effect -->
							<div
								class="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/50 to-white/0 transition-transform duration-700 group-hover:translate-x-[100%]"
							></div>
						</button>
					</div>
				{/each}
			</div>

			<!-- No Results -->
			{#if filteredDepartments.length === 0}
				<div class="py-16 text-center" in:fade={{ duration: 300 }}>
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"
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
								d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900">No departments found</h3>
					<p class="mt-2 text-gray-600">
						Try adjusting your search terms or browse all departments.
					</p>
					<button
						aria-label="Show all departments"
						on:click={() => (searchTerm = '')}
						class="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						Show All Departments
					</button>
				</div>
			{/if}

			<!-- Back Button -->
			<div class="flex justify-center" in:fade={{ duration: 600, delay: 400 }}>
				<button
					on:click={goBack}
					class="group inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-lg focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
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
					Back to Login
				</button>
			</div>
		</div>
	</div>
</div>
