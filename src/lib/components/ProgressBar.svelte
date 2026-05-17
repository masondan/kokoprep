<script>
	import { sessionQuestions, currentIndex, answers, mode } from '$lib/stores/quiz.js';

	let questionCount = $derived.by(() => $sessionQuestions.length);
</script>

<!-- Segmented progress bar — works for any count -->
<div class="progress-wrap">
	<div class="segments">
		{#each Array.from({ length: questionCount }) as _, idx}
			{@const isAnswered = $answers[idx] !== null && $answers[idx] !== undefined}
			{@const isCorrect = isAnswered && $answers[idx] === $sessionQuestions[idx]?.correctIndex}
			{@const isCurrent = idx === $currentIndex}
			<div
				class="segment {isCurrent
					? 'seg-current'
					: isAnswered && $mode === 'braingym'
						? isCorrect
							? 'seg-correct'
							: 'seg-incorrect'
						: isAnswered
							? 'seg-done'
							: 'seg-empty'}"
			></div>
		{/each}
	</div>
	<div class="progress-meta">
		<span class="progress-count">{$currentIndex + 1}/{questionCount}</span>
	</div>
</div>

<style>
	.progress-wrap {
		padding: 0 20px 16px;
		background: #ffffff;
	}

	.segments {
		display: flex;
		gap: 3px;
		height: 4px;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 6px;
	}

	.segment {
		flex: 1;
		border-radius: 2px;
		transition: background 0.2s;
	}

	.seg-empty {
		background: #e8e8e8;
	}

	.seg-current {
		background: var(--color-primary);
	}

	.seg-done {
		background: #cccccc;
	}

	.seg-correct {
		background: #16a34a;
	}

	.seg-incorrect {
		background: #dc2626;
	}

	.progress-meta {
		display: flex;
		justify-content: flex-end;
	}

	.progress-count {
		font-size: 0.75rem;
		font-weight: 600;
		color: #999999;
	}
</style>
