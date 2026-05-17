<script>
	import { onMount } from 'svelte';
	import {
		mode,
		category,
		screen,
		sessionQuestions,
		answers,
		testHistory,
		missedQuestionIds,
		resetSession,
		calculateScore,
		saveSessionToHistory,
		updateMissedQuestions,
		questions
	} from '$lib/stores/quiz.js';
	import { getCelebratoryMessage, getOptionLetter, getBrainGymResultMessage } from '$lib/utils/quiz.js';

	const categoryMap = {
		mathematics: 'Mathematics',
		english: 'English Language',
		'basic-science': 'Basic Science',
		'basic-technology': 'Basic Technology',
		'social-studies': 'Social Studies',
		'civic-education': 'Civic Education',
		'christian-religious-studies': 'Christian Religious Studies',
		'computer-studies': 'Computer Studies',
		'agriculture-science': 'Agricultural Science',
		mix: 'Mix It Up'
	};

	let scoreData = $state({ correct: 0, total: 0, percentage: 0 });
	let celebratory = $state('');
	let brainGymMessage = $state('');
	let openPanels = $state([]);
	let timerRanOut = $state(false);

	onMount(() => {
		scoreData = calculateScore($answers, $sessionQuestions);
		celebratory = getCelebratoryMessage(scoreData.percentage);

		// Detect if timer ran out: if not all questions were answered
		if ($mode === 'beattheclock') {
			const allAnswered = $answers.every(ans => ans !== null);
			timerRanOut = !allAnswered;
		}

		// Get Brain Gym message based on score
		if ($mode === 'braingym') {
			brainGymMessage = getBrainGymResultMessage(scoreData.correct, scoreData.total);
		}

		// Initialize openPanels array with false for each question
		openPanels = new Array($sessionQuestions.length).fill(false);

		// Update missed questions and history
		updateMissedQuestions($answers, $sessionQuestions, $questions);
		saveSessionToHistory(scoreData.correct, scoreData.total, scoreData.percentage);
	});

	function togglePanel(idx) {
		// Close all panels except the one being toggled
		openPanels = openPanels.map((_, i) => i === idx ? !openPanels[idx] : false);
	}

	function handleNewSession() {
		resetSession();
		screen.set('dashboard');
	}

	function handleReviewMissed() {
		if ($missedQuestionIds.length > 0) {
			resetSession();
			screen.set('dashboard');
		}
	}
</script>

