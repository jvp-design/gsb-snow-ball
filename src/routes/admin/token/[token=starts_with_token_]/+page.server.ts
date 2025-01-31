import { redirect } from '@sveltejs/kit';
import { create_session, generate_session_token, set_session_token_cookie } from '$lib/auth';
import { cannot_be_logged_in } from '$lib/server/middleware/auth';
import auth_service from '$lib/services/auth.service';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	cannot_be_logged_in(event);

	return {
		page_meta_tags: {
			title: 'Admin Login'
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		cannot_be_logged_in(event);

		const { token } = event.params;
		if (!token) {
			return redirect(403, '/');
		}

		const user = await auth_service.get_user_from_token(token);
		if (!user) {
			return redirect(403, '/');
		}

		const { auth_token, expires_at } = await auth_service.authenticate_user(user.id);

		// Set cookie
		set_session_token_cookie(event, auth_token, expires_at);

		return redirect(303, '/registrations');
	}
};
