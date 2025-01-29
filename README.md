# GSB Snow Ball

This is a simple website that allows users to sign up for a local school's winter elementary school dance.
It utilizes Svelte 5 with SvelteKit 2, [Shadcn-Svelte](https://next.shadcn-svelte.com/), [SvelteKit Superforms](https://superforms.rocks/), and [Drizzle ORM](https://orm.drizzle.team/).
It is designed to be self-hosted using the node adapter; I will be hosting it on a [Coolify](https://www.coolify.io/) instance I have running.
The database of choice is SQLite because this is a very straightforward, simple implementation; the school is relatively small and there is no need to get fancy.
Users will also have the option to purchase corsages and/or boutonnières.
This selection will redirect users to a Stripe checkout page.