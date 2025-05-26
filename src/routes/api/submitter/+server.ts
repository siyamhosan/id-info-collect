import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { Submissions } from '$lib/server/db/schema';
import { addSubmissionDataToSheets } from '$lib/server/db/sheets';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// Rate limiting configuration
const RATE_LIMIT = {
    MAX_REQUESTS_PER_MINUTE: 100, // Google Sheets API limit
    MAX_BATCH_SIZE: 10, // Maximum submissions per department per batch
    RETRY_DELAYS: [1000, 2000, 5000, 10000], // Exponential backoff in ms
    MAX_RETRIES: 4
};

// In-memory rate limiting tracker
let requestCount = 0;
let lastResetTime = Date.now();

interface ProcessingResult {
    success: boolean;
    department: string;
    processedCount: number;
    error?: string;
    retryCount?: number;
}

interface CronJobResult {
    success: boolean;
    message: string;
    totalProcessed: number;
    results: ProcessingResult[];
    errors: string[];
    executionTime: number;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
    const startTime = Date.now();

    try {
        // 1. Authentication - Key-based auth for cron jobs
        const cronKey = request.headers.get('x-cron-key');

        if (!cronKey) {
            return json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        // Verify cron key or bearer token
        const expectedCronKey = env.CRON_SECRET_KEY;

        let isAuthenticated = false;

        if (cronKey && expectedCronKey && cronKey === expectedCronKey) {
            isAuthenticated = true;
        }

        if (!isAuthenticated) {
            return json({
                success: false,
                message: 'Invalid authentication credentials'
            }, { status: 403 });
        }

        // 2. Rate limiting check
        const now = Date.now();
        if (now - lastResetTime > 60000) { // Reset every minute
            requestCount = 0;
            lastResetTime = now;
        }

        if (requestCount >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
            return json({
                success: false,
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: 60 - Math.floor((now - lastResetTime) / 1000)
            }, { status: 429 });
        }

        // 3. Get all pending submissions grouped by department
        console.log('🔄 Starting cron job: Processing pending submissions...');

        const pendingSubmissions = await db.query.Submissions.findMany({
            where: eq(Submissions.status, 'pending'),
            limit: 100,
            orderBy: [desc(Submissions.createdAt)]
        });

        if (pendingSubmissions.length === 0) {
            return json({
                success: true,
                message: 'No pending submissions to process',
                totalProcessed: 0,
                results: [],
                errors: [],
                executionTime: Date.now() - startTime
            });
        }

        // 4. Group submissions by department
        const submissionsByDepartment = pendingSubmissions.reduce((acc, submission) => {
            if (!acc[submission.department]) {
                acc[submission.department] = [];
            }
            acc[submission.department].push(submission);
            return acc;
        }, {} as Record<string, typeof pendingSubmissions>);

        console.log(`📊 Found ${pendingSubmissions.length} pending submissions across ${Object.keys(submissionsByDepartment).length} departments`);

        // 5. Process each department with rate limiting and retry logic
        const results: ProcessingResult[] = [];
        const errors: string[] = [];
        let totalProcessed = 0;

        for (const [department, submissions] of Object.entries(submissionsByDepartment)) {
            // Process in batches to respect rate limits
            const batches = chunkArray(submissions, RATE_LIMIT.MAX_BATCH_SIZE);

            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                const batch = batches[batchIndex];
                console.log(`🏢 Processing ${department} - Batch ${batchIndex + 1}/${batches.length} (${batch.length} submissions)`);

                const result = await processSubmissionBatch(batch, department);
                results.push(result);

                if (result.success) {
                    totalProcessed += result.processedCount;
                    console.log(`✅ Successfully processed ${result.processedCount} submissions for ${department}`);
                } else {
                    errors.push(`${department}: ${result.error}`);
                    console.error(`❌ Failed to process ${department}: ${result.error}`);
                }

                // Rate limiting: Increment request count
                requestCount++;

                // Add delay between batches to respect rate limits
                if (batchIndex < batches.length - 1) {
                    await delay(1000); // 1 second delay between batches
                }
            }
        }

        const executionTime = Date.now() - startTime;
        console.log(`🎯 Cron job completed in ${executionTime}ms. Processed: ${totalProcessed}/${pendingSubmissions.length}`);

        const response: CronJobResult = {
            success: errors.length === 0,
            message: errors.length === 0
                ? `Successfully processed ${totalProcessed} submissions`
                : `Processed ${totalProcessed} submissions with ${errors.length} errors`,
            totalProcessed,
            results,
            errors,
            executionTime
        };

        return json(response, {
            status: errors.length === 0 ? 200 : 207 // 207 Multi-Status for partial success
        });

    } catch (error: any) {
        console.error('💥 Cron job failed:', error);

        return json({
            success: false,
            message: 'Internal server error during cron job execution',
            totalProcessed: 0,
            results: [],
            errors: [error.message || 'Unknown error'],
            executionTime: Date.now() - startTime,
            error: env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
};

/**
 * Process a batch of submissions for a specific department with retry logic
 */
async function processSubmissionBatch(
    submissions: any[],
    department: string
): Promise<ProcessingResult> {
    let retryCount = 0;

    while (retryCount <= RATE_LIMIT.MAX_RETRIES) {
        try {
            // Attempt to submit to Google Sheets
            await addSubmissionDataToSheets(submissions);

            // Mark submissions as processed in database
            const submissionIds = submissions.map(s => s.id);
            await db.update(Submissions)
                .set({
                    status: 'processed',
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(Submissions.status, 'pending'),
                        inArray(Submissions.id, submissionIds)
                    )
                );

            return {
                success: true,
                department,
                processedCount: submissions.length,
                retryCount
            };

        } catch (error: any) {
            retryCount++;
            console.warn(`⚠️ Attempt ${retryCount} failed for ${department}: ${error.message}`);

            if (retryCount > RATE_LIMIT.MAX_RETRIES) {
                // Mark submissions as failed after max retries
                const submissionIds = submissions.map(s => s.id);
                try {
                    await db.update(Submissions)
                        .set({
                            status: 'failed',
                            updatedAt: new Date()
                        })
                        .where(
                            and(
                                eq(Submissions.status, 'pending'),
                                inArray(Submissions.id, submissionIds)
                            )
                        );
                } catch (dbError) {
                    console.error('Failed to update submission status to failed:', dbError);
                }

                return {
                    success: false,
                    department,
                    processedCount: 0,
                    error: `Max retries exceeded: ${error.message}`,
                    retryCount
                };
            }

            // Exponential backoff delay
            const delayMs = RATE_LIMIT.RETRY_DELAYS[retryCount - 1] || 10000;
            console.log(`⏳ Retrying ${department} in ${delayMs}ms...`);
            await delay(delayMs);
        }
    }

    return {
        success: false,
        department,
        processedCount: 0,
        error: 'Unexpected retry loop exit',
        retryCount
    };
}

/**
 * Utility function to chunk array into smaller batches
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

/**
 * Utility function for delays
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}