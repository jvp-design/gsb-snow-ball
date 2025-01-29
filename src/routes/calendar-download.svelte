<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { CalendarArrowDown, CalendarPlus2 } from 'lucide-svelte';

	type Props = {
		title: string;
		description: string;
		start_time: string;
		end_time: string;
		location: string;
	};
	let { title, description, start_time, end_time, location }: Props = $props();

	function generate_ics_file() {
		const icsContent = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'BEGIN:VEVENT',
			`DTSTART:${new Date(start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
			`DTEND:${new Date(end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
			`SUMMARY:${title}`,
			`DESCRIPTION:${description}`,
			`LOCATION:${location}`,
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\n');

		const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}

	let google_calendar_url = $derived(
		`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${new Date(start_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(end_time).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
	);
</script>

<div class="flex gap-4">
	<Button onclick={generate_ics_file} variant="primary-outline" size="sm">
		<CalendarArrowDown />
		Download iCal
	</Button>

	<Button
		href={google_calendar_url}
		variant="primary-outline"
		target="_blank"
		rel="noopener noreferrer"
		size="sm"
	>
		<CalendarPlus2 />
		Add to Google Calendar
	</Button>
</div>
