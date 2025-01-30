// lib/utils/calendar.ts
export type CalendarEvent = {
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	location: string;
};

export function format_calendar_date(dateStr: string): string {
	return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generate_event_uid(domain = 'yourdomain.com'): string {
	return `${Date.now()}@${domain}`;
}

export function sanitize_filename(title: string): string {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function generate_google_calendar_url(event: CalendarEvent): string {
	const { title, description, start_time, end_time, location } = event;
	return (
		`https://calendar.google.com/calendar/render?action=TEMPLATE` +
		`&text=${encodeURIComponent(title)}` +
		`&dates=${format_calendar_date(start_time)}/${format_calendar_date(end_time)}` +
		`&details=${encodeURIComponent(description)}` +
		`&location=${encodeURIComponent(location)}`
	);
}

export function generate_ics_content(
	event: CalendarEvent,
	options?: {
		method?: string;
		prodId?: string;
		domain?: string;
	}
): string {
	const { title, description, start_time, end_time, location } = event;
	const {
		method = 'REQUEST',
		prodId = '-//YourOrganization//CalendarEvent//EN',
		domain = 'yourdomain.com'
	} = options ?? {};

	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		`PRODID:${prodId}`,
		`METHOD:${method}`,
		'BEGIN:VEVENT',
		`DTSTART:${format_calendar_date(start_time)}`,
		`DTEND:${format_calendar_date(end_time)}`,
		`SUMMARY:${title}`,
		`DESCRIPTION:${description}`,
		`LOCATION:${location}`,
		`UID:${generate_event_uid(domain)}`,
		'STATUS:CONFIRMED',
		'SEQUENCE:0',
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');
}
