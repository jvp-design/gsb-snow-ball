<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CUTOFF_DATE } from '$lib/constants';

	import { DateTime } from 'luxon';

	let timeRemaining: string = '';
	let intervalId: ReturnType<typeof setInterval>;

	function update_countdown() {
		const now = DateTime.now().setZone('UTC');
		const diff = CUTOFF_DATE.diff(now);

		if (diff.milliseconds <= 0) {
			timeRemaining = 'Flower orders are now closed';
			clearInterval(intervalId);
			return;
		}

		const { days, hours, minutes, seconds } = diff
			.shiftTo('days', 'hours', 'minutes', 'seconds')
			.toObject();

		timeRemaining = `${Math.floor(days!)}d ${Math.floor(hours!)}h ${Math.floor(minutes!)}m ${Math.floor(seconds!)}s`;
	}

	onMount(() => {
		update_countdown();
		intervalId = setInterval(update_countdown, 1000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div class="text-sm text-primary">
	Flower orders available for: {timeRemaining}
</div>
