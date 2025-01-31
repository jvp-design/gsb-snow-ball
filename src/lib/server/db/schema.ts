import { payment_status_options } from '../../types/db-options';
import { new_id } from '../../utils/id';

import { type InferInsertModel, type InferSelectModel, sql } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const payment_status_choices = pgEnum('payment_status_choices', payment_status_options);

export const registration_table = pgTable('registrations', {
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
	payment_status: payment_status_choices('payment_status').default('not_applicable'), // pending, paid, canceled, not_applicable
	amount_paid: integer('amount_paid').default(0),
	created_at: timestamp('created_at')
		.notNull()
		.default(sql`now()`),
	updated_at: timestamp('updated_at')
		.notNull()
		.default(sql`now()`)
});

export type RegistrationType = InferSelectModel<typeof registration_table>;
export type NewRegistrationType = InferInsertModel<typeof registration_table>;

export const user_table = pgTable('users', {
	id: text('id')
		.$defaultFn(() => new_id('user'))
		.primaryKey(),
	email: text('email').notNull(),
	token: text('token').notNull(),
	token_expiration: timestamp('token_expiration')
});
