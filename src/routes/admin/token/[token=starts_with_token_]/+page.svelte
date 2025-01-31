<script lang="ts">
	import { enhance } from '$app/forms';
	import { Loader } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let loading: boolean = $state(false);
</script>

<div class="p-2 backdrop-blur-md">
	<h2 class="font-rundeck text-primary sm:text-lg md:pt-6 md:text-xl lg:text-2xl xl:text-3xl">
		Confirm Login
	</h2>
	<form
		method="POST"
		use:enhance={async () => {
			loading = true;

			return async ({ update }) => {
				update();
				loading = false;
			};
		}}
	>
		<p>Please click the button to finish the log in process.</p>
		<Button type="submit" class="flex min-w-[100px] items-center justify-center">
			{#if loading}
				<Loader class="animate-spin" />
			{:else}
				Log In
			{/if}
		</Button>
	</form>
</div>
