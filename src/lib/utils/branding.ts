import { Departments } from "./data";

// Dhaka Polytechnic Institute Branding Configuration
export const INSTITUTION_BRANDING = {
    // Official Names
    name: {
        english: "Dhaka Polytechnic Institute",
        bangla: "ঢাকা পলিটেকনিক ইনস্টিটিউট"
    },

    // Establishment Information
    established: "1955",

    // Official Colors (Based on Bangladesh Government Portal)
    colors: {
        primary: "#1e40af", // Blue
        secondary: "#059669", // Green (Bangladesh flag inspired)
        accent: "#dc2626", // Red (Bangladesh flag inspired)
        gold: "#f59e0b", // Gold for highlights
        text: {
            primary: "#1f2937",
            secondary: "#6b7280",
            light: "#9ca3af"
        },
        background: {
            primary: "#f8fafc",
            secondary: "#f1f5f9",
            accent: "#ecfdf5"
        }
    },

    // Contact Information
    contact: {
        address: {
            bangla: "তেজগাঁও, ঢাকা-১২০৮",
            english: "Tejgaon, Dhaka-1208"
        },
        phone: "+880-2-8144891",
        email: "principal@dpi.gov.bd",
        website: "https://dpi.gov.bd"
    },

    // Academic Information
    academic: {
        totalStudents: "10,800",
        totalTeachers: "212",
        totalStaff: "164",
        totalGroups: "108",
        landArea: "27 acres"
    },

    // Departments/Technologies
    departments: Departments,

    // Application Specific
    application: {
        title: "Student ID Card Application",
        titleBangla: "শিক্ষার্থী পরিচয়পত্র আবেদন",
        description: "Official ID Card Application Portal for Dhaka Polytechnic Institute Students",
        descriptionBangla: "ঢাকা পলিটেকনিক ইনস্টিটিউটের শিক্ষার্থীদের জন্য অফিসিয়াল পরিচয়পত্র আবেদন পোর্টাল"
    },

    // Government Branding
    government: {
        portal: "Bangladesh National Portal",
        portalBangla: "বাংলাদেশ জাতীয় তথ্য বাতায়ন",
        ministry: "Ministry of Education",
        ministryBangla: "শিক্ষা মন্ত্রণালয়",
        department: "Directorate of Technical Education",
        departmentBangla: "কারিগরি শিক্ষা অধিদপ্তর"
    },

    // Logo and Assets
    assets: {
        logo: "/images/dpi-logo.png", // Will need to be added
        govLogo: "/images/bangladesh-logo.png", // Government logo
        favicon: "/favicon.ico"
    }
};

// Helper function to get department by code
export function getDepartmentByCode(code: string) {
    return INSTITUTION_BRANDING.departments.find(dept => dept.code === code);
}

// Helper function to get all department codes
export function getAllDepartmentCodes() {
    return INSTITUTION_BRANDING.departments.map(dept => dept.code);
}

// Helper function to format academic session
export function formatAcademicSession(session: string) {
    if (session.includes('-')) {
        return session;
    }
    // Convert single year to academic session format
    const year = parseInt(session);
    return `${year}-${(year + 1).toString().slice(-2)}`;
} 