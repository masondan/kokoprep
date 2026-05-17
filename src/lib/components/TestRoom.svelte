<script>
	import {
		mode,
		category,
		screen,
		sessionQuestions,
		currentIndex,
		answers,
		currentQuestion
	} from '$lib/stores/quiz.js';
	import ProgressBar from './ProgressBar.svelte';
	import QuestionCard from './QuestionCard.svelte';
	import Timer from './Timer.svelte';

	const categoryMap = {
		mathematics: 'Mathematics',
		english: 'English Language',
		science: 'Basic Science & Technology',
		social: 'Social Studies & Civics',
		crs: 'Christian Religious Studies',
		agriculture: 'Agricultural & Computer Studies',
		mix: 'Mix It Up'
	};

	let answerLocked = $state(false);
	let selectedAnswer = $state(null);
	let showExplanation = $state(false);

	$effect(() => {
		if ($currentQuestion) {
			answerLocked = false;
			selectedAnswer = $answers[$currentIndex] ?? null;
			showExplanation = selectedAnswer !== null && $mode === 'braingym';
		}
	});

	function handleSelectAnswer(optionIndex) {
		if (answerLocked && $mode === 'braingym') return;

		answers.update(arr => {
			arr[$currentIndex] = optionIndex;
			return arr;
		});

		selectedAnswer = optionIndex;

		if ($mode === 'braingym') {
			answerLocked = true;
			showExplanation = true;
		}
	}

	function handleNext() {
		if ($currentIndex < $sessionQuestions.length - 1) {
			currentIndex.update(i => i + 1);
			selectedAnswer = null;
			showExplanation = false;
		} else {
			screen.set('results');
		}
	}
</script>

<div class="testroom">
	<!-- Sub-header: category + counter/timer -->
	<div class="test-header">
		<span class="test-category">{categoryMap[$category] ?? $category}</span>
		{#if $mode === 'braingym'}
			<span class="test-counter">Q {$currentIndex + 1} of {$sessionQuestions.length}</span>
		{:else}
			<Timer />
		{/if}
	</div>

	<!-- Progress bar -->
	<ProgressBar />

	<!-- Question card -->
	{#if $currentQuestion}
		<QuestionCard
			question={$currentQuestion}
			questionNumber={$currentIndex + 1}
			selectedAnswer={selectedAnswer}
			onSelectAnswer={handleSelectAnswer}
			isLocked={answerLocked}
			showExplanation={showExplanation}
			isLastQuestion={$currentIndex === $sessionQuestions.length - 1}
			onNext={handleNext}
		/>
	{/if}
</div>

<style>
	.testroom {
		max-width: 480px;
		margin: 0 auto;
		background: #ffffff;
		min-height: 100%;
	}

	/* Sub-header row */
	.test-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 20px 10px;
		border-bottom: 1px solid #f0f0f0;
	}

	.test-category {
		font-size: 0.875rem;
		font-weight: 700;
		color: #333333;
	}

	.test-counter {
		font-size: 0.875rem;
		font-weight: 600;
		color: #777777;
	}
</style>
