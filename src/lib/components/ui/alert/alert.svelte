<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: '[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				destructive:
					'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
				error:
					'border-red-600 [&>*]:text-red-600 bg-red-50 [&>svg]:text-red-600 dark:bg-transparent dark:[&>*]:text-red-200 dark:border-red-200 dark:[&>svg]:text-red-200',
				success:
					'border-green-600 [&>*]:text-green-600 bg-green-50 [&>svg]:text-green-600 dark:bg-transparent dark:[&>*]:text-green-200 dark:border-green-200 dark:[&>svg]:text-green-200',
				warning:
					'border-yellow-600 [&>*]:text-yellow-600 bg-yellow-50 [&>svg]:text-yellow-600 dark:bg-transparent dark:[&>*]:text-yellow-200 dark:border-yellow-200 dark:[&>svg]:text-yellow-200'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	import type { WithElementRef } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	} = $props();
</script>

<div bind:this={ref} class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
	{@render children?.()}
</div>
