import type { Handle, ServerInit } from '@sveltejs/kit';
import {
	delete_session_token_cookie,
	SESSION_COOKIE_NAME,
	set_session_token_cookie,
	validate_session_token
} from '$lib/auth';
import { shutdown_server } from '$lib/server/shutdown';

export const init: ServerInit = async () => {
	process.on('SIGINT', async function () {
		await shutdown_server('SIGINT');
		process.exit(0);
	});

	process.on('SIGTERM', async function () {
		await shutdown_server('SIGTERM');
		process.exit(0);
	});

	process.on('sveltekit:shutdown', async function (reason: string) {
		await shutdown_server(reason);
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get(SESSION_COOKIE_NAME) ?? null;
	if (session_id === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validate_session_token(session_id);
	if (session !== null) {
		set_session_token_cookie(event, session_id, session.expires_at);
	} else {
		delete_session_token_cookie(event);
	}
	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};
