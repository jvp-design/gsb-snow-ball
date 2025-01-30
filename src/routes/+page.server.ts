import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { GOOGLE_RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { PUBLIC_BOUTONNIERE_PRICE, PUBLIC_CORSAGE_PRICE } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import registration_service from '$lib/services/registration.service';
import { validate_re_captcha_server } from '$lib/utils/recaptcha';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

const limiter = new RateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'] // IP + User Agent limiter
});

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
		// Every call to isLimited counts as a hit towards the rate limit for the event.
		if (await limiter.isLimited(event)) error(429);

		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		// reCAPTCHA
		const g_token = form.data.token;
		if (!g_token) {
			return message(form, {
				type: 'error',
				title: 'Invalid reCAPTCHA',
				text: 'There was an error with the reCAPTCHA on your form submission. Please try again later.'
			});
		}
		const res = await validate_re_captcha_server(g_token, fetch, GOOGLE_RECAPTCHA_SECRET_KEY);
		if (!res.success) {
			return message(form, {
				type: 'error',
				title: 'Failed reCAPTCHA',
				text: 'There was an error with the reCAPTCHA on your form submission. Please try again later.'
			});
		}

		const needs_payment = form.data.corsages > 0 || form.data.boutonnieres > 0;
		if (!needs_payment) {
			const [{ id }] = await registration_service.create_registration(form.data);
			return redirect(303, `/success?id=${id}`);
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
		const [{ id }] = await registration_service.create_registration({
			...form.data,
			stripe_session_id: session.id,
			payment_status: 'pending'
		});
		session.success_url = `${session.success_url}&id=${id}`;

		redirect(303, session.url!);
	}
};
