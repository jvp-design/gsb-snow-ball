<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let total_attendees = $derived(data.registrations.reduce((a, b) => a + b.attendees, 0));
	let total_corsages = $derived(data.registrations.reduce((a, b) => a + b.corsages, 0));
	let total_boutonnieres = $derived(data.registrations.reduce((a, b) => a + b.boutonnieres, 0));
</script>

<div class="p-2 backdrop-blur-md">
	<h2 class="font-rundeck text-primary sm:text-lg md:pt-6 md:text-xl lg:text-2xl xl:text-3xl">
		Current Registrations
	</h2>
	<p>
		Here is the list of currently-registered attendees. The total attendee count is {total_attendees},
		{total_corsages} corsages have been purchased, and {total_boutonnieres} boutonnières have been purchased.
	</p>
	<ul class="divide-y">
		{#each data.registrations as reg}
			<li class="[&>span]:flex [&>span]:items-center [&>span]:gap-0.5 [&>span]:py-0.5">
				<span>
					<small class="text-gray-700">Name:</small>
					<span>{reg.name}</span>
				</span>
				<span>
					<small class="text-gray-700">Email:</small>
					<span>{reg.email}</span>
				</span>
				<span>
					<small class="text-gray-700">Attendees:</small>
					<span>{reg.attendees}</span>
				</span>
				<span>
					<small class="text-gray-700">Class(es):</small>
					{reg.classes.split('~~').join(', ')}
				</span>
				<span>
					<small class="text-gray-700">Corsages:</small>
					<span>{reg.corsages}</span>
				</span>
				<span>
					<small class="text-gray-700">Boutonnières:</small>
					<span>{reg.boutonnieres}</span>
				</span>
			</li>
		{/each}
	</ul>
</div>
