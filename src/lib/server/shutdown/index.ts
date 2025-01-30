import { mailer } from '$lib/server/mailer';

export async function shutdown_server(reason: string) {
	console.log(`Server is shutting down. Reason: ${reason}`);

	try {
		await mailer.destroy();
		console.log('Mailer instance destroyed successfully.');
	} catch (err) {
		console.error(`Error destroying mailer instance: ${err}`);
	}
}
