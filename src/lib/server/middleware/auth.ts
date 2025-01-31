import { redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';

export const is_logged_in = (event: ServerLoadEvent | RequestEvent) => event.locals?.user?.id;

export const must_be_logged_in = (event: ServerLoadEvent | RequestEvent) => {
	if (!is_logged_in(event)) {
		return redirect(303, `/`);
	}
};

const is_admin_user = (event: ServerLoadEvent | RequestEvent) => event.locals?.user?.is_admin;

export const must_be_admin = (event: ServerLoadEvent | RequestEvent) => {
	if (!is_admin_user(event)) {
		return redirect(303, `/`);
	}
};

export const cannot_be_logged_in = (event: ServerLoadEvent | RequestEvent, location?: string) => {
	if (is_logged_in(event)) {
		return redirect(303, location ?? '/');
	}
};
