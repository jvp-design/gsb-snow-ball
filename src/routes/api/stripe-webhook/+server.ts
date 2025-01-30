import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import registration_service from '$lib/services/registration.service';

import type { RequestHandler } from './$types';

import Stripe from 'stripe';

const handle_webhook_event = async (event: Stripe.Event) => {
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			if (session.payment_status === 'paid') {
				await registration_service.handle_successful_payment(session.id);
			}
			break;
		}
		case 'checkout.session.expired': {
			const session = event.data.object;
			await registration_service.handle_canceled_payment(session.id);
			break;
		}
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature: string = request.headers.get('stripe-signature') as string;

	let event;
	try {
		// Verify webhook signature
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

		// Return success immediately
		// Stripe recommends responding within 3 seconds
		const response = new Response(null, { status: 200 });

		// Handle the event asynchronously
		handle_webhook_event(event).catch(console.error);

		return response;
	} catch (err) {
		console.error('Webhook error:', err);
		return new Response('Webhook Error', { status: 400 });
	}
};
