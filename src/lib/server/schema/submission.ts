import { Departments, groupOptions } from '$lib/utils/data';
import { z } from 'zod';



const departmentOptions = Departments.map(department => department.code);


const shiftOptions = [
    'Morning',
    'Day'

]

const sessionOptions = [
    '2019-20',
    '2020-21',
    '2021-22',
    '2022-23',
    '2023-24',
    '2024-25',
    'Other / Custom Session'
];

// Define outside the load function so the adapter can be cached
export const SubmissionSchema = z.object({
    boardRoll: z.string()
        .regex(/^\d{6}$/, 'Board Roll Number must be exactly 6 digits')
        .transform(val => val.trim()),
    semester: z.string()
        .min(1, 'Semester is required')
        .max(20, 'Semester too long')
        .regex(/^[a-zA-Z0-9\s]+$/, 'Invalid semester format')
        .transform(val => val.trim()),
    department: z.enum([...departmentOptions] as [string, ...string[]], {
        errorMap: () => ({ message: 'Invalid department selection' })
    }),
    fullName: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name too long')
        .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters')
        .transform(val => val.trim().replace(/\s+/g, ' ')),
    classRoll: z.string()
        .regex(/^\d{1,10}$/, 'Class Roll must be 1-10 digits')
        .transform(val => val.trim()),
    email: z.string()
        .email('Invalid email address')
        .max(254, 'Email too long')
        .toLowerCase()
        .transform(val => val.trim()),
    phone: z.string()
        .min(10, 'Phone number too short')
        .max(20, 'Phone number too long')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
        .transform(val => val.replace(/[\s\-\(\)]/g, '')),
    group: z.enum([...groupOptions] as [string, ...string[]], {
        errorMap: () => ({ message: 'Invalid group selection' })
    }),
    shift: z.enum([...shiftOptions] as [string, ...string[]], {
        errorMap: () => ({ message: 'Invalid shift selection' })
    }),
    session: z.enum([...sessionOptions] as [string, ...string[]], {
        errorMap: () => ({ message: 'Invalid session selection' })
    }),
    customSession: z.string()
        .max(20, 'Custom session too long')
        .regex(/^[a-zA-Z0-9\s\-]+$/, 'Invalid custom session format')
        .optional()
        .nullable()
        .transform(val => val?.trim()),
    idCardValiditySession: z.string()
        .min(1, 'ID Card Validity Session is required')
        .max(20, 'Session too long')
        .transform(val => val.trim()),
    profileImageUrl: z.string()
        .min(1, 'Profile Image is required')
        .max(10000, 'Image data too large')
    // .regex(/^data:image\/(jpeg|jpg|png);base64,/, 'Invalid image format'),
});