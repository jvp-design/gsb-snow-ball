import { customAlphabet } from 'nanoid';
export const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

export type Prefixes = {
	registration: string;
	token: string;
	user: string;
};

const prefixes: Readonly<Prefixes> = {
	registration: 'registration',
	token: 'token',
	user: 'user'
};

// Type guard to check if a string is a valid prefix
export function is_valid_prefix(prefix: string): prefix is keyof Prefixes {
	return prefix in prefixes;
}

export function new_id(prefix: string): string {
	if (!is_valid_prefix(prefix)) {
		throw new Error(
			`Invalid prefix: ${prefix}. Valid prefixes are: ${Object.keys(prefixes).join(', ')}`
		);
	}
	return [prefixes[prefix], nanoid(16)].join('_');
}
