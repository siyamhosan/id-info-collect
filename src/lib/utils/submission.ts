import { addNotification, type NotificationType } from '$lib/stores/notifications';

export interface SubmissionData {
    boardRoll: string;
    classRoll: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    semester: string;
    group: string;
    shift: string;
    session: string;
    customSession?: string;
    idCardValiditySession: string;
    profileImageUrl: string;
}

export interface SubmissionResponse {
    success: boolean;
    message: string;
    submissionId?: string;
    data?: any;
    errors?: any;
}

export interface ValidationError {
    field: string;
    message: string;
}

export class SubmissionService {
    private static readonly API_ENDPOINT = '/api/submit';
    private static readonly CHECK_ENDPOINT = '/api/check';

    /**
     * Client-side validation before submission
     */
    static validateSubmissionData(data: SubmissionData): ValidationError[] {
        const errors: ValidationError[] = [];

        // Debug: Log the data being validated
        console.log('Validating submission data:', data);

        // Required field validation
        if (!data.fullName?.trim()) {
            errors.push({ field: 'fullName', message: 'Full name is required' });
            console.log('Validation error: Full name is required');
        }

        if (!data.boardRoll?.trim()) {
            errors.push({ field: 'boardRoll', message: 'Board roll is required' });
            console.log('Validation error: Board roll is required');
        } else if (!/^\d{6}$/.test(data.boardRoll)) {
            errors.push({ field: 'boardRoll', message: 'Board roll must be exactly 6 digits' });
            console.log('Validation error: Board roll format invalid:', data.boardRoll);
        }

        if (!data.classRoll?.trim()) {
            errors.push({ field: 'classRoll', message: 'Class roll is required' });
            console.log('Validation error: Class roll is required');
        } else if (!/^\d{1,10}$/.test(data.classRoll)) {
            errors.push({ field: 'classRoll', message: 'Class roll must be 1-10 digits' });
            console.log('Validation error: Class roll format invalid:', data.classRoll);
        }

        // Roll conflict validation
        if (data.boardRoll && data.classRoll) {
            if (data.boardRoll === data.classRoll) {
                errors.push({ field: 'classRoll', message: 'Board roll and class roll cannot be the same' });
                console.log('Validation error: Board roll and class roll are the same');
            }

            const boardPrefix = data.boardRoll.substring(0, 5);
            const classPrefix = data.classRoll.substring(0, 5);
            if (boardPrefix === classPrefix) {
                errors.push({ field: 'classRoll', message: 'First 5 digits of board roll and class roll cannot match' });
                console.log('Validation error: First 5 digits match');
            }
        }

        // Email validation
        if (!data.email?.trim()) {
            errors.push({ field: 'email', message: 'Email is required' });
            console.log('Validation error: Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
            console.log('Validation error: Email format invalid:', data.email);
        }

        // Phone validation
        if (!data.phone?.trim()) {
            errors.push({ field: 'phone', message: 'Phone number is required' });
            console.log('Validation error: Phone is required');
        } else {
            const cleanPhone = data.phone.replace(/[\s-]/g, '');
            if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
                errors.push({ field: 'phone', message: 'Please enter a valid Bangladesh phone number' });
                console.log('Validation error: Phone format invalid:', data.phone, 'cleaned:', cleanPhone);
            }
        }

        // Academic fields validation
        if (!data.department?.trim()) {
            errors.push({ field: 'department', message: 'Department is required' });
            console.log('Validation error: Department is required');
        }

        if (!data.semester?.trim()) {
            errors.push({ field: 'semester', message: 'Semester is required' });
            console.log('Validation error: Semester is required');
        }

        if (!data.group?.trim()) {
            errors.push({ field: 'group', message: 'Group is required' });
            console.log('Validation error: Group is required');
        }

        if (!data.shift?.trim()) {
            errors.push({ field: 'shift', message: 'Shift is required' });
            console.log('Validation error: Shift is required');
        }

        if (!data.session?.trim()) {
            errors.push({ field: 'session', message: 'Session is required' });
            console.log('Validation error: Session is required');
        }

        // Custom session validation
        if (data.session === 'Other / Custom Session' && !data.customSession?.trim()) {
            errors.push({ field: 'customSession', message: 'Custom session is required' });
            console.log('Validation error: Custom session is required');
        }

        // Profile image validation
        if (!data.profileImageUrl?.trim()) {
            errors.push({ field: 'profileImage', message: 'Profile image is required' });
            console.log('Validation error: Profile image is required');
        }

        console.log('Total validation errors:', errors.length, errors);
        return errors;
    }

    /**
     * Check if a board roll has already been submitted
     */
    static async checkExistingSubmission(boardRoll: string): Promise<boolean> {
        try {
            const response = await fetch(this.CHECK_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rollId: boardRoll })
            });

            const result = await response.json();
            // API returns success: false if roll already exists
            return !result.success;
        } catch (error) {
            console.error('Error checking existing submission:', error);
            return false;
        }
    }

    /**
 * Submit the application data
 */
    static async submitApplication(data: SubmissionData): Promise<SubmissionResponse> {
        try {
            // Client-side validation
            const validationErrors = this.validateSubmissionData(data);

            if (validationErrors.length > 0) {
                const errorMessage = validationErrors.map(e => e.message).join(', ');
                addNotification(`Validation failed: ${errorMessage}`, 'error');
                return {
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                };
            }

            // Check for existing submission
            const alreadyExists = await this.checkExistingSubmission(data.boardRoll);
            if (alreadyExists) {
                addNotification('This board roll has already been submitted', 'warning');
                return {
                    success: false,
                    message: 'Board roll already submitted'
                };
            }

            // Submit to server
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result: SubmissionResponse = await response.json();

            if (result.success) {
                // Store submission in localStorage for duplicate prevention
                this.markAsSubmitted(data.boardRoll, result.submissionId || '');
                addNotification('Application submitted successfully!', 'success');
            } else {
                addNotification(result.message || 'Submission failed', 'error');
            }

            return result;

        } catch (error) {
            console.error('Submission error:', error);
            const errorMessage = 'Network error occurred. Please check your connection and try again.';
            addNotification(errorMessage, 'error');
            return {
                success: false,
                message: errorMessage
            };
        }
    }

    /**
     * Mark a board roll as submitted in localStorage
     */
    private static markAsSubmitted(boardRoll: string, submissionId: string): void {
        try {
            const submittedRolls = JSON.parse(localStorage.getItem('submittedRolls') || '{}');
            submittedRolls[boardRoll] = {
                submissionId,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('submittedRolls', JSON.stringify(submittedRolls));
        } catch (error) {
            console.error('Error updating localStorage:', error);
        }
    }

    /**
     * Check if a board roll is marked as submitted in localStorage
     */
    static isMarkedAsSubmitted(boardRoll: string): boolean {
        try {
            const submittedRolls = JSON.parse(localStorage.getItem('submittedRolls') || '{}');
            return submittedRolls[boardRoll] !== undefined;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return false;
        }
    }

    /**
     * Get submission info from localStorage
     */
    static getSubmissionInfo(boardRoll: string): { submissionId: string; timestamp: string } | null {
        try {
            const submittedRolls = JSON.parse(localStorage.getItem('submittedRolls') || '{}');
            return submittedRolls[boardRoll] || null;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return null;
        }
    }

    /**
     * Clear all submission data (for testing purposes)
     */
    static clearSubmissionData(): void {
        try {
            localStorage.removeItem('submittedRolls');
            addNotification('Submission data cleared', 'info');
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
} 