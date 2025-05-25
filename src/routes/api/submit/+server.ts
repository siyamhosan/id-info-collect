import { db } from '$lib/server/db';
import { Submissions } from '$lib/server/db/schema';
import { SubmissionSchema } from '$lib/server/schema/submission';
import { json, type RequestHandler } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse JSON data instead of FormData
        const requestData = await request.json();

        // Validate the submission data
        const validation = await superValidate(requestData, zod(SubmissionSchema));

        if (!validation.valid) {
            return json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            }, { status: 400 });
        }

        const { data } = validation;

        // Check for existing submission by board roll
        const existingSubmission = await db.query.Submissions.findFirst({
            where: (t, { eq }) => eq(t.boardRoll, data.boardRoll)
        });

        if (existingSubmission) {
            return json({
                success: false,
                message: 'This board roll has already been submitted'
            }, { status: 409 });
        }

        // Additional server-side validations

        // 1. Validate roll conflict (board roll vs class roll)
        if (data.boardRoll === data.classRoll) {
            return json({
                success: false,
                message: 'Board roll and class roll cannot be the same'
            }, { status: 400 });
        }

        // 2. Check if first 5 digits match
        const boardRollPrefix = data.boardRoll.substring(0, 5);
        const classRollPrefix = data.classRoll.substring(0, 5);
        if (boardRollPrefix === classRollPrefix) {
            return json({
                success: false,
                message: 'First 5 digits of board roll and class roll cannot match'
            }, { status: 400 });
        }

        // 3. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return json({
                success: false,
                message: 'Invalid email format'
            }, { status: 400 });
        }

        // 4. Validate phone format (Bangladesh format)
        const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s-]/g, ''))) {
            return json({
                success: false,
                message: 'Invalid phone number format'
            }, { status: 400 });
        }

        // Insert the submission
        const submissionData = {
            boardRoll: data.boardRoll,
            semester: data.semester,
            department: data.department,
            fullName: data.fullName,
            classRoll: data.classRoll,
            email: data.email,
            phone: data.phone,
            group: data.group,
            shift: data.shift,
            session: data.session,
            customSession: data.customSession,
            profileImage: data.profileImageUrl, // Use the URL string for database storage
        };

        await db.insert(Submissions).values(submissionData);

        // Store submission in localStorage tracking (for client-side duplicate prevention)
        const submissionId = `${data.boardRoll}-${Date.now()}`;

        return json({
            success: true,
            message: 'Application submitted successfully',
            submissionId,
            data: submissionData
        }, { status: 201 });

    } catch (error: any) {
        console.error('Submission error:', error);
        return json({
            success: false,
            message: 'Internal server error occurred',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
};
