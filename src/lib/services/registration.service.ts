import { db } from '$lib/server/db';
import {
	type NewRegistrationType,
	registration_table,
	type RegistrationType
} from '$lib/server/db/schema';
import type { ClassOptionType } from '$lib/types';

import { eq } from 'drizzle-orm';

export type CreateRegistrationPayloadType = Pick<
	RegistrationType,
	'name' | 'email' | 'attendees' | 'corsages' | 'boutonnieres'
> & {
	classes: ClassOptionType[];
	stripe_session_id?: string;
	payment_status?: 'pending' | 'paid' | 'canceled';
};
const create_registration = async (
	data: CreateRegistrationPayloadType
): Promise<NewRegistrationType[]> => {
	return db
		.insert(registration_table)
		.values({
			name: data.name,
			email: data.email,
			attendees: data.attendees,
			classes: data.classes.join('~~'),
			corsages: data.corsages,
			boutonnieres: data.boutonnieres,
			stripe_session_id: data.stripe_session_id,
			payment_status: data.payment_status
		})
		.returning();
};

const get_all_registrations = async () => db.select().from(registration_table);

const get_registration_by_id = async (id?: string | null): Promise<RegistrationType | undefined> =>
	id ? db.query.registration_table.findFirst({ where: eq(registration_table.id, id) }) : undefined;

const get_registration_by_stripe_session_id = async (
	session_id: string
): Promise<RegistrationType | undefined> => {
	return db.query.registration_table.findFirst({
		where: eq(registration_table.stripe_session_id, session_id)
	});
};

const handle_successful_payment = async (
	session_id: string | null,
	amount_paid: number
): Promise<RegistrationType[]> => {
	if (!session_id) {
		return [];
	}
	return db
		.update(registration_table)
		.set({ payment_status: 'paid', amount_paid, updated_at: new Date() })
		.where(eq(registration_table.stripe_session_id, session_id))
		.returning();
};

const handle_canceled_payment = async (session_id: string): Promise<RegistrationType[]> => {
	return db
		.update(registration_table)
		.set({ payment_status: 'canceled', updated_at: new Date() })
		.where(eq(registration_table.stripe_session_id, session_id))
		.returning();
};

export default {
	create_registration,
	get_all_registrations,
	get_registration_by_id,
	get_registration_by_stripe_session_id,
	handle_successful_payment,
	handle_canceled_payment
};
