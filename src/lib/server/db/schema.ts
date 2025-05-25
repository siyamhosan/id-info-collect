import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const Submissions = pgTable('submissions', {
	id: serial('id').primaryKey(),
	boardRoll: text('board_roll').notNull(),
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

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
