import { env } from "$env/dynamic/private";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { Submissions } from "./schema";


const serviceAccountAuth = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(
    "1O4sOy9h6s_fVN_oTSels5VzBhnKbiKDXsnZlrPyAbyM",
    serviceAccountAuth
);



export async function addSubmissionDataToSheets(submissionData: (typeof Submissions.$inferSelect)[]) {
    if (!submissionData || submissionData.length === 0) {
        throw new Error('No submission data provided');
    }

    try {
        // Load document info with timeout
        const loadPromise = doc.loadInfo();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Google Sheets API timeout')), 30000)
        );

        await Promise.race([loadPromise, timeoutPromise]);

        const formatedData = submissionData.map(data => ({
            "Submission ID": data.identifier,
            "Board Roll": data.boardRoll,
            "Class Roll": data.classRoll,
            "Full Name": data.fullName,
            "Email": data.email,
            "Phone": data.phone,
            "Department": data.department,
            "Semester": data.semester,
            "Group": data.group,
            "Shift": data.shift,
            "Session": data.session,
            "Custom Session": data.customSession || "",
            "ID Card Validity Session": data.session,
            "Profile Image URL": data.profileImage,
            "Status": data.status || "processed",
            "Submission Date": new Date(data.createdAt).toISOString(),
            "Processed At": new Date().toISOString()
        }));

        const department = submissionData[0].department;
        console.log(`📋 Formatting ${submissionData.length} submissions for ${department}`);

        // Get or create department sheet
        let sheet = doc.sheetsByTitle[department];
        if (!sheet) {
            console.log(`📄 Creating new sheet for department: ${department}`);
            try {
                sheet = await doc.addSheet({
                    title: department,
                    headerValues: Object.keys(formatedData[0]),
                    gridProperties: {
                        columnCount: Object.keys(formatedData[0]).length,
                        rowCount: 1000 // Pre-allocate rows for better performance
                    },
                });
            } catch (createError: any) {
                throw new Error(`Failed to create sheet for ${department}: ${createError.message}`);
            }
        }

        if (!sheet) {
            throw new Error(`Failed to access or create sheet for department: ${department}`);
        }

        // Load header and cells with error handling
        try {
            await sheet.loadHeaderRow();
            console.log(`📊 Adding ${formatedData.length} rows to ${department} sheet`);

            // Add rows with retry logic for individual failures
            const addRowsPromise = sheet.addRows(formatedData);
            const addRowsTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Add rows timeout')), 20000)
            );

            await Promise.race([addRowsPromise, addRowsTimeout]);
            console.log(`✅ Successfully added ${formatedData.length} rows to ${department} sheet`);

        } catch (addError: any) {
            throw new Error(`Failed to add rows to ${department} sheet: ${addError.message}`);
        }

    } catch (error: any) {
        console.error(`❌ Google Sheets error for department ${submissionData[0]?.department}:`, error);

        // Enhance error messages for better debugging
        if (error.message?.includes('timeout')) {
            throw new Error(`Google Sheets API timeout - please try again later`);
        } else if (error.message?.includes('quota')) {
            throw new Error(`Google Sheets API quota exceeded - rate limited`);
        } else if (error.message?.includes('permission')) {
            throw new Error(`Google Sheets permission denied - check service account access`);
        } else if (error.message?.includes('not found')) {
            throw new Error(`Google Sheets document not found - check spreadsheet ID`);
        } else {
            throw new Error(`Google Sheets API error: ${error.message || 'Unknown error'}`);
        }
    }
}