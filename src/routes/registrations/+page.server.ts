import { must_be_admin } from '$lib/server/middleware/auth';
import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	must_be_admin(event, '/admin');

	return {
		registrations: await registration_service.get_all_registrations()
	};
};
