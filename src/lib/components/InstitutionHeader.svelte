<script lang="ts">
	import { INSTITUTION_BRANDING } from '$lib/utils/branding';
	import { fade } from 'svelte/transition';
</script>

<!-- Government Portal Header -->
<div class="bg-gradient-to-r from-green-600 to-green-700 py-2">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between text-sm text-white">
			<div class="flex items-center space-x-4">
				<span class="font-medium">{INSTITUTION_BRANDING.government.portalBangla}</span>
				<span class="hidden sm:inline">|</span>
				<span class="hidden sm:inline">{INSTITUTION_BRANDING.government.portal}</span>
			</div>
			<div class="flex items-center space-x-4">
				<span class="text-xs">{INSTITUTION_BRANDING.government.ministryBangla}</span>
			</div>
		</div>
	</div>
</div>

<!-- Institution Header -->
<header class="border-b-4 border-blue-600 bg-white shadow-lg" in:fade={{ duration: 600 }}>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-6">
			<!-- Logo and Institution Name -->
			<div class="flex items-center space-x-6">
				<!-- Institution Logo -->
				<div class="flex-shrink-0">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg"
					>
						<!-- Placeholder for actual logo -->
						<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
							/>
						</svg>
					</div>
				</div>

				<!-- Institution Names -->
				<div>
					<h1 class="text-2xl font-bold text-gray-900 lg:text-3xl">
						{INSTITUTION_BRANDING.name.bangla}
					</h1>
					<p class="text-lg font-semibold text-blue-600 lg:text-xl">
						{INSTITUTION_BRANDING.name.english}
					</p>
					<p class="text-sm text-gray-600">
						{INSTITUTION_BRANDING.government.departmentBangla} | Est. {INSTITUTION_BRANDING.established}
					</p>
				</div>
			</div>

			<!-- Contact Information -->
			<div class="hidden lg:block">
				<div class="text-right">
					<p class="text-sm font-medium text-gray-900">
						{INSTITUTION_BRANDING.contact.address.bangla}
					</p>
					<p class="text-sm text-gray-600">{INSTITUTION_BRANDING.contact.address.english}</p>
					<p class="text-sm text-blue-600">{INSTITUTION_BRANDING.contact.phone}</p>
				</div>
			</div>
		</div>
	</div>
</header>
