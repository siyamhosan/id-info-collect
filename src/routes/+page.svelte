<script lang="ts">
	import { currentView } from '$lib/stores/currentView';
	import LoginPage from '$lib/components/LoginPage.svelte';
	import DepartmentSelection from '$lib/components/DepartmentSelection.svelte';
	import StudentInfoForm from '$lib/components/StudentInfoForm.svelte';
	import ReviewPage from '$lib/components/ReviewPage.svelte';
	import SubmissionSuccess from '$lib/components/SubmissionSuccess.svelte';
</script>

{#if $currentView === 'login'}
	<LoginPage />
{:else if $currentView === 'departments'}
	<DepartmentSelection />
{:else if $currentView === 'form'}
	<StudentInfoForm />
{:else if $currentView === 'review'}
	<ReviewPage />
{:else if $currentView === 'success'}
	<SubmissionSuccess />
{:else}
	<LoginPage />
{/if}
