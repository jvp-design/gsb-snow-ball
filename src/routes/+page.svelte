<script lang="ts">
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance } from '$app/forms';
	import {
		PUBLIC_BOUTONNIERE_PRICE,
		PUBLIC_CORSAGE_PRICE,
		PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
	} from '$env/static/public';
	import FlowersCountdown from '$lib/components/FlowersCountdown.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import {
		Control,
		Description,
		Field,
		FieldErrors,
		Fieldset,
		Legend
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { class_options, type ClassOptionType } from '$lib/types';
	import { currency_formatter } from '$lib/utils/formatter';
	import { create_re_captcha_client } from '$lib/utils/recaptcha';

	import type { PageProps } from './$types';
	import Alert from '$lib/components/alert.svelte';
	import { schema } from './utils';

	import { Loader } from 'lucide-svelte';

	let { data }: PageProps = $props();

	let loading: boolean = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(schema),
		multipleSubmits: 'prevent'
	});

	const { form: formData, constraints, errors, message } = form;

	type HandleClassesCheckedPayloadType = {
		value: boolean;
		opt: ClassOptionType;
	};
	const handle_classes_checked = ({ value, opt }: HandleClassesCheckedPayloadType) => {
		if (value) {
			$formData.classes = [...$formData.classes, opt];
		} else {
			// @ts-ignore - Filter operation maintains non-empty array due to form validation, but TypeScript can't infer this
			$formData.classes = $formData.classes.filter((c) => c !== opt) as ClassOptionType[];
		}
	};

	let total = $derived(
		(Number($formData.corsages ?? 0) * Number(PUBLIC_CORSAGE_PRICE ?? 0)) / 100 +
			(Number($formData.boutonnieres ?? 0) * Number(PUBLIC_BOUTONNIERE_PRICE ?? 0)) / 100
	);
	let total_string = $derived(currency_formatter.format(total));
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
		Register Below
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
		<Field {form} name="name" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<Label>Name</Label>
					<Input
						{...props}
						{...$constraints.name}
						type="text"
						class="focus-me"
						bind:value={$formData.name}
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
		<Field {form} name="email" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<Label>Email</Label>
					<Input {...props} {...$constraints.email} type="text" bind:value={$formData.email} />
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
		<Field {form} name="attendees" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<Label>Number of Attendees</Label>
					<Input
						{...props}
						{...$constraints.attendees}
						type="number"
						bind:value={$formData.attendees}
					/>
				{/snippet}
			</Control>
			<div class="h-5">
				{#if $errors.attendees?.length}
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
				{:else}
					<small class="text-gray-700">
						Count children <strong><em>and</em></strong>
						adults.
					</small>
				{/if}
			</div>
		</Field>
		<Fieldset {form} name="classes" class="space-y-0 pt-2">
			<div class="pb-2">
				<Legend>Classes</Legend>
				<Description>
					Please select all of the classes of children who will be attending
				</Description>
			</div>
			<div class="grid grid-cols-2 gap-2">
				{#each class_options as opt}
					{@const checked = $formData.classes.includes(opt)}
					<div class="flex items-start space-x-3">
						<Control>
							{#snippet children({ props })}
								<Checkbox
									{...props}
									{checked}
									id={opt}
									value={opt}
									onCheckedChange={(value) => {
										handle_classes_checked({ opt, value });
									}}
								/>
								<Label for={opt}>
									{opt}
								</Label>
							{/snippet}
						</Control>
					</div>
				{/each}
			</div>
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
		</Fieldset>
		<Separator />
		<h3 class="font-medium lg:text-lg xl:text-xl">
			Corsage/Boutonnière Purchase <small>(Optional)</small>
		</h3>
		<p>
			If you would like to purchase any corsages or boutonnières for the snow ball, please do so by
			indicating below how many of each you would like to purchase.
		</p>
		<FlowersCountdown />
		<Field {form} name="corsages" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<div class="flex items-center justify-between">
						<Label># of Corsages</Label>
						<span>$25 each</span>
					</div>
					<Input
						{...props}
						{...$constraints.corsages}
						type="number"
						bind:value={$formData.corsages}
					/>
				{/snippet}
			</Control>
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
		</Field>
		<Field {form} name="boutonnieres" class="space-y-0">
			<Control>
				{#snippet children({ props })}
					<div class="flex items-center justify-between">
						<Label># of Boutonnières</Label>
						<span>$25 each</span>
					</div>
					<Input
						{...props}
						{...$constraints.boutonnieres}
						type="number"
						bind:value={$formData.boutonnieres}
					/>
				{/snippet}
			</Control>
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
		</Field>
		<div class="flex items-start justify-between">
			<div>
				<p>
					Total: {total_string}
				</p>
				{#if total > 0}
					<p transition:fade class="text-sm italic text-primary">
						You must complete the payment on the following page for your registration to be
						submitted
					</p>
				{/if}
			</div>
			<Button type="submit" class="flex min-w-[100px] items-center justify-center">
				{#if loading}
					<Loader class="animate-spin" />
				{:else}
					Submit
				{/if}
			</Button>
		</div>
	</form>
</div>
