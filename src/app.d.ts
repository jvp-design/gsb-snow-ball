// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SessionType, UserType } from '$lib/server/db/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserType | null;
			session: SessionType | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = import('./lib/types/super-forms').Message;
		}
	}
}

export {};
