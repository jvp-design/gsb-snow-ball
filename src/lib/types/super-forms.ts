export type Message = {
	type: 'error' | 'success';
	text: string;
	title?: string;
};
