<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ul class="list-inside list-disc gap-2">
	{#each data.registrations as reg}
		<li>
			Name: {reg.name}, Email: {reg.email}, Attendees: {reg.attendees}, Class(es): {reg.classes},
			Corsages: {reg.corsages}, Boutonnières: {reg.boutonnieres}. Payment Status: {reg.payment_status}
		</li>
	{/each}
</ul>
