import { CUTOFF_DATE } from '$lib/constants';
import { class_options } from '$lib/types';

import { DateTime } from 'luxon';
import { z } from 'zod';

// Helper function to check if flower orders are still available
export const is_flower_ordering_open = () => DateTime.now().setZone('UTC') < CUTOFF_DATE;

// Custom error message for expired flower ordering
const FLOWERS_EXPIRED_MESSAGE = 'Flower orders are no longer available (ended February 11th, 2025)';

export const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().min(1, 'Email is required').email('The email address is badly formatted'),
	attendees: z
		.number({ message: 'Please enter a valid number' })
		.min(2, 'At least two attendees are required (at least 1 child and 1 adult)'),
	classes: z.enum(class_options).array().nonempty('Please select at least one class'),
	corsages: z
		.number()
		.min(0)
		.default(0)
		.refine(() => is_flower_ordering_open(), {
			message: FLOWERS_EXPIRED_MESSAGE
		}),
	boutonnieres: z
		.number()
		.min(0)
		.default(0)
		.refine(() => is_flower_ordering_open(), {
			message: FLOWERS_EXPIRED_MESSAGE
		}),
	token: z.string().min(1, 'Token is missing')
});

export type FormSchema = z.infer<typeof schema>;
