import type { ServerInit } from '@sveltejs/kit';
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
