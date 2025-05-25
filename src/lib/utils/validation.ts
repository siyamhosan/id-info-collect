/**
 * Validates board roll number (6 digits, numeric)
 * @param boardRoll - The board roll number to validate
 * @returns A boolean indicating if the board roll is valid
 */
export function validateBoardRoll(boardRoll: string): boolean {
	return /^\d{6}$/.test(boardRoll);
}

/**
 * Validates class roll number
 * @param classRoll - The class roll number to validate
 * @returns A boolean indicating if the class roll is valid
 */
export function validateClassRoll(classRoll: string): boolean {
	return /^\d+$/.test(classRoll) && classRoll.length >= 1 && classRoll.length <= 10;
}

/**
 * Validates that board roll and class roll don't conflict
 * @param boardRoll - The board roll number
 * @param classRoll - The class roll number
 * @returns A boolean indicating if there is no conflict between the rolls
 */
export function validateRollConflict(boardRoll: string, classRoll: string): boolean {
	if (!boardRoll || !classRoll) return true;

	// Cannot be the same
	if (boardRoll === classRoll) return false;

	// First 5 digits cannot match
	if (boardRoll.length >= 5 && classRoll.length >= 5) {
		return boardRoll.substring(0, 5) !== classRoll.substring(0, 5);
	}

	return true;
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns A boolean indicating if the email format is valid
 */
export function validateEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates phone number (basic validation)
 * @param phone - The phone number to validate
 * @returns A boolean indicating if the phone number is valid
 */
export function validatePhone(phone: string): boolean {
	return /^[\d\s\-\+\(\)]{10,15}$/.test(phone);
}

/**
 * Validates required field
 * @param value - The value to check
 * @returns A boolean indicating if the field is filled
 */
export function validateRequired(value: string): boolean {
	return Boolean(value && value.trim().length > 0);
}

/**
 * Validates image file
 * @param file - The file to validate
 * @returns An object indicating if the file is valid and any error message
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
	if (!file) return { valid: false, error: 'No file selected' };

	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (!allowedTypes.includes(file.type)) {
		return { valid: false, error: 'Only JPG and PNG files are allowed' };
	}

	const maxSize = 5 * 1024 * 1024; // 5MB
	if (file.size > maxSize) {
		return { valid: false, error: 'File size must be less than 5MB' };
	}

	return { valid: true };
}
