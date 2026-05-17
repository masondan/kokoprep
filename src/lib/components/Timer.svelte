<script>
	import { onMount, onDestroy } from 'svelte';
	import { timeRemaining, timerActive, timerMinutes, screen, answers, currentIndex, sessionQuestions } from '$lib/stores/quiz.js';
	import { formatTime } from '$lib/utils/quiz.js';

	let interval = $state(null);
	let isUnderOneMinute = $state(false);

	onMount(() => {
		// Initialize timer
		timeRemaining.set($timerMinutes * 60);
		timerActive.set(true);

		interval = setInterval(() => {
			timeRemaining.update(t => {
				const newTime = t - 1;
				isUnderOneMinute = newTime < 60 && newTime > 0;

				if (newTime <= 0) {
					clearInterval(interval);
					timerActive.set(false);
					// Mark current question as unanswered
					answers.update(arr => {
						if ($currentIndex < arr.length) {
							arr[$currentIndex] = null;
						}
						return arr;
					});
					screen.set('results');
					return 0;
				}
				return newTime;
			});
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div
	class={`text-lg font-bold font-mono ${
		isUnderOneMinute ? 'text-red-600 pulse' : 'text-gray-800'
	}`}
	role="timer"
	aria-live="polite"
>
	{formatTime($timeRemaining)}
</div>

<style>
	:global(.pulse) {
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