<div class="results-wrap">

	{#if $mode === 'braingym'}
		<!-- Brain Gym Results -->

		<!-- Helper text: based on score -->
		<div class="btc-heading">
			{brainGymMessage}
		</div>

		<!-- Score -->
		<div class="score-block">
			<div class="score-fraction">
				<span class="score-correct">{scoreData.correct}</span>
				<span class="score-slash"> / </span>
				<span class="score-total">{scoreData.total}</span>
			</div>
		</div>

		<!-- Labels -->
		<div class="labels-row">
			<span class="label-text">{categoryMap[$category]}</span>
			<span class="label-text">Brain Gym</span>
		</div>

		<!-- Dropdown panels -->
		<div class="panels">
			{#each $sessionQuestions as question, idx}
				{@const isCorrect = $answers[idx] === question.correctIndex}
				<div class="panel {isCorrect ? 'panel-correct' : 'panel-incorrect'}">
					<button
						class="panel-header {isCorrect ? 'panel-header-correct' : 'panel-header-incorrect'}"
						onclick={() => togglePanel(idx)}
						aria-expanded={!!openPanels[idx]}
					>
						<span class="panel-title">Question {idx + 1}</span>
						<span class="panel-chevron {openPanels[idx] ? 'chevron-open' : ''}">&#8964;</span>
					</button>

					{#if openPanels[idx]}
						<div class="panel-body">
							<p class="panel-question"><strong>Question:</strong> {question.question}</p>
							<p class="panel-answer">Correct answer: {question.options[question.correctIndex]}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Start Again button -->
		<button class="start-again-btn" onclick={handleNewSession}>
			Start a New Quiz
		</button>

	{:else}
		<!-- Beat the Clock Results -->
		
		<!-- Helper text: timeout vs completed -->
		<div class="btc-heading">
			{timerRanOut ? 'The clock beat you!' : 'You beat the clock!'}
		</div>

		<div class="score-block">
			<div class="score-fraction">
				<span class="score-correct">{scoreData.correct}</span>
				<span class="score-slash"> / </span>
				<span class="score-total">{scoreData.total}</span>
			</div>
		</div>

		<div class="labels-row">
			<span class="label-text">{categoryMap[$category] || $category}</span>
			<span class="label-text">Beat the Clock</span>
		</div>

		<!-- Beat the Clock accordion -->
		<div class="panels">
			{#each $sessionQuestions as question, idx}
				{@const isCorrect = $answers[idx] === question.correctIndex}
				{@const answered = $answers[idx] !== null}
				<div class="panel {isCorrect ? 'panel-correct' : 'panel-incorrect'}">
					<button
						class="panel-header {isCorrect ? 'panel-header-correct' : 'panel-header-incorrect'}"
						onclick={() => togglePanel(idx)}
						aria-expanded={!!openPanels[idx]}
					>
						<span class="panel-title">Question {idx + 1}</span>
						<span class="panel-chevron {openPanels[idx] ? 'chevron-open' : ''}">&#8964;</span>
					</button>

					{#if openPanels[idx]}
						<div class="panel-body">
							<p class="panel-question"><strong>Question:</strong> {question.question}</p>
							<p class="panel-answer">Correct answer: {question.options[question.correctIndex]}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<button class="start-again-btn" onclick={handleNewSession}>
			Start a New Quiz
		</button>
	{/if}

</div>

<style>
	.results-wrap {
		padding: 24px 16px 32px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	/* Beat the Clock heading */
	.btc-heading {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-primary);
		text-align: center;
		margin-bottom: 16px;
	}

	/* Score */
	.score-block {
		text-align: center;
		margin-bottom: 12px;
	}

	.score-fraction {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 12px;
		font-family: var(--font-main);
	}

	.score-correct {
		font-size: 3rem;
		font-weight: 800;
		color: var(--color-primary);
		line-height: 1;
	}

	.score-slash {
		font-size: 2.25rem;
		color: #d1d5db;
		font-weight: 700;
		line-height: 1;
	}

	.score-total {
		font-size: 2rem;
		color: #9ca3af;
		font-weight: 700;
		line-height: 1;
	}

	.score-pct {
		font-size: 1.5rem;
		font-weight: 700;
		color: #374151;
		margin-top: 4px;
		font-family: var(--font-main);
	}

	/* Labels */
	.labels-row {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-bottom: 24px;
	}

	.label-text {
		font-family: var(--font-main);
		font-size: 0.875rem;
		font-weight: 700;
		color: #374151;
	}

	.label-text + .label-text::before {
		content: '·';
		margin-right: 10px;
		color: #9ca3af;
	}

	/* Panels */
	.panels {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 28px;
	}

	.panel {
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
	}

	.panel-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px;
		border: none;
		cursor: pointer;
		font-family: var(--font-main);
		font-size: 0.9375rem;
		font-weight: 700;
		text-align: left;
		transition: opacity 0.15s;
	}

	.panel-header:active {
		opacity: 0.85;
	}

	.panel-header-correct {
		background: #eaf6ee;
		color: #15803d;
	}

	.panel-header-incorrect {
		background: #fdecea;
		color: #b91c1c;
	}

	.panel-title {
		flex: 1;
	}

	.panel-chevron {
		font-size: 1.25rem;
		line-height: 1;
		display: inline-block;
		transition: transform 0.2s;
		color: inherit;
	}

	.chevron-open {
		transform: rotate(180deg);
	}

	/* Panel body */
	.panel-body {
		background: #ffffff;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.panel-question {
		font-size: 0.9375rem;
		color: #1a1a2e;
		line-height: 1.55;
		font-family: var(--font-main);
	}

	.panel-answer {
		font-size: 0.9rem;
		color: #374151;
		line-height: 1.5;
		font-family: var(--font-main);
	}

	.panel-skipped {
		color: #9ca3af;
		font-style: italic;
	}

	/* Start Again button */
	.start-again-btn {
		width: 100%;
		padding: 14px 24px;
		background: var(--color-primary);
		color: #ffffff;
		font-family: var(--font-main);
		font-size: 1rem;
		font-weight: 700;
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.1s;
		margin-top: 4px;
	}

	.start-again-btn:active {
		transform: scale(0.97);
		opacity: 0.9;
	}
</style>
