import { db } from '$lib/server/db';
import { registration_table, type RegistrationType } from '$lib/server/db/schema';
import type { ClassOptionType } from '$lib/types';

export type CreateRegistrationPayloadType = Pick<
	RegistrationType,
	'name' | 'email' | 'attendees' | 'corsages' | 'boutonnieres'
> & { classes: ClassOptionType[] };
const create_registration = async (data: CreateRegistrationPayloadType) => {
	return db.insert(registration_table).values({
		name: data.name,
		email: data.email,
		attendees: data.attendees,
		classes: data.classes.join(','),
		corsages: data.corsages,
		boutonnieres: data.boutonnieres
	});
};

export default {
	create_registration
};
