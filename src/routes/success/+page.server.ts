import { stripe } from '$lib/server/stripe';
import email_service from '$lib/services/email.service';
import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session_id = event.url.searchParams.get('session_id');

	if (session_id) {
		try {
			const session = await stripe.checkout.sessions.retrieve(session_id);

			if (session.payment_status === 'paid') {
				const [registration] = await registration_service.handle_successful_payment(
					session_id,
					session.amount_total ?? 0
				);
				if (registration?.email && registration.id) {
					email_service.send_registration_confirmed_email(registration.email, registration.id);
				}
				return {
					success: true,
					registration
				};
			}
		} catch (err) {
			console.error('Error verifying payment:', err);
			return { success: true };
		}
	}

	const id = event.url.searchParams.get('id');
	const registration = await registration_service.get_registration_by_id(id);
	if (registration?.email && id) {
		email_service.send_registration_confirmed_email(registration.email, id);
	}
	return { success: true };
};
