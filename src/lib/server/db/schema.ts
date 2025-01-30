import { new_id } from '../../utils/id';

import { type InferInsertModel, type InferSelectModel, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const registration_table = sqliteTable('registrations', {
	id: text('id')
		.$defaultFn(() => new_id('registration'))
		.primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	attendees: integer('attendees').notNull(),
	classes: text('classes').notNull(), // Will store comma-separated strings
	corsages: integer('corsages').notNull().default(0),
	boutonnieres: integer('boutonnieres').notNull().default(0),
	stripe_session_id: text('stripe_session_id'),
	payment_status: text('payment_status').default('pending'), // pending, paid, canceled
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export type RegistrationType = InferSelectModel<typeof registration_table>;
export type NewRegistrationType = InferInsertModel<typeof registration_table>;
