import { stripe } from '$lib/server/stripe';
import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const session_id = event.url.searchParams.get('session_id');

	if (session_id) {
		try {
			const session = await stripe.checkout.sessions.retrieve(session_id);

			if (session.payment_status === 'paid') {
				await registration_service.handle_successful_payment(session_id);
				return {
					success: true,
					registration: await registration_service.get_registration_by_stripe_session_id(session_id)
				};
			}
		} catch (err) {
			console.error('Error verifying payment:', err);
			return { success: true };
		}
	}

	return { success: true };
};
