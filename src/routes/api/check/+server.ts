import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
    try {
        const rollId = (await request.json()).rollId;

        if (!rollId || rollId.length !== 6 || isNaN(Number(rollId))) {
            return json({ success: false, message: 'Invalid Roll ID' }, { status: 400 });
        }

        const submission = await db.query.Submissions.findFirst({
            where: (t, { eq }) => eq(t.boardRoll, rollId)
        });

        if (submission) {
            return json({ success: false, message: 'Roll ID already exists' }, { status: 400 });
        }

        return json({ success: true, message: 'Roll ID is available' }, { status: 200 });
    } catch (error: any) {
        // Handle any errors that occur during processing
        return json({ success: false, message: 'An error occurred', error: error.message }, { status: 500 });
    }
}) satisfies RequestHandler;
