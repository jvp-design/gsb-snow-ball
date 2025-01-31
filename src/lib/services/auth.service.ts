import { create_session, generate_session_token, set_session_token_cookie } from '$lib/auth';
import { db } from '$lib/server/db';
import { user_table } from '$lib/server/db/schema';
import { new_id } from '$lib/utils/id';

import { eq } from 'drizzle-orm';

type CreateTokenReturnType = {
	token: string;
	token_expiration: Date;
};
const create_token = (minutes: number = 60): CreateTokenReturnType => {
	const token = new_id('token');
	const token_expiration = new Date(Date.now() + minutes * 60 * 1000);

	return { token, token_expiration };
};

const create_auth_token_from_email = async (email: string) => {
	const { token, token_expiration } = create_token();
	await db.update(user_table).set({ token, token_expiration }).where(eq(user_table.email, email));
	return { token };
};

const get_user_from_token = async (token: string) =>
	(await db.select().from(user_table).where(eq(user_table.token, token)).limit(1))?.[0];

const authenticate_user = async (user_id: string) => {
	const auth_token = generate_session_token();
	const session = await create_session(auth_token, user_id);

	await db
		.update(user_table)
		.set({ token: null, token_expiration: null })
		.where(eq(user_table.id, user_id));

	return { auth_token, expires_at: session.expires_at };
};

export default {
	get_user_from_token,
	create_auth_token_from_email,
	authenticate_user
};
