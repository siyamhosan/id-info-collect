import { writable } from 'svelte/store';
import type { SubmissionData } from '$lib/utils/submission';

export interface UserSession {
    boardRoll: string;
    semester: string;
    department: string;
}

export const loggedInUser = writable<UserSession | null>(null);
export const submittedFormData = writable<SubmissionData | null>(null);
