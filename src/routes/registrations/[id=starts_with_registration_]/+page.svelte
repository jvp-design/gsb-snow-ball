<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { CUTOFF_DATE } from '$lib/constants';
	import { currency_formatter } from '$lib/utils/formatter';

	import type { PageProps } from './$types';

	import { DateTime } from 'luxon';

	let { data }: PageProps = $props();

	const now = DateTime.now().setZone('UTC');
	const diff = CUTOFF_DATE.diff(now);
</script>

<div class="p-2 backdrop-blur-md">
	<h2 class="font-rundeck text-primary sm:text-lg md:pt-6 md:text-xl lg:text-2xl xl:text-3xl">
		Registration Details
	</h2>
	<p>Thank you for registering for the 2025 GSB Lower School Snow Ball!</p>
	<p>Please see your registration details below.</p>
	<ul class="divide-y">
		<li>
			<Label class="text-xs italic">Name</Label>
			<span class="block">{data.registration?.name}</span>
		</li>
		<li>
			<Label class="text-xs italic">Email</Label>
			<span class="block">{data.registration?.email}</span>
		</li>
		<li>
			<Label class="text-xs italic"># of Attendees (including adults)</Label>
			<span class="block">{data.registration?.attendees}</span>
		</li>
		<li>
			<Label class="text-xs italic">Classes</Label>
			<ul>
				{#each (data.registration?.classes ?? '').split('~~') as c}
					<li>{c}</li>
				{/each}
			</ul>
		</li>
		{#if data.registration?.corsages}
			<li>
				<Label class="text-xs italic"># of Corsages Purchased</Label>
				<span class="block">{data.registration?.corsages}</span>
			</li>
		{/if}
		{#if data.registration?.boutonnieres}
			<li>
				<Label class="text-xs italic"># of Boutonnières Purchased</Label>
				<span class="block">{data.registration?.boutonnieres}</span>
			</li>
		{/if}
		{#if data.registration?.amount_paid}
			<li>
				<Label class="text-xs italic">Total Paid</Label>
				<span class="block">{currency_formatter.format(data.registration.amount_paid / 100)}</span>
			</li>
		{/if}
	</ul>

	<div class="pt-16">
		<h3 class="sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Cancel Registration</h3>
		<p>
			Plans changed? Either get in touch with Jill or Pam in the LS office or send a message to <Button
				variant="link"
				class="p-0"
				href="mailto:info@jvp.design?subject=Cancel Snow Ball Registration"
			>
				info@jvp.design
			</Button> and please include the email address used to sign up.
		</p>
		{#if data.registration?.amount_paid}
			{#if diff.milliseconds > 0}
				Upon receiving your request to cancel your registration we will refund your floral purchase
				as soon as possible
			{:else}
				We cannot guarantee that we will be able to cancel your floral purchase and refund your
				money at this time
			{/if}
		{/if}
	</div>
</div>
