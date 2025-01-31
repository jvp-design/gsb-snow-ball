// https://lucia-next.pages.dev/sessions/migrate-lucia-v3

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	type NewSessionType,
	session_table,
	type SessionType,
	user_table,
	type UserType
} from '$lib/server/db/schema';

import { eq } from 'drizzle-orm';

export type SuccessfulSession = {
	session: SessionType;
	user: UserType;
};

export type FailedSession = {
	session: null;
	user: null;
};

export type SessionValidationResult = SuccessfulSession | FailedSession;

const SESSION_DAYS_LENGTH = 30;
export const SESSION_COOKIE_NAME = 'auth_session';

export function generate_session_token(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function create_session(token: string, user_id: string): Promise<NewSessionType> {
	const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: NewSessionType = {
		id: session_id,
		user_id,
		expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS_LENGTH)
	};
	await db.insert(session_table).values(session);
	return session;
}

export async function validate_session_token(token: string): Promise<SessionValidationResult> {
	const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const result = await db
		.select({ user: user_table, session: session_table })
		.from(session_table)
		.innerJoin(user_table, eq(session_table.user_id, user_table.id))
		.where(eq(session_table.id, session_id));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0];
	if (Date.now() >= session.expires_at.getTime()) {
		await db.delete(session_table).where(eq(session_table.id, session.id));
		return { session: null, user: null };
	}

	/**
	 * This checks if the session is within 15 days of expiration (half of the 30-day session length)
	 * and automatically extends it. Comment this out if you don't want that to happen
	 */
	if (
		Date.now() >=
		session.expires_at.getTime() - (1000 * 60 * 60 * 24 * SESSION_DAYS_LENGTH) / 2
	) {
		session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS_LENGTH);
		await db
			.update(session_table)
			.set({
				expires_at: session.expires_at
			})
			.where(eq(session_table.id, session.id));
	}
	return { session, user } as SessionValidationResult;
}

export async function invalidate_session(session_id: string): Promise<void> {
	await db.delete(session_table).where(eq(session_table.id, session_id));
}

export function set_session_token_cookie(
	event: RequestEvent,
	token: string,
	expires_at: Date
): void {
	event.cookies.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expires_at,
		path: '/'
	});
}

export function delete_session_token_cookie(event: RequestEvent): void {
	event.cookies.set(SESSION_COOKIE_NAME, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
