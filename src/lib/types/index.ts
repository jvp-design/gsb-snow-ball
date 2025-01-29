export const class_options = [
	'4, Carbone',
	'4, Quenault',
	'3, Healey',
	'3, Pierson',
	'2, Smith',
	'2, Tuohy',
	'1, Wilson'
] as const;

export type ClassOptionType = (typeof class_options)[number];
