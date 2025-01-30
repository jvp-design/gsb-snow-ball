import { DualMailer, type MailConfig } from '@jvp/dual-mailer';
import { dev } from '$app/environment';
import {
	EMAIL_HOST,
	EMAIL_PORT,
	MAILGUN_API_KEY,
	MAILGUN_DOMAIN,
	NOREPLY_EMAIL
} from '$env/static/private';

const config: MailConfig = {
	host: EMAIL_HOST,
	port: +EMAIL_PORT,
	mailgun_api_key: MAILGUN_API_KEY,
	mailgun_domain: MAILGUN_DOMAIN,
	is_dev: dev,
	noreply_email: NOREPLY_EMAIL
};

export const mailer = new DualMailer(config);
