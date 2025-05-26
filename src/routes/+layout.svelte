<script lang="ts">
	import '../app.css';
	import Notification from '$lib/components/Notification.svelte';
	import InstitutionHeader from '$lib/components/InstitutionHeader.svelte';

	let { children } = $props();
</script>

<!-- Institution Header -->
<InstitutionHeader />

<!-- Main Content -->
<main>
	{@render children()}
</main>

<!-- Global Notification Container -->
<Notification />

<!-- Footer -->
<footer class="mt-16 bg-gray-800 py-8 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<p class="text-sm">© 2025 ঢাকা পলিটেকনিক ইনস্টিটিউট | Dhaka Polytechnic Institute</p>
			<p class="mt-2 text-xs text-gray-400">
				কারিগরি শিক্ষা অধিদপ্তর | Directorate of Technical Education
			</p>
		</div>
	</div>
</footer>
