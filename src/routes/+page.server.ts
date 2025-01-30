import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_BOUTONNIERE_PRICE, PUBLIC_CORSAGE_PRICE } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import registration_service from '$lib/services/registration.service';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(schema)),
		page_meta_tags: {
			title: 'Sign Up'
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const needs_payment = form.data.corsages > 0 || form.data.boutonnieres > 0;
		if (!needs_payment) {
			await registration_service.create_registration(form.data);
			return redirect(303, '/success');
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				...(form.data.corsages > 0
					? [
							{
								price_data: {
									currency: 'usd',
									product_data: {
										name: 'Corsage'
									},
									unit_amount: Number(PUBLIC_CORSAGE_PRICE)
								},
								quantity: form.data.corsages
							}
						]
					: []),
				...(form.data.boutonnieres > 0
					? [
							{
								price_data: {
									currency: 'usd',
									product_data: {
										name: 'Boutonniere'
									},
									unit_amount: Number(PUBLIC_BOUTONNIERE_PRICE)
								},
								quantity: form.data.boutonnieres
							}
						]
					: [])
			],
			mode: 'payment',
			success_url: `${event.url.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${event.url.origin}/register`,
			customer_email: form.data.email
		});

		// Create registration with pending payment status
		await registration_service.create_registration({
			...form.data,
			stripe_session_id: session.id,
			payment_status: 'pending'
		});

		redirect(303, session.url!);
	}
};
