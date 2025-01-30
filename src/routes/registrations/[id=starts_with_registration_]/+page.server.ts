import registration_service from '$lib/services/registration.service';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		page_meta_tags: {
			title: 'View Your Registration'
		},
		registration: await registration_service.get_registration_by_id(event.params.id)
	};
};
