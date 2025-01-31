<script lang="ts">
	import type { PageProps } from './$types';
	import { schema } from './utils';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import Alert from '$lib/components/alert.svelte';
	import { create_re_captcha_client } from '$lib/utils/recaptcha';
	import { enhance } from '$app/forms';
	import { Control, Field, FieldErrors } from '$lib/components/ui/form';
	import { Loader } from 'lucide-svelte';

	let { data }: PageProps = $props();

	let loading: boolean = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(schema),
		multipleSubmits: 'prevent'
	});

	const { form: formData, constraints, errors, message } = form;
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/api.js?render={PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}"
		async
		defer
	></script>
</svelte:head>

<div class="p-2 backdrop-blur-md">
	<h2 class="font-rundeck text-primary sm:text-lg md:pt-6 md:text-xl lg:text-2xl xl:text-3xl">
		Admin Login
	</h2>
	{#if $message}
		<Alert {...$message} />
	{/if}
	<form
		method="POST"
		class="space-y-2"
		use:enhance={async ({ formData }) => {
			loading = true;
			const token = await create_re_captcha_client(formData.get('token'), window.grecaptcha);
			formData.append('token', String(token));
			return async ({ update }) => {
				update();
				loading = false;
			};
		}}
	>
		<Field {form} name="email" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<Label>Email</Label>
					<Input
						{...props}
						{...$constraints.email}
						type="email"
						bind:value={$formData.email}
						class="focus-me"
					/>
				{/snippet}
			</Control>
			<div class="h-5">
				<FieldErrors>
					{#snippet children({ errors, errorProps })}
						<span
							class="{errors?.length ? 'opacity-100' : 'opacity-0'} dark:text-red-200"
							{...errorProps}
						>
							{errors[0]}
						</span>
					{/snippet}
				</FieldErrors>
			</div>
		</Field>
		<Button type="submit" class="flex min-w-[100px] items-center justify-center">
			{#if loading}
				<Loader class="animate-spin" />
			{:else}
				Submit
			{/if}
		</Button>
	</form>
</div>
