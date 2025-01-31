import { pool } from '$lib/server/db';
import { mailer } from '$lib/server/mailer';

export async function shutdown_server(reason: string) {
	console.log(`Server is shutting down. Reason: ${reason}`);

	try {
		await pool.end();
		console.log(`Database connection pool closed successfully.`);
	} catch (err) {
		console.error(`Error closing database connection pool: ${err}`);
	}

	try {
		await mailer.destroy();
		console.log('Mailer instance destroyed successfully.');
	} catch (err) {
		console.error(`Error destroying mailer instance: ${err}`);
	}
}
