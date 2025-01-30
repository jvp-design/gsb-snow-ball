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
	import CalendarDownload from './calendar-download.svelte';
	import { Separator } from '$lib/components/ui/separator';

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
		<div class="mx-auto grid max-w-5xl grid-cols-1 gap-3 px-4 pt-4 sm:pt-8 md:grid-cols-2">
			<div class="p-2 backdrop-blur-md">
				<p>GSB LS Parent Coordinators Present</p>
				<h1
					class="font-rundeck text-lg text-primary sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				>
					2025 Gill St Bernard's Lower School Snow "Ball"
				</h1>
				<div class="space-y-2">
					<p class="italic md:text-lg lg:text-xl xl:text-2xl">
						Parent-child dance for 1st-4th Graders
					</p>
					<time class="block md:text-lg lg:text-xl xl:text-2xl" datetime="2024-02-20T17:30-19:00">
						Thursday, February 20; 5:30pm-7:00pm
					</time>
					<p class="md:text-lg lg:text-xl xl:text-2xl">Evans Hall</p>
					<p>Come in concert attire, please</p>
					<p>Pizza, snacks, and water will be provided</p>
					<CalendarDownload
						title="Snow Ball Dance"
						description="Parent-child dance for 1st-4th Graders. Come in concert attire. Pizza, snacks and water provided."
						start_time="2025-02-20T17:30:00"
						end_time="2025-02-20T19:00:00"
						location="Gill St. Bernard's School, 25 St Bernards Rd Box 604, Gladstone, NJ 07934, USA"
					/>
				</div>
			</div>
			<Separator class="md:hidden" />
			{@render children()}
		</div>
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
