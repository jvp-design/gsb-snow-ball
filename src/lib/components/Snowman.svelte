<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		name: '1' | '2' | '3';
		class: string;
	};

	let { name, class: className }: Props = $props();

	let src = $derived(`/images/snowmen/snowman-${name}.svg`);
</script>

<img {src} alt={`Snowman variant ${name}`} class={cn(className)} />
