import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
    try {
        // Security: Check content type
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return json({ success: false, message: 'Invalid content type' }, { status: 400 });
        }

        // Parse and validate request
        let requestData;
        try {
            requestData = await request.json();
        } catch (error) {
            return json({ success: false, message: 'Invalid JSON data' }, { status: 400 });
        }

        const rollId = requestData?.rollId;

        // Security: Enhanced validation
        if (!rollId || typeof rollId !== 'string') {
            return json({ success: false, message: 'Roll ID is required' }, { status: 400 });
        }

        // Sanitize and validate roll ID
        const sanitizedRollId = rollId.trim();
        if (!/^\d{6}$/.test(sanitizedRollId)) {
            return json({ success: false, message: 'Roll ID must be exactly 6 digits' }, { status: 400 });
        }

        const submission = await db.query.Submissions.findFirst({
            where: (t, { eq }) => eq(t.boardRoll, sanitizedRollId),
            columns: { id: true } // Only select what we need
        });

        if (submission) {
            return json({ success: false, message: 'Roll ID already exists' }, { status: 400 });
        }

        return json({ success: true, message: 'Roll ID is available' }, { status: 200 });
    } catch (error: any) {
        // Security: Don't expose internal error details in production
        console.error('Check API error:', error);
        return json({
            success: false,
            message: 'An error occurred while checking the roll ID',
            // Only include error details in development
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        }, { status: 500 });
    }
}) satisfies RequestHandler;
