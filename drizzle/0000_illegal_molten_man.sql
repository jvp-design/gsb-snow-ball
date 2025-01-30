CREATE TABLE `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`attendees` integer NOT NULL,
	`classes` text NOT NULL,
	`corsages` integer DEFAULT 0 NOT NULL,
	`boutonnieres` integer DEFAULT 0 NOT NULL,
	`stripe_session_id` text,
	`payment_status` text DEFAULT 'not_applicable',
	`amount_paid` integer DEFAULT 0,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
