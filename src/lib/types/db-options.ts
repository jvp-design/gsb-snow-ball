export const payment_status_options: [string, ...string[]] = [
	'pending',
	'paid',
	'canceled',
	'not_applicable'
];

export type PaymentStatusType = (typeof payment_status_options)[number];
