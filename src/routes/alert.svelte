<script lang="ts">
	import {
		AlertDescription,
		AlertTitle,
		type AlertVariant,
		Root as AlertRoot
	} from '$lib/components/ui/alert';
	import type { Message } from '$lib/types/super-forms';

	type Props = {
		type: Message['type'];
		title?: string;
		text: string;
	};
	let { type, title, text }: Props = $props();

	let variant: AlertVariant = $derived(
		type === 'error' ? 'destructive' : type === 'success' ? 'success' : 'default'
	);
</script>

<AlertRoot {variant}>
	{#if title}
		<AlertTitle>
			{title}
		</AlertTitle>
	{/if}
	<AlertDescription>
		{text}
	</AlertDescription>
</AlertRoot>
