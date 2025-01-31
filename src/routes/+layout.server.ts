import type { MetaTagsProps } from 'svelte-meta-tags';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const base_meta_tags = Object.freeze({
		title: 'Snow Ball',
		titleTemplate: '%s | GSB 2025 Snow Ball',
		description:
			'A simple registration form with the option to purchase corsages and boutonnieres.',
		canonical: new URL(url.pathname, url.origin).href,
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
			locale: 'en_IE',
			title: 'Open Graph Title',
			description: 'Open Graph Description',
			siteName: 'SiteName',
			images: [
				{
					url: 'https://www.example.ie/og-image.jpg',
					alt: 'Og Image Alt',
					width: 800,
					height: 600,
					secureUrl: 'https://www.example.ie/og-image.jpg',
					type: 'image/jpeg'
				}
			]
		}
	}) satisfies MetaTagsProps;

	return {
		base_meta_tags,
		is_admin: locals.user?.is_admin
	};
};
