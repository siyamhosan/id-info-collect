import { pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const Submissions = pgTable('submissions', {
	id: serial('id').primaryKey(),
	identifier: text('identifier').notNull().$defaultFn(() => crypto.randomUUID().slice(0, 8)),
	boardRoll: text('board_roll').notNull().unique(), // Ensure uniqueness at DB level
	semester: text('semester').notNull(),
	department: text('department').notNull(),
	fullName: text('full_name').notNull(),
	classRoll: text('class_roll').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	group: text('group').notNull(),
	shift: text('shift').notNull(),
	session: text('session').notNull(),
	customSession: text('custom_session'),
	profileImage: text('profile_image').notNull(),

	// Security: Add IP tracking for audit purposes
	submissionIp: text('submission_ip'),

	// Security: Add status field for moderation
	status: text('status').notNull().default('pending'), // pending, approved, rejected

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
