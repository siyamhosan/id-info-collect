import { z } from 'zod';



const departmentOptions = [
    'CSE',
    'EEE',
    'BME',
    'WRE',
    'CE',
    'ME',
    'Other / Custom Department'
];

const groupOptions = [
    'Group A',
    'Group B',
    'Group C',
    'Group D',
    'Group E',
    'Group F',
    'Group G',
    'Group H',
    'Group I',
    'Group J',
]

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
    boardRoll: z.string().regex(/^\d{6}$/, 'Board Roll Number must be exactly 6 digits'),
    semester: z.string().min(1, 'Semester is required'),
    department: z.string().min(1, 'Department is required'),
    fullName: z.string().min(1, 'Name is required'),
    classRoll: z.string().regex(/^\d{1,10}$/, 'Class Roll must be 1-10 digits'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    group: z.string().min(1, 'Group is required'),
    shift: z.string().min(1, 'Shift is required'),
    session: z.string().min(1, 'Session is required'),
    customSession: z.string().optional(),
    idCardValiditySession: z.string().min(1, 'ID Card Validity Session is required'),
    profileImageUrl: z.string().min(1, 'Profile Image is required'),
});