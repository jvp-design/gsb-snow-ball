import { z } from 'zod';

export const schema = z.object({
	email: z.string().min(1, 'Email is required').email('The email address is badly formatted'),
	token: z.string().min(1, 'Token is missing')
});

export type FormSchema = z.infer<typeof schema>;
