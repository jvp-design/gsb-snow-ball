import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import registration_service from '$lib/services/registration.service';

import type { Actions, PageServerLoad } from './$types';
import { schema } from './utils';

export const load: PageServerLoad = async (event) => {
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
			return {
				form,
				message:
					'You have successfully registered for the Snow Ball! You will receive an email with the relevant information.'
			};
		}
	}
};
