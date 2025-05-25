export function getBorderClass(isValid: boolean, value: string) {
    if (!value) return 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20';
    return isValid
        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
        : 'border-red-300 focus:border-red-500 focus:ring-red-500/20';
}

export async function checkIfSubmitted(roll: string): Promise<boolean> {
    try {
        // First check localStorage for quick response
        const submittedRolls = JSON.parse(localStorage.getItem('submittedRolls') || '{}');
        if (submittedRolls[roll]) {
            return true;
        }

        // Then check with server
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rollId: roll })
        });
        const data = await response.json();
        // If success is false, it means the roll already exists (submitted)
        return !data.success;
    } catch (error) {
        console.error('Error checking submission:', error);
        return false;
    }
}

