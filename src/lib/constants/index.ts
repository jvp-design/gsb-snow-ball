// Define the cutoff date
import { DateTime } from 'luxon';

export const CUTOFF_DATE = DateTime.fromObject(
	{ year: 2025, month: 2, day: 12, hour: 5, minute: 0 },
	{ zone: 'UTC' }
);
