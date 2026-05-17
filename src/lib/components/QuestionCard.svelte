<script>
	import { mode } from '$lib/stores/quiz.js';
	import { getOptionLetter } from '$lib/utils/quiz.js';

	let {
		question,
		questionNumber,
		selectedAnswer = null,
		onSelectAnswer = () => {},
		isLocked = false,
		showExplanation = false,
		isLastQuestion = false,
		onNext = () => {}
	} = $props();

	const letters = ['A', 'B', 'C', 'D'];

	function getOptionState(idx) {
		const isSelected = selectedAnswer === idx;
		const isCorrect = idx === question.correctIndex;

		if ($mode === 'braingym' && showExplanation) {
			if (isCorrect) return 'correct';
			if (isSelected) return 'incorrect';
			return 'neutral-locked';
		}
		if (isSelected) return 'selected';
		return 'neutral';
	}
</script>

<div class="qcard">
	<!-- Comprehension passage (shown when question has a passage field) -->
	{#if question.passage}
		<div class="passage-block">
			<div class="passage-label">📖 Read the passage, then answer the question below</div>
			<p class="passage-text">{question.passage}</p>
		</div>
	{/if}

	<!-- Sample/reference diagram (quantitative reasoning pattern questions) -->
	{#if question.sampleImagePath}
		<div class="diagram-block diagram-sample">
			<p class="diagram-label">📋 Study the sample pattern below:</p>
			<img src={question.sampleImagePath} alt="Sample pattern diagram" class="diagram-image" />
		</div>
	{/if}

	<!-- Question diagram -->
	{#if question.imagePath}
		<div class="diagram-block">
			<img src={question.imagePath} alt="Question diagram" class="diagram-image" />
		</div>
	{/if}

	<!-- Question -->
	<p class="question-text">
		<span class="question-num">{questionNumber}.</span>
		{question.question}
	</p>

	<!-- Options -->
	<div class="options">
		{#each question.options as option, idx}
			{@const state = getOptionState(idx)}
			<button
				onclick={() => onSelectAnswer(idx)}
				disabled={isLocked && $mode === 'braingym'}
				class="option option-{state}"
				aria-pressed={selectedAnswer === idx}
			>
				<span class="option-letter">{letters[idx]}.</span>
				<span class="option-text">{option}</span>

				<!-- Brain Gym inline feedback -->
				{#if $mode === 'braingym' && showExplanation && state === 'correct'}
					<div class="feedback feedback-correct">
						<span class="feedback-icon">✓</span>
						<span class="feedback-label">Right answer</span>
					</div>
					<p class="feedback-explanation">{question.explanation}</p>
					{#if question.extraKokoFact}
						<div class="koko-fact">
							<span>⭐ Koko Knows!</span>
							<p>{question.extraKokoFact}</p>
						</div>
					{/if}
				{:else if $mode === 'braingym' && showExplanation && state === 'incorrect'}
					<div class="feedback feedback-incorrect">
						<span class="feedback-icon">✗</span>
						<span class="feedback-label">Not quite</span>
					</div>
					<p class="feedback-explanation">{question.explanation}</p>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Next button — bottom right -->
	<div class="next-row">
		<button
			onclick={onNext}
			disabled={selectedAnswer === null}
			class="next-btn {selectedAnswer === null ? 'next-btn-disabled' : 'next-btn-active'}"
		>
			{isLastQuestion && $mode === 'braingym' ? 'See Results' : 'Next'}
		</button>
	</div>
</div>

<style>
	.qcard {
		background: #ffffff;
		padding: 24px 20px 20px;
	}

	/* Comprehension passage */
	.passage-block {
		background: #f8f4ff;
		border-left: 4px solid var(--color-primary);
		border-radius: 8px;
		padding: 14px 16px;
		margin-bottom: 20px;
	}

	.passage-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin-bottom: 10px;
	}

	.passage-text {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: #333333;
		font-style: italic;
		margin: 0;
	}

	/* Diagram blocks */
	.diagram-block {
		margin-bottom: 16px;
		text-align: center;
	}

	.diagram-sample {
		background: #f8f4ff;
		border-left: 4px solid var(--color-primary);
		border-radius: 8px;
		padding: 14px 16px;
		text-align: left;
	}

	.diagram-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-primary);
		margin: 0 0 10px 0;
	}

	.diagram-image {
		max-width: 100%;
		height: auto;
		border-radius: 6px;
		display: block;
		margin: 0 auto;
	}

	/* Question */
	.question-text {
		font-size: 1rem;
		font-weight: 500;
		color: #333333;
		line-height: 1.6;
		margin-bottom: 24px;
	}

	.question-num {
		font-weight: 700;
		margin-right: 6px;
	}

	/* Options list */
	.options {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 28px;
	}

	.option {
		width: 100%;
		text-align: left;
		border: none;
		border-radius: 12px;
		padding: 14px 16px;
		cursor: pointer;
		font-family: var(--font-main);
		font-size: 0.9375rem;
		transition: background 0.15s;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 10px;
	}

	/* States */
	.option-neutral {
		background: #f0f2f5;
		color: #333333;
	}

	.option-neutral:hover:not(:disabled) {
		background: #e8eaed;
	}

	.option-neutral-locked {
		background: #f0f2f5;
		color: #777777;
		cursor: default;
	}

	.option-selected {
		background: #f0f2f5;
		color: #333333;
		border: 2px solid #404756;
	}

	.option-correct {
		background: #eaf6ee;
		color: #333333;
		cursor: default;
	}

	.option-incorrect {
		background: #fdecea;
		color: #333333;
		cursor: default;
	}

	/* Letter label */
	.option-letter {
		font-weight: 700;
		color: #777777;
		flex-shrink: 0;
		min-width: 20px;
	}

	.option-correct .option-letter,
	.option-incorrect .option-letter {
		color: inherit;
	}

	.option-text {
		flex: 1;
	}

	/* Inline feedback */
	.feedback {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 10px;
		font-weight: 700;
		font-size: 0.875rem;
	}

	.feedback-correct {
		color: #16a34a;
	}

	.feedback-incorrect {
		color: #dc2626;
	}

	.feedback-icon {
		font-size: 1rem;
	}

	.feedback-label {
		font-size: 0.875rem;
	}

	.feedback-explanation {
		width: 100%;
		font-size: 0.875rem;
		color: #555555;
		line-height: 1.55;
		margin-top: 6px;
		font-weight: 400;
	}

	.koko-fact {
		width: 100%;
		margin-top: 10px;
		background: #fff3fb;
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 0.875rem;
		color: var(--color-primary);
		font-weight: 600;
	}

	.koko-fact p {
		font-weight: 400;
		color: #555555;
		margin-top: 4px;
	}

	/* Next button */
	.next-row {
		display: flex;
		justify-content: flex-end;
	}

	.next-btn {
		padding: 12px 28px;
		border-radius: 24px;
		font-size: 0.9375rem;
		font-weight: 700;
		font-family: var(--font-main);
		border: none;
		cursor: pointer;
		min-width: 100px;
		transition: opacity 0.15s, transform 0.1s;
	}

	.next-btn-active {
		background: var(--color-primary);
		color: #ffffff;
	}

	.next-btn-active:active {
		transform: scale(0.97);
		opacity: 0.9;
	}

	.next-btn-disabled {
		background: #e8e8e8;
		color: #bbbbbb;
		cursor: not-allowed;
	}
</style>
