import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail } from '@sveltejs/kit';
import { GOOGLE_RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { cannot_be_logged_in } from '$lib/server/middleware/auth';
import auth_service from '$lib/services/auth.service';
import email_service from '$lib/services/email.service';
import type { Message } from '$lib/types/super-forms';
import { validate_re_captcha_server } from '$lib/utils/recaptcha';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

const limiter = new RateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'] // IP + User Agent limiter
});

export const load: PageServerLoad = async (event) => {
	cannot_be_logged_in(event, '/registrations');
	return {
		form: await superValidate(zod(schema)),
		page_meta_tags: {
			title: 'Admin Login'
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		// Every call to isLimited counts as a hit towards the rate limit for the event.
		if (await limiter.isLimited(event)) error(429);

		cannot_be_logged_in(event, '/registrations');

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

		let msg: Message = {
			type: 'success',
			title: '',
			text: ''
		};

		try {
			const { token } = await auth_service.create_auth_token_from_email(form.data.email);
			if (token) {
				email_service.send_login_email({ email: form.data.email, token });
			}
			msg.title = 'Email sent';
			msg.text =
				'If your email is in the system then a message has been sent to that address. Please click on that link to log in. You can close this window.';
		} catch (err) {
			msg.type = 'error';
			msg.title = 'Token generation failed';
			msg.text = 'There was an error generating your login token. Please try again later.';
		}

		return message(form, msg);
	}
};
