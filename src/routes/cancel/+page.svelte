<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<div class="p-2 backdrop-blur-md">
	<h2 class="font-rundeck text-primary sm:text-lg md:pt-6 md:text-xl lg:text-2xl xl:text-3xl">
		Registration Canceled
	</h2>

	{#if data.registration}
		<p>Your registration is incomplete because the payment was cancelled.</p>
		<p>You can try again by returning to the registration page.</p>
	{:else}
		<p>No registration found.</p>
	{/if}

	<Button href="/" class="px-0" variant="link">Back to the registration page</Button>
</div>
