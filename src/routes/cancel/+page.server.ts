import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session_id = event.url.searchParams.get('session_id');

	if (session_id) {
		await registration_service.handle_canceled_payment(session_id);

		return {
			registration: await registration_service.get_registration_by_stripe_session_id(session_id)
		};
	}

	return {};
};
