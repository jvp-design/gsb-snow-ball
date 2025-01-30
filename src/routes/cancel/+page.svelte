<script lang="ts">
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-2xl px-4 py-12">
	<h1>Order Cancelled</h1>

	{#if data.registration}
		<p>Your registration is incomplete because the payment was cancelled.</p>
		<p>You can try again by returning to the registration page.</p>
	{:else}
		<p>No registration found.</p>
	{/if}

	<a href="/register" class="mt-4 inline-block">Return to Registration</a>
</div>
