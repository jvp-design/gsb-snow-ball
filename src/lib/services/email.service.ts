import { BASE_URL } from '$env/static/private';
import {
	PUBLIC_END_TIME,
	PUBLIC_EVENT_DESCRIPTION,
	PUBLIC_EVENT_TITLE,
	PUBLIC_LOCATION,
	PUBLIC_START_TIME
} from '$env/static/public';
import { mailer } from '$lib/server/mailer';
import {
	type CalendarEvent,
	generate_google_calendar_url,
	generate_ics_content,
	sanitize_filename
} from '$lib/utils/calendar';

const send_registration_confirmed_email = async (to: string, id: string) => {
	const title = PUBLIC_EVENT_TITLE;
	const description = PUBLIC_EVENT_DESCRIPTION;
	const start_time = PUBLIC_START_TIME;
	const end_time = PUBLIC_END_TIME;
	const location = PUBLIC_LOCATION;

	const event: CalendarEvent = {
		title,
		description,
		start_time,
		end_time,
		location
	};

	const google_calendar_url = generate_google_calendar_url(event);
	const ical_content = generate_ics_content(event, {
		prodId: '-//JVPDesignLLC//EventInvite//EN',
		domain: 'jvp.design'
	});

	mailer.send_mail({
		to,
		subject: `Event Invitation: ${title}`,
		text: `You have been invited to ${title}. Please find the calendar invitation attached. To view your registration please go to ${BASE_URL}/registrations/${id}`,
		html: {
			title: `Event Invitation: ${title}`,
			style: `
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        main {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .calendar-button {
          display: inline-block;
          padding: 10px 20px;
          margin: 10px 0;
          background-color: transparent;
          border: 1px solid hsl(203 100% 32%);
          color: hsl(203 100% 32%);
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
        }
        .calendar-button:hover {
          background-color: rgba(0, 120, 212, 0.1);
        }
        h2 {
        	color: hsl(203 100% 32%);
        }
      `,
			body: `
					<main>
  					<h2>${title}</h2>
          	<p>${description}</p>
          	<p><strong>When:</strong> ${new Date(start_time).toLocaleString()}</p>
          	<p><strong>Where:</strong> ${location}</p>
						<p>You have successfully registered for the 2025 Gill St. Bernard's Lower School Snow Ball.</p>
						<p>To view the status of your registration please visit</p>
						<p><a href="${BASE_URL}/registrations/${id}" target="_blank">${BASE_URL}/registrations/${id}</a></p>
						<div style="margin: 20px 0;">
            	<p>Add this event to your calendar:</p>
            	<a href="${google_calendar_url}" class="calendar-button" target="_blank" rel="noopener noreferrer">
             	 Add to Google Calendar
            	</a>
            	<p style="margin-top: 10px; font-size: 14px; color: #666;">
              	An iCal file is also attached to this email for other calendar applications.
            	</p>
          	</div>
						<br />
						<p>Warm Regards,</p>
						<p>The GSB LS Parent Coordinators</p>
					</main>
				`
		},
		ical_event: {
			filename: `${sanitize_filename(title)}.ics`,
			method: 'REQUEST',
			content: ical_content
		}
	});
};

export default {
	send_registration_confirmed_email
};
