<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { CalendarArrowDown, CalendarPlus2 } from 'lucide-svelte';
	import {
		type CalendarEvent,
		generate_google_calendar_url,
		generate_ics_content
	} from '$lib/utils/calendar';

	type Props = CalendarEvent;
	let event: Props = $props();

	function generate_ics_file() {
		const ics_content = generate_ics_content(event);

		const blob = new Blob([ics_content], { type: 'text/calendar;charset=utf-8' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}

	let google_calendar_url = $derived(generate_google_calendar_url(event));
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
