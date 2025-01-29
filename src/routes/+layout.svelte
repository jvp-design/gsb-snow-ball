<script lang="ts">
	import type { Snippet } from 'svelte';
	import { deepMerge, MetaTags } from 'svelte-meta-tags';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import Snowman from '$lib/components/Snowman.svelte';
	import { Button } from '$lib/components/ui/button';

	import type { PageData } from './$types';

	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	type Props = {
		data: PageData;
		children: Snippet;
	};
	let { children, data }: Props = $props();

	afterNavigate(() => {
		const to_focus: HTMLElement | null = document.querySelector('.focus-me');
		to_focus?.focus();
	});

	let metaTags = $derived(deepMerge(data.base_meta_tags, page.data.page_meta_tags));
</script>

<MetaTags {...metaTags} />
<ModeWatcher />

<main class="relative flex min-h-screen flex-col">
	<div class="absolute inset-0 -z-10">
		<Snowman name="1" class="absolute bottom-12 right-4 size-32 -rotate-12 opacity-20 sm:hidden" />
		<Snowman name="2" class="absolute bottom-1/4 left-8 size-40 rotate-12 opacity-15 sm:hidden" />

		<Snowman
			name="3"
			class="absolute right-16 top-1/3 hidden size-48 -rotate-6 opacity-25 sm:inline md:hidden"
		/>
		<Snowman
			name="1"
			class="absolute bottom-1/3 left-20 hidden size-56 rotate-45 opacity-20 sm:inline md:hidden"
		/>

		<Snowman
			name="1"
			class="absolute bottom-36 left-24 hidden size-64 rotate-45 opacity-30 md:inline"
		/>
		<Snowman
			name="2"
			class="absolute bottom-1/4 right-12 hidden size-64 -rotate-12 opacity-30 md:inline"
		/>
		<Snowman name="3" class="absolute left-1/3 top-1/2 hidden size-64 opacity-30 md:inline" />
		<Snowman
			name="2"
			class="absolute left-16 top-24 hidden size-48 -rotate-180 opacity-20 md:inline"
		/>
		<Snowman
			name="1"
			class="absolute bottom-1/2 right-1/4 hidden size-56 rotate-12 opacity-25 md:inline"
		/>

		<Snowman
			name="3"
			class="absolute right-40 top-40 hidden size-72 -rotate-45 opacity-20 lg:inline"
		/>
		<Snowman
			name="2"
			class="absolute bottom-48 left-1/2 hidden size-48 rotate-90 opacity-15 lg:inline"
		/>
		<Snowman
			name="1"
			class="absolute bottom-[45%] left-[20%] hidden size-64 -rotate-90 opacity-25 lg:inline"
		/>
	</div>

	<div class="fixed right-0 top-0 z-10"></div>
	<section class="relative flex-1">
		{@render children()}
	</section>

	<div class="flex items-center justify-between">
		<span>&nbsp;</span>
		<span class="text-sm">
			designed and hosted by <Button
				variant="link"
				target="_blank"
				class="p-0"
				href="https://www.jvp.design"
			>
				JVP Design, LLC
			</Button>
		</span>
		<LightSwitch />
	</div>
</main>
