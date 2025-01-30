import { redirect } from '@sveltejs/kit';
import { LISTVIEW_PW } from '$env/static/private';
import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const pw = event.url.searchParams.get('pw');

	if (!pw || !LISTVIEW_PW.split(',').includes(pw.toLowerCase())) {
		redirect(302, '/');
	}

	return {
		registrations: await registration_service.get_all_registrations()
	};
};
